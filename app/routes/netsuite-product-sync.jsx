// app/routes/netsuite-product-sync.jsx
import { json } from "@remix-run/node";
import { unauthenticated } from "../shopify.server";

export const action = async ({ request }) => {
  const storeDomain = "dummy-ranjit.myshopify.com";

  try {
    const { admin } = await unauthenticated.admin(storeDomain);
    const payload = await request.json();
    const { sku, title, descriptionHtml, metafields = [] } = payload;

    if (!title) {
      return json({ error: "Title is required." }, { status: 400 });
    }

    let productId = null;

    // 🔍 Check if variant with SKU exists
    if (sku) {
      const searchQuery = `
        query {
          productVariants(first: 1, query: "sku:${sku}") {
            edges {
              node {
                id
                product {
                  id
                }
              }
            }
          }
        }
      `;
      const searchRes = await admin.graphql(searchQuery);
      const searchJson = await searchRes.json();
      const variantEdge = searchJson?.data?.productVariants?.edges?.[0];
      if (variantEdge) {
        productId = variantEdge.node.product.id;
      }
    }

    // ✅ Update product if exists
    if (productId) {
      const updateMutation = `
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product { id title descriptionHtml }
            userErrors { field message }
          }
        }
      `;
      await admin.graphql(updateMutation, {
        variables: {
          input: {
            id: productId,
            title,
            descriptionHtml: descriptionHtml || ""
          }
        }
      });

      // ✅ Update metafields
      if (metafields.length > 0) {
        await updateMetafields(admin, productId, metafields);
      }

      return json({ action: "updated", productId });
    }

    // ✅ Create new product
    const createMutation = `
      mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            variants(first: 1) {
              edges { node { id } }
            }
          }
          userErrors { field message }
        }
      }
    `;
    const createRes = await admin.graphql(createMutation, {
      variables: {
        input: {
          title,
          descriptionHtml: descriptionHtml || ""
        }
      }
    });
    const createJson = await createRes.json();
    const product = createJson?.data?.productCreate?.product;
    const productIdNew = product?.id;
    const variantId = product?.variants?.edges?.[0]?.node?.id;

    if (!productIdNew || !variantId) {
      return json({ error: "Created product, but missing variant" }, { status: 500 });
    }

    // ✅ Update SKU using productVariantsBulkUpdate
    if (sku) {
      const bulkUpdate = `
        mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkUpdate(productId: $productId, variants: $variants) {
            product { id }
            productVariants { id sku }
            userErrors { field message }
          }
        }
      `;

      const variantRes = await admin.graphql(bulkUpdate, {
        variables: {
          productId: productIdNew,
          variants: [
            {
              id: variantId,
              inventoryItem: { sku }
            }
          ]
        }
      });
      const variantJson = await variantRes.json();

      if (variantJson?.data?.productVariantsBulkUpdate?.userErrors?.length) {
        return json({
          error: "Variant bulk update failed",
          details: variantJson.data.productVariantsBulkUpdate.userErrors
        }, { status: 500 });
      }
    }

    // ✅ Update metafields
    if (metafields.length > 0) {
      await updateMetafields(admin, productIdNew, metafields);
    }

    return json({
      action: "created",
      productId: productIdNew,
      variantUpdated: !!sku
    });

  } catch (error) {
    console.error("❌ Shopify Sync Error:", error);
    return json({ error: "Failed to sync", details: error.message }, { status: 500 });
  }
};


// ✅ Reusable metafield update function
async function updateMetafields(admin, productId, metafields) {
  const mutation = `
    mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const inputs = metafields.map((field) => ({
    ownerId: productId,
    namespace: field.namespace || "custom",
    key: field.key,
    type: field.type, // e.g., "single_line_text_field"
    value: field.value
  }));

  const res = await admin.graphql(mutation, {
    variables: {
      metafields: inputs
    }
  });

  const resJson = await res.json();
  const errors = resJson?.data?.metafieldsSet?.userErrors;
  if (errors?.length) {
    console.warn("⚠️ Metafield errors:", errors);
  }
}
