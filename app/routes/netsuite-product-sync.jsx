// app/routes/netsuite-product-sync.jsx
import { json } from "@remix-run/node";
import { unauthenticated } from "../shopify.server";

export const action = async ({ request }) => {
  const storeDomain = "dummy-ranjit.myshopify.com";

  try {
    const { admin } = await unauthenticated.admin(storeDomain);
    const payload = await request.json();
    const { sku, title, descriptionHtml } = payload;

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
    const product = await createJson?.data?.productCreate?.product;
    const variantId = await product?.variants?.edges?.[0]?.node?.id;
console.log("creation response : " ,variantId)
    if (!product?.id || !variantId) {
      return json({ error: `${createRes} : "Created product, but missing variant"` }, { status: 500 });
    }

    // ✅ Update SKU using productVariantsBulkUpdate
    if (sku) {
      const bulkUpdate = `
        mutation productVariantsBulkUpdate(
          $productId: ID!
          $variants: [ProductVariantsBulkInput!]!
        ) {
          productVariantsBulkUpdate(productId: $productId, variants: $variants) {
            product { id }
            productVariants { id sku }
            userErrors { field message }
          }
        }
      `;

      const variantRes = await admin.graphql(bulkUpdate, {
        variables: {
          productId: product.id,
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

      return json({
        action: "created",
        productId: product.id,
        variantUpdated: true
      });
    }

    return json({
      action: "created",
      productId: product.id,
      variantUpdated: false
    });
  } catch (error) {
    console.error("❌ Shopify Sync Error:", error);
    return json({ error: "Failed to sync", details: error.message }, { status: 500 });
  }
};
