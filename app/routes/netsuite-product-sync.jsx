import { json } from "@remix-run/node";
import { createAdminApiClient } from "@shopify/admin-api-client";
import { ApiVersion } from "@shopify/shopify-app-remix/server";
import { sessionStorage } from "../shopify.server";
import { insertLog } from "../utils/insert-dashboard-log";
import { COUNTRY_MAP } from "../config/countries";

import {
  resolveFromNetSuite,
  resolveFromShopifyCategoryId,
  mergeMetafields,
  GLOBAL_METAFIELDS_CONFIG,
  VARIANT_METAFIELDS_CONFIG
} from "../services/category-resolver";

//============helper function===============
function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* =====================================================
 * METAOBJECT LIST RESOLVER
 * ===================================================== */
async function resolveMetaobjectIdsByDisplayValues({
  admin,
  metaobjectType,
  displayFieldKey,
  displayValues,
}) {
  const res = await admin.request(
    `
    query ($type: String!) {
      metaobjects(type: $type, first: 250) {
        nodes {
          id
          fields { key value }
        }
      }
    }
    `,
    { variables: { type: metaobjectType } }
  );

  const nodes = res?.data?.metaobjects?.nodes || [];
  const valueSet = new Set(displayValues);
  const resolvedIds = [];

  for (const node of nodes) {
    const field = node.fields.find(
      (f) => f.key === displayFieldKey && valueSet.has(f.value)
    );
    if (field) resolvedIds.push(node.id);
  }

  return resolvedIds;
}

function isValidMetafieldValue(value) {
  if (value === undefined || value === null) return false;

  // string
  if (typeof value === "string") {
    return value.trim() !== "";
  }

  // array
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  // object
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  return true;
}

function parseInchesAndPounds(rawValue) {
  if (!rawValue) return null;

  const str = String(rawValue).toLowerCase().trim();

  // extract number
  const numberMatch = str.match(/[\d.]+/);
  const value = numberMatch ? Number(numberMatch[0]) : null;

  if (!value) return null;

  // detect unit
  let unit = null;

  if (str.includes("in") || str.includes("inch")) {
    unit = "in";
  } else if (str.includes("lb") || str.includes("pound")) {
    unit = "lb";
  }

  return {
    value,
    unit,
  };
}

function transformMetafieldValue(mf) {
  const raw = mf.value;

  const parsed = parseInchesAndPounds(raw);

  // DIMENSION
  if (mf.type === "dimension") {
    return JSON.stringify({
      value: parsed?.value ?? Number(raw),
      unit: "in",
    });
  }

  // WEIGHT
  if (mf.type === "weight") {
    return JSON.stringify({
      value: parsed?.value ?? Number(raw),
      unit: "lb",
    });
  }

  // default
  if (typeof raw === "string") return raw;
  return JSON.stringify(raw);
}

