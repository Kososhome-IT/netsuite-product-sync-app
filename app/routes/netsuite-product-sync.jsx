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

    // 🔍 Step 1: Try to find existing variant by SKU
    if (sku) {
      const query = `
        query {
          productVariants(first: 1, query: "sku:${sku}") {
            edges {
              node {
                id
                sku
                product {
                  id
                  title
                }
              }
            }
          }
        }
      `;

      const searchRes = await admin.graphql(query);
      const searchJson = await searchRes.json();
      const variantEdge = searchJson?.data?.productVariants?.edges?.[0];

      if (variantEdge) {
        productId = variantEdge.node.product.id;
      }
    }

    // ✅ Step 2: If productId found → Update
    if (productId) {
      const updateMutation = `
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              title
              descriptionHtml
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const updatePayload = {
        input: {
          id: productId,
          title,
          descriptionHtml: descriptionHtml || "",
        },
      };

      const updateRes = await admin.graphql(updateMutation, {
        variables: updatePayload,
      });

      const updateJson = await updateRes.json();
      return json({ action: "updated", result: updateJson });
    }

    // ✅ Step 3: Create new product (Shopify will auto-create default variant)
    const createMutation = `
      mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            descriptionHtml
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const createPayload = {
      input: {
        title,
        descriptionHtml: descriptionHtml || "",
      },
    };

    const createRes = await admin.graphql(createMutation, {
      variables: createPayload,
    });

    const createJson = await createRes.json();
    return json({ action: "created", result: createJson });
  } catch (error) {
    console.error("❌ Shopify Sync Error:", error);
    return json(
      { error: "Failed to sync with Shopify", details: error.message },
      { status: 500 }
    );
  }
};
