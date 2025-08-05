import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

// 📌 Example payload:
// {
//   "sku": "ABC123",
//   "title": "New Product Title",
//   "bodyHtml": "<strong>Description</strong>",
//   "price": "29.99"
// }

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  try {
    const payload = await request.json();
    const { sku, title, bodyHtml, price } = payload;

    if (!sku || !title) {
      return json({ error: "SKU and Title are required." }, { status: 400 });
    }

    // 🔍 Step 1: Search for variant by SKU
    const query = `
      {
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
      // ✅ Product exists → Update it
      const productId = variantEdge.node.product.id;

      const updateMutation = `
        mutation UpdateProduct($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              title
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
          bodyHtml,
        },
      };

      const updateRes = await admin.graphql(updateMutation, updatePayload);
      const updateJson = await updateRes.json();

      return json({
        action: "updated",
        result: updateJson,
      });
    } else {
      // ❌ Product not found → Create it
      const createMutation = `
        mutation CreateProduct($input: ProductInput!) {
          productCreate(input: $input) {
            product {
              id
              title
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
          bodyHtml: bodyHtml || "",
          variants: [
            {
              sku,
              price: price || "0.00",
            },
          ],
        },
      };

      const createRes = await admin.graphql(createMutation, createPayload);
      const createJson = await createRes.json();

      return json({
        action: "created",
        result: createJson,
      });
    }
  } catch (error) {
    console.error("❌ Shopify Sync Error:", error);
    return json(
      { error: "Failed to sync with Shopify", details: error.message },
      { status: 500 }
    );
  }
};
