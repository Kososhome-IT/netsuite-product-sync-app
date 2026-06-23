import { json } from "@remix-run/node";
import { getAdminClient } from "../services/shopify-admin.service";
import { insertLog } from "../utils/insert-dashboard-log";
import { createProduct,updateProduct,getProductCategory} from "../services/product-create/shopify/product-create.service";
import { setInventoryTracking} from "../services/product-create/shopify/inventory.service";
import { getLocations} from "../services/product-create/shopify/location.service";
import {setMetafields} from "../services/product-create/shopify/metafield.service";
import { getVariants,getvariantId ,updateVariant,productOptionUpdate} from "../services/product-create/shopify/variant.service";
import { resolveMetaobjectIdsByDisplayValues} from "../services/product-create/shopify/metaobject.service";
import { slugify ,isValidMetafieldValue,transformMetafieldValue} from "../services/product-create/shopify/utils/product-create.utils";
import {
  resolveFromNetSuite,
  resolveFromShopifyCategoryId,
  mergeMetafields,
  GLOBAL_METAFIELDS_CONFIG,
  VARIANT_METAFIELDS_CONFIG,
} from "../services/product-create/shopify/category-resolver";


export const action = async ({ request }) => {

  let productId;
  let variantId;
  let inventoryItemId;
  let actionType = "updated";
  let sku;
  
  let warningLogs = [];
  let createCategoryConfig = null;
  let categoryMetafields = [];
  let netsuite_user = "system",
  try {
   
    const admin = getAdminClient()

    /* ================= LOCATIONS ================= */
    const locationRes = await getLocations(admin)

    const locationMap = {};
    for (const edge of locationRes.data.locations.edges) {
      locationMap[edge.node.name.toLowerCase()] = edge.node.id;
    }

    /* ================= PAYLOAD ================= */
    const payload = await request.json();
    console.log("PAYLOAD:", JSON.stringify(payload, null, 2));
    
    const {netsuite_user,
       title, sku,color, size ,
      netsuite_category,
      descriptionHtml,
      madeToOrder,
      vendor,
      price = "0.00",
      compare_at,
      barcode,
      hs_code,
      country_of_origin,
      weight,
      metafields = [],
      variant_metafields = [],
    } = payload;
  

    console.log("🔍 VARIANT METAFIELDS RECEIVED:", variant_metafields);

    if (!title || !sku) {
      return json({ error: "title and sku are required" }, { status: 400 });
    }

    /* ================= CATEGORY ================= */
    

    if (netsuite_category) {
      createCategoryConfig = resolveFromNetSuite(netsuite_category);
    }

    /* ================= SEARCH SKU ================= */
    const searchRes = await getVariants(admin,sku)

    const existingVariant = searchRes.data?.productVariants?.edges?.[0]?.node;

    /* ================= CREATE PRODUCT IF NOT EXISTS ================= */
    if (!existingVariant) {
      actionType = "created";
      payload.prohandle = [
        payload.handle || slugify(title),
        slugify(payload.style),
        slugify(color),
        slugify(size),
      ]
        .filter(Boolean)
        .join("-");
  payload.createCategoryConfig = createCategoryConfig
      const productRes = await createProduct(admin, payload)

      if (productRes.data.productCreate.userErrors.length) {
        throw new Error(JSON.stringify(productRes.data.productCreate.userErrors));
      }

      productId = productRes.data.productCreate.product.id;

      const productQueryRes = await getvariantId(admin,productId);

      const node = productQueryRes.data.product.variants.edges[0].node;
      variantId = node.id;

      /* ================= LINK COLOR METAOBJECT ================= */
      if (color && color.trim()) {
        console.log("run 1");
        const colorMetaobjectIds = await resolveMetaobjectIdsByDisplayValues({
          admin,
          metaobjectType: "shopify--color-pattern",
          displayFieldKey: "label",
          displayValues: [color],
        });

        const colorMetaobjectId = colorMetaobjectIds?.[0];
        console.log(colorMetaobjectId);

        if (!colorMetaobjectId) {
          const warningMessage = `No color metaobject found for color: ${color}`;
          console.log(`⚠️ ${warningMessage}`);
          warningLogs.push(warningMessage);
        } else {
          /* ================= REFRESH PRODUCT OPTIONS ================= */
          const optionQueryRes = await admin.request(
            `
            query ($id: ID!) {
              product(id: $id) {
                options {
                  id
                  name
                  optionValues { id name }
                }
              }
            }
            `,
            { variables: { id: productId } }
          );

          const colorOption = optionQueryRes.data.product.options.find(
            (o) => o.name === "Color"
          );
          console.log("🎨 COLOR OPTION:", JSON.stringify(colorOption, null, 2));

          if (!colorOption) {
            throw new Error("Color option not found");
          }

          const colorOptionValue = colorOption.optionValues.find(
            (v) => v.name === color.trim()
          );

          if (!colorOptionValue) {
            throw new Error("Color option value not found");
          }

          /* ================= CONVERT OPTION TO LINKED ================= */
          const optionUpdateRes = await productOptionUpdate(admin, {
  productId,
  colorOption,
  colorOptionValue,
  colorMetaobjectId,
});

          const optionErrors = optionUpdateRes?.data?.productOptionUpdate?.userErrors;
          console.log("🔗 OPTION UPDATE RESPONSE:", JSON.stringify(optionUpdateRes, null, 2));

          if (optionErrors?.length) {
            throw new Error(JSON.stringify(optionErrors));
          }
        }
      }

      inventoryItemId = node.inventoryItem.id;
     await setInventoryTracking(admin,inventoryItemId)

      categoryMetafields = createCategoryConfig?.metafields || [];
    } else {
      productId = existingVariant.product.id;
      variantId = existingVariant.id;
      inventoryItemId = existingVariant.inventoryItem.id;
    }

    /* ================= UPDATE SKU / BARCODE / HS CODE ================= */
    if (variantId && productId) {
     const variantUpdateRes = await updateVariant(admin, {
  productId,
  variantId,
  madeToOrder,
  price,
  compare_at,
  barcode,
  sku,
  hs_code,
  country_of_origin,
});

      const errors = variantUpdateRes?.data?.productVariantsBulkUpdate?.userErrors;
      if (errors?.length) {
        throw new Error(JSON.stringify(errors));
      }
    }

    /* ================= UPDATE PRODUCT DETAILS ================= */
    await updateProduct(admin, {
  productId,
  title,
  descriptionHtml,
  vendor,
  createCategoryConfig,
});

    /* ================= CATEGORY RESOLVE UPDATE ================= */
    if (actionType === "updated") {
     const categoryRes = await getProductCategory(admin, {productId,});

      const updateCategoryConfig = resolveFromShopifyCategoryId(
        categoryRes.data.product.category?.id
      );
      categoryMetafields = updateCategoryConfig?.metafields || [];
    }

    /* =====================================================
     * CONTROLLED GLOBAL + CATEGORY METAFIELDS
     * ===================================================== */

    /* ================= PRODUCT KEYS ================= */
    const globalProductKeys = new Set(
      (GLOBAL_METAFIELDS_CONFIG || [])
        .filter((mf) => mf.owner !== "variant")
        .map((mf) => `${mf.namespace}.${mf.key}`)
    );

    const categoryProductKeys = new Set(
      (categoryMetafields || [])
        .filter((mf) => mf.owner !== "variant")
        .map((mf) => `${mf.namespace || "custom"}.${mf.key}`)
    );

    const productAllowedKeys = new Set([...globalProductKeys, ...categoryProductKeys]);

    /* ================= VARIANT KEYS ================= */
    const globalVariantKeys = new Set(
      (VARIANT_METAFIELDS_CONFIG || []).map((mf) => `${mf.namespace}.${mf.key}`)
    );
    const variantAllowedKeys = new Set([...globalVariantKeys]);

    const payloadMetaobjectFields = metafields.filter((mf) => mf.type === "metaobject_reference");
    const payloadNormalFields = metafields.filter((mf) => mf.type !== "metaobject_reference");

    const filteredNormalFields = payloadNormalFields.filter(
      (mf) =>
        productAllowedKeys.has(`${mf.namespace || "custom"}.${mf.key}`) &&
        mf.value !== undefined &&
        mf.value !== null &&
        mf.value !== ""
    );

    let resolvedMetaobjectFields = [];

    for (const mf of payloadMetaobjectFields) {
      if (!productAllowedKeys.has(`${mf.namespace || "custom"}.${mf.key}`)) continue;

      const resolvedIds = await resolveMetaobjectIdsByDisplayValues({
        admin,
        metaobjectType: mf.metaobject_type,
        displayFieldKey: mf.display_field_key,
        displayValues: [mf.value],
      });

      if (!resolvedIds.length) continue;

      resolvedMetaobjectFields.push({
        namespace: mf.namespace || "custom",
        key: mf.key,
        type: mf.type,
        value: JSON.stringify(resolvedIds),
      });
    }

    const finalMetafields = [...filteredNormalFields, ...resolvedMetaobjectFields];
    const CHUNK_SIZE = 25;

    for (let i = 0; i < finalMetafields.length; i += CHUNK_SIZE) {
      const chunk = finalMetafields.slice(i, i + CHUNK_SIZE);
      const response = await setMetafields(admin, {productId,chunk,});
      const errors = response?.data?.metafieldsSet?.userErrors;
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

      const variant_filteredNormalFields = variant_payloadNormalFields.filter((mf) => {
        const key = `${mf.namespace || "custom"}.${mf.key}`;
        const isAllowed = variantAllowedKeys.has(key);
        const isValid = isValidMetafieldValue(mf.value);
        return isAllowed && isValid;
      });

      let variantResolvedMetaobjectFields = [];

      for (const mf of variant_payloadMetaobjectFields) {
        if (!variantAllowedKeys.has(`${mf.namespace || "custom"}.${mf.key}`)) continue;

        const resolvedIds = await resolveMetaobjectIdsByDisplayValues({
          admin,
          metaobjectType: mf.metaobject_type,
          displayFieldKey: mf.display_field_key,
          displayValues: [mf.value],
        });

        if (!resolvedIds.length) continue;

        variantResolvedMetaobjectFields.push({
          namespace: mf.namespace || "custom",
          key: mf.key,
          type: mf.type,
          value: resolvedIds[0],
        });
      }

      const finalVariantMetafields = [
        ...variant_filteredNormalFields,
        ...variantResolvedMetaobjectFields,
      ];
      console.log("🔍 FINAL VARIANT METAFIELDS:", finalVariantMetafields);

      for (let i = 0; i < finalVariantMetafields.length; i += CHUNK_SIZE) {
        const chunk = finalVariantMetafields.slice(i, i + CHUNK_SIZE);
        const response = await setMetafields(admin, {productId,chunk,});
        const errors = response?.data?.metafieldsSet?.userErrors;
        if (errors?.length) {
          console.error("❌ VARIANT METAFIELD ERROR:", errors);
          console.error("❌ FAILED CHUNK:", chunk);
          throw new Error(JSON.stringify(errors));
        }
      }
    }

    /* ================= SUCCESS LOGGING ================= */
    await insertLog({
      
      netsuite_user,
      product_sku: sku,
      shopify_product_id: productId,
      product_name: title,
      action: actionType,
      status: warningLogs.length ? "warning" : "success",
      error_message: warningLogs.length ? warningLogs.join(" | ") : null,
    });

    return json({ success: true, action: actionType });
  } catch (error) {
    /* ================= FAILED LOGGING ================= */
    await insertLog({
      
      netsuite_user,
      product_sku: sku || "unknown",
      shopify_product_id: productId || null,
      product_name: title || null,
      action: actionType,
      status: "failed",
      error_message: error.message,
    });

    return json({ error: "Failed", details: error.message }, { status: 500 });
  }
};