export const action = async ({ request }) => {
  const shop = process.env.SHOP;

  let productId;
  let variantId;
  let inventoryItemId;
  let actionType = "updated";
  let sku;
  let title;
  let netsuite_user = "system";

  try {
    /* ================= SESSION ================= */
    const offlineSessionId = `offline_${shop}`;
    const session = await sessionStorage.loadSession(offlineSessionId);

    if (!session) {
      return json({ error: "Offline session missing" }, { status: 401 });
    }

    const admin = createAdminApiClient({
      storeDomain: shop,
      apiVersion: "2026-04",
      accessToken: session.accessToken,
    });

    /* ================= LOCATIONS ================= */
    const locationRes = await admin.request(`
      query {
        locations(first: 10) {
          edges { node { id name } }
        }
      }
    `);

    const locationMap = {};
    for (const edge of locationRes.data.locations.edges) {
      locationMap[edge.node.name.toLowerCase()] = edge.node.id;
    }

    /* ================= PAYLOAD ================= */
    const payload = await request.json();
    // console.log("🔍 FULL PAYLOAD:", JSON.stringify(payload, null, 2));

    const { netsuite_category } = payload;

    ({ title, sku, netsuite_user = "system" } = payload);
    const { color, size } = payload;

    const {
      descriptionHtml = "",
      vendor,
      price = "0.00",
      barcode,
      hs_code,
      country_of_origin,
      weight,
      metafields = [],
      variant_metafields = [],
    } = payload;
// console.log("🔍 VARIANT METAFIELDS RECEIVED:", variant_metafields);
    if (!title || !sku) {
      return json({ error: "title and sku are required" }, { status: 400 });
    }

    /* ================= CATEGORY ================= */
    let createCategoryConfig = null;
    let categoryMetafields = [];

    if (netsuite_category) {
      createCategoryConfig = resolveFromNetSuite(netsuite_category);
    }

    /* ================= SEARCH SKU ================= */
    const searchRes = await admin.request(
      `
      query ($query: String!) {
        productVariants(first: 1, query: $query) {
          edges {
            node {
              id
              product { id }
              inventoryItem { id }
            }
          }
        }
      }
      `,
      { variables: { query: `sku:${sku}` } }
    );

    const existingVariant =
      searchRes.data?.productVariants?.edges?.[0]?.node;

    /* ================= CREATE ================= */
    if (!existingVariant) {
      actionType = "created";

      const productRes = await admin.request(
  `
  mutation productCreate($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product {
        id
        options {
          id
          name
          optionValues { name }
        }
      }
      userErrors { field message }
    }
  }
  `,
  {
    variables: {
      product: {
        title,
        status: "DRAFT",
        handle: [
  payload.handle || slugify(title),
  slugify(color),
]
  .filter(Boolean)
  .join("-"),
        vendor,
        descriptionHtml,

        ...(createCategoryConfig && {
          category: createCategoryConfig.taxonomyId,
        }),

        // 🔥 CREATE OPTIONS HERE
        productOptions: [
          ...(payload.color && payload.color.trim()
            ? [{
                name: "Color",
                values: [{ name: payload.color.trim() }],
              }]
            : []),

          ...(payload.size && payload.size.trim()
            ? [{
                name: "Size",
                values: [{ name: payload.size.trim() }],
              }]
            : []),

          ...(payload.style && payload.style.trim()
            ? [{
                name: "Style",
                values: [{ name: payload.style.trim() }],
              }]
            : []),  
        ],
      },
    },
  }
);


      if (productRes.data.productCreate.userErrors.length) {
        throw new Error(
          JSON.stringify(productRes.data.productCreate.userErrors)
        );
      }

      productId = productRes.data.productCreate.product.id;

      const productQueryRes = await admin.request(
        `
        query ($id: ID!) {
          product(id: $id) {
            variants(first: 1) {
              edges {
                node { id inventoryItem { id } }
              }
            }
          }
        }
        `,
        { variables: { id: productId } }
      );

      const node =
        productQueryRes.data.product.variants.edges[0].node;

      variantId = node.id;
      /* ================= LINK COLOR METAOBJECT ================= */

if (color && color.trim()) {
console.log('run 1')
  const colorMetaobjectIds =
    await resolveMetaobjectIdsByDisplayValues({
      admin,
      metaobjectType: "shopify--color-pattern",
      displayFieldKey: "label",
      displayValues: [color],
    });

  const colorMetaobjectId =
    colorMetaobjectIds?.[0];
console.log(colorMetaobjectId)
  if (!colorMetaobjectId) {
    throw new Error(
      `No color metaobject found for: ${color}`
    );
  }

  /* ================= REFRESH PRODUCT OPTIONS ================= */

  const optionQueryRes = await admin.request(
    `
    query ($id: ID!) {
      product(id: $id) {
        options {
          id
          name

          optionValues {
            id
            name
          }
        }
      }
    }
    `,
    {
      variables: {
        id: productId,
      }
    }
  );

  const colorOption =
    optionQueryRes.data.product.options.find(
      (o) => o.name === "Color"
    );

    console.log(
  "🎨 COLOR OPTION:",
  JSON.stringify(colorOption, null, 2)
);

  if (!colorOption) {
    throw new Error(
      "Color option not found"
    );
  }

  const colorOptionValue =
    colorOption.optionValues.find(
      (v) => v.name === color.trim()
    );

  if (!colorOptionValue) {
    throw new Error(
      "Color option value not found"
    );
  }

  /* ================= CONVERT OPTION TO LINKED ================= */

  const optionUpdateRes = await admin.request(
    `
    mutation productOptionUpdate(
      $productId: ID!,
      $option: OptionUpdateInput!,
      $optionValuesToUpdate: [OptionValueUpdateInput!],
      
    ) {
      productOptionUpdate(
        productId: $productId,
        option: $option,
        optionValuesToUpdate: $optionValuesToUpdate,
      ) {
        userErrors {
          field
          message
        }
      }
    }
    `,
    {
      variables: {
        productId,

        option: {
          id: colorOption.id,

          linkedMetafield: {
            namespace: "shopify",
            key: "color-pattern",
          }
        },

        optionValuesToUpdate: [
          {
            id: colorOptionValue.id,
            linkedMetafieldValue:
              colorMetaobjectId,
          }
        ]
      }
    }
  );

  const optionErrors =
    optionUpdateRes
      ?.data
      ?.productOptionUpdate
      ?.userErrors;
console.log(
  "🔗 OPTION UPDATE RESPONSE:",
  JSON.stringify(optionUpdateRes, null, 2)
);
  if (optionErrors?.length) {
    throw new Error(
      JSON.stringify(optionErrors)
    );
  }

  const verifyRes = await admin.request(
  `
  query ($id: ID!) {
    product(id: $id) {

      options {
        id
        name

        linkedMetafield {
          namespace
          key
        }

        optionValues {
          id
          name
          linkedMetafieldValue
        }
      }
    }
  }
  `,
  {
    variables: {
      id: productId,
    }
  }
);

console.log(
  "✅ FINAL VERIFY:",
  JSON.stringify(
    verifyRes.data.product.options,
    null,
    2
  )
);
}

      inventoryItemId = node.inventoryItem.id;
await admin.request(
  `
  mutation inventoryItemUpdate(
    $id: ID!,
    $input: InventoryItemInput!
  ) {
    inventoryItemUpdate(
      id: $id,
      input: $input
    ) {
      inventoryItem {
        id
        tracked
      }

      userErrors {
        field
        message
      }
    }
  }
  `,
  {
    variables: {
      id: inventoryItemId,

      input: {
        tracked: true,
      }
    }
  }
);

      categoryMetafields = createCategoryConfig?.metafields || [];
    } else {
      productId = existingVariant.product.id;
      variantId = existingVariant.id;
      inventoryItemId = existingVariant.inventoryItem.id;
      // console.log("🔍 VARIANT ID 3:", variantId);
    }
/* ================= UPDATE SKU / BARCODE / HS CODE ================= */

if (variantId && productId) {
  const variantUpdateRes = await admin.request(
    `
    mutation productVariantsBulkUpdate(
      $productId: ID!,
      $variants: [ProductVariantsBulkInput!]!
    ) {
      productVariantsBulkUpdate(
        productId: $productId,
        variants: $variants
      ) {
        userErrors {
          field
          message
        }
      }
    }
    `,
    {
      variables: {
        productId: productId,
        variants: [
          {
            id: variantId,
            taxable: false,
               ...(price && {
      price: String(price),
    }),

            ...(barcode && { barcode }),

            inventoryItem: {
              ...(sku && { sku }),
              ...(hs_code && { harmonizedSystemCode: hs_code }),
              ...(country_of_origin && {countryCodeOfOrigin:COUNTRY_MAP[country_of_origin] || country_of_origin,}),
            },
          },
        ],
      },
    }
  );

  const errors =
    variantUpdateRes?.data?.productVariantsBulkUpdate?.userErrors;

  if (errors?.length) {
    throw new Error(JSON.stringify(errors));
  }
}
    /* ================= UPDATE PRODUCT ================= */
    await admin.request(
      `
      mutation productUpdate($input: ProductInput!) {
        productUpdate(input: $input) {
          userErrors { field message }
        }
      }
      `,
      {
        variables: {
          input: {
            id: productId,
            title,
            descriptionHtml,
            vendor,
            ...(createCategoryConfig && {
              category: createCategoryConfig.taxonomyId,
            }),
          },
        },
      }
    );

    /* ================= CATEGORY RESOLVE UPDATE ================= */
    if (actionType === "updated") {
      const categoryRes = await admin.request(
        `
        query ($id: ID!) {
          product(id: $id) {
            category { id }
          }
        }
        `,
        { variables: { id: productId } }
      );

      const updateCategoryConfig =
        resolveFromShopifyCategoryId(
          categoryRes.data.product.category?.id
        );

      categoryMetafields =
        updateCategoryConfig?.metafields || [];
    }

    /* =====================================================
       CONTROLLED GLOBAL + CATEGORY METAFIELDS
    ===================================================== */

/* ================= PRODUCT KEYS ================= */
const globalProductKeys = new Set(
  (GLOBAL_METAFIELDS_CONFIG || [])
    .filter(mf => mf.owner !== "variant")
    .map(mf => `${mf.namespace}.${mf.key}`)
);

const categoryProductKeys = new Set(
  (categoryMetafields || [])
    .filter(mf => mf.owner !== "variant")
    .map(mf => `${mf.namespace || "custom"}.${mf.key}`)
);

const productAllowedKeys = new Set([
  ...globalProductKeys,
  ...categoryProductKeys,
]);

/* ================= VARIANT KEYS ================= */
const globalVariantKeys = new Set(
  (VARIANT_METAFIELDS_CONFIG || [])
    .map(mf => `${mf.namespace}.${mf.key}`)
);

const variantAllowedKeys = new Set([
  ...globalVariantKeys,
]);
// console.log("🔍 VARIANT ALLOWED KEYS:", [...variantAllowedKeys]);
    const payloadMetaobjectFields = metafields.filter(
      (mf) => mf.type === "metaobject_reference"
    );

    const payloadNormalFields = metafields.filter(
      (mf) => mf.type !== "metaobject_reference"
    );

    const filteredNormalFields = payloadNormalFields.filter(
  (mf) =>
    productAllowedKeys.has(`${mf.namespace || "custom"}.${mf.key}`) &&
    mf.value !== undefined &&
    mf.value !== null &&
    mf.value !== ""
);

    let resolvedMetaobjectFields = [];

    for (const mf of payloadMetaobjectFields) {
      if (!productAllowedKeys.has(`${mf.namespace || "custom"}.${mf.key}`))
  continue;

      const resolvedIds = await resolveMetaobjectIdsByDisplayValues({
        admin,
        metaobjectType: mf.metaobject_type,
        displayFieldKey: mf.display_field_key,
        displayValues: mf.value,
      });

      if (!resolvedIds.length) continue;

      resolvedMetaobjectFields.push({
        namespace: mf.namespace || "custom",
        key: mf.key,
        type: mf.type,
        value: JSON.stringify(resolvedIds),
      });
    }

    const finalMetafields = [
      ...filteredNormalFields,
      ...resolvedMetaobjectFields,
    ];

    const CHUNK_SIZE = 25;

    for (let i = 0; i < finalMetafields.length; i += CHUNK_SIZE) {
      const chunk = finalMetafields.slice(i, i + CHUNK_SIZE);

      const response = await admin.request(
        `
        mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            userErrors { field message }
          }
        }
        `,
        {
          variables: {
            metafields: chunk.map((mf) => ({
              ownerId: productId,
              //  ownerId: variantId,
              namespace: mf.namespace || "custom",
              key: mf.key,
              type: mf.type,
              value: mf.value,
            })),
          },
        }
      );

      const errors =
        response?.data?.metafieldsSet?.userErrors;

      if (errors?.length) {
        throw new Error(JSON.stringify(errors));
      }
    }
/* ================= VARIANT METAFIELDS ================= */

if (variantId && variant_metafields.length) {

  const variant_payloadMetaobjectFields = variant_metafields.filter(
    (mf) => mf.type === "metaobject_reference"
  );

  const variant_payloadNormalFields = variant_metafields.filter(
    (mf) => mf.type !== "metaobject_reference"
  );

const variant_filteredNormalFields = variant_payloadNormalFields.filter(
  (mf) => {
    const key = `${mf.namespace || "custom"}.${mf.key}`;
    const isAllowed = variantAllowedKeys.has(key);

    const isValid = isValidMetafieldValue(mf.value);

    // console.log("🔍 CHECK VARIANT MF:", {
    //   key,
    //   value: mf.value,
    //   isAllowed,
    //   isValid,
    // });

    return isAllowed && isValid;
  }
);
  let variantResolvedMetaobjectFields = [];

  for (const mf of variant_payloadMetaobjectFields) {
    if (!variantAllowedKeys.has(`${mf.namespace || "custom"}.${mf.key}`))
      continue;

    const resolvedIds = await resolveMetaobjectIdsByDisplayValues({
      admin,
      metaobjectType: mf.metaobject_type,
      displayFieldKey: mf.display_field_key,
      displayValues: mf.value,
    });

    if (!resolvedIds.length) continue;

    variantResolvedMetaobjectFields.push({
      namespace: mf.namespace || "custom",
      key: mf.key,
      type: mf.type,
      value: JSON.stringify(resolvedIds),
    });
  }

  const finalVariantMetafields = [
    ...variant_filteredNormalFields,
    ...variantResolvedMetaobjectFields,
  ];
// console.log("🔍 FINAL VARIANT METAFIELDS:", finalVariantMetafields);
  const CHUNK_SIZE = 25;

  for (let i = 0; i < finalVariantMetafields.length; i += CHUNK_SIZE) {
    const chunk = finalVariantMetafields.slice(i, i + CHUNK_SIZE);
// console.log(`🔍 SENDING VARIANT CHUNK:${i}`, chunk);
    const response = await admin.request(
      `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          userErrors { field message }
        }
      }
      `,
      {
        variables: {
          metafields: chunk.map((mf) => ({
            ownerId: variantId, // ✅ correct
            namespace: mf.namespace || "custom",
            key: mf.key,
            type: mf.type,
            value: transformMetafieldValue(mf),
          })),
        },
      }
    );

    const errors = response?.data?.metafieldsSet?.userErrors;
      // console.log("🔍 SHOPIFY VARIANT RESPONSE:", JSON.stringify(response, null, 2));

   if (errors?.length) {
  console.error("❌ VARIANT METAFIELD ERROR:", errors);
  console.error("❌ FAILED CHUNK:", chunk);
  throw new Error(JSON.stringify(errors));
}
  }
}
    /* ================= SUCCESS ================= */
    await insertLog({
      shop,
      netsuite_user,
      product_sku: sku,
      shopify_product_id: productId,
      product_name: title,
      action: actionType,
      status: "success",
    });

    return json({ success: true, action: actionType });

  } catch (error) {
    await insertLog({
      shop,
      netsuite_user,
      product_sku: sku ?? "unknown",
      shopify_product_id: productId ?? null,
      product_name: title ?? null,
      action: actionType,
      status: "failed",
      error_message: error.message,
    });

    return json(
      { error: "Failed", details: error.message },
      { status: 500 }
    );
  }
};