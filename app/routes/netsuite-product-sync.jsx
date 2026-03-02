import { json } from "@remix-run/node";
import { createAdminApiClient } from "@shopify/admin-api-client";
import { ApiVersion } from "@shopify/shopify-app-remix/server";
import { sessionStorage } from "../shopify.server";
import { insertLog } from "../utils/insert-dashboard-log";

import {
  resolveFromNetSuite,
  resolveFromShopifyCategoryId,
  mergeMetafields,
  GLOBAL_METAFIELDS_CONFIG,
} from "../services/category-resolver";

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
      apiVersion: ApiVersion.April25,
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
    const { netsuite_category } = payload;

    ({ title, sku, netsuite_user = "system" } = payload);

    const {
      descriptionHtml = "",
      vendor,
      price = "0.00",
      barcode,
      hs_code,
      country_of_origin,
      weight,
      metafields = [],
      quantity_by_location = {},
    } = payload;

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
        mutation productCreate($input: ProductInput!) {
          productCreate(input: $input) {
            product { id }
            userErrors { field message }
          }
        }
        `,
        {
          variables: {
            input: {
              title,
              vendor,
              descriptionHtml,
              ...(createCategoryConfig && {
                category: createCategoryConfig.taxonomyId,
              }),
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
      inventoryItemId = node.inventoryItem.id;

      categoryMetafields =
        createCategoryConfig?.metafields || [];
    } else {
      productId = existingVariant.product.id;
      variantId = existingVariant.id;
      inventoryItemId = existingVariant.inventoryItem.id;
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

    // Build allowed keys (GLOBAL + CATEGORY)
    const globalAllowedKeys = new Set(
      (GLOBAL_METAFIELDS_CONFIG || []).map(
        (mf) => `${mf.namespace}.${mf.key}`
      )
    );

    const categoryAllowedKeys = new Set(
      categoryMetafields.map(
        (mf) => `${mf.namespace || "custom"}.${mf.key}`
      )
    );

    const allowedKeys = new Set([
      ...globalAllowedKeys,
      ...categoryAllowedKeys,
    ]);

    const payloadMetaobjectFields = metafields.filter(
      (mf) => mf.type === "metaobject_reference"
    );

    const payloadNormalFields = metafields.filter(
      (mf) => mf.type !== "metaobject_reference"
    );

    const filteredNormalFields = payloadNormalFields.filter(
      (mf) =>
        allowedKeys.has(`${mf.namespace || "custom"}.${mf.key}`) &&
        mf.value !== undefined &&
        mf.value !== null &&
        mf.value !== ""
    );

    let resolvedMetaobjectFields = [];

    for (const mf of payloadMetaobjectFields) {
      if (!allowedKeys.has(`${mf.namespace || "custom"}.${mf.key}`))
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