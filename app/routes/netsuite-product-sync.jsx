// app/routes/netsuite-product-sync.jsx
import { json } from "@remix-run/node";
import { unauthenticated } from "../shopify.server";

export const action = async ({ request }) => {
  const storeDomain = "dummy-ranjit.myshopify.com";

  try {
    const { admin } = await unauthenticated.admin(storeDomain);
    const payload = await request.json();
    const {
      sku,
      title,
      descriptionHtml,
      metafields = [],
      variantMetafields = [],
    } = payload;

    if (!title) {
      return json({ error: "Title is required." }, { status: 400 });
    }

    let productId = null;
    let variantId = null;

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
        variantId = variantEdge.node.id;
      }
    }

    // ✅ Update product if exists
    if (productId && variantId) {
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
            descriptionHtml: descriptionHtml || "",
          },
        },
      });

      // ✅ Update product metafields
      if (metafields.length > 0) {
        await updateMetafields(admin, productId, metafields);
      }

      // ✅ Update variant metafields
      if (variantMetafields.length > 0) {
        await updateMetafields(admin, variantId, variantMetafields);
      }

      return json({ action: "updated", productId, variantId });
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
          descriptionHtml: descriptionHtml || "",
        },
      },
    });
    const createJson = await createRes.json();
    const product = createJson?.data?.productCreate?.product;
    const productIdNew = product?.id;
    const variantIdNew = product?.variants?.edges?.[0]?.node?.id;

    if (!productIdNew || !variantIdNew) {
      return json(
        { error: "Created product, but missing variant" },
        { status: 500 }
      );
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
              id: variantIdNew,
              inventoryItem: { sku },
            },
          ],
        },
      });

      const variantJson = await variantRes.json();
      if (
        variantJson?.data?.productVariantsBulkUpdate?.userErrors?.length
      ) {
        return json(
          {
            error: "Variant bulk update failed",
            details:
              variantJson.data.productVariantsBulkUpdate.userErrors,
          },
          { status: 500 }
        );
      }
    }

    // ✅ Update product metafields
    if (metafields.length > 0) {
      await updateMetafields(admin, productIdNew, metafields);
    }

    // ✅ Update variant metafields
    if (variantMetafields.length > 0) {
      await updateMetafields(admin, variantIdNew, variantMetafields);
    }

    return json({
      action: "created",
      productId: productIdNew,
      variantId: variantIdNew,
      variantUpdated: !!sku,
    });
  } catch (error) {
    console.error("❌ Shopify Sync Error:", error);
    return json(
      { error: "Failed to sync", details: error.message },
      { status: 500 }
    );
  }
};

// ✅ Reusable metafield update function with batching
async function updateMetafields(admin, ownerId, metafields) {
  const mutation = `
    mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          value
          type
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Split into chunks of 25
  const chunkSize = 25;
  for (let i = 0; i < metafields.length; i += chunkSize) {
    const chunk = metafields.slice(i, i + chunkSize);

    const inputs = chunk.map((field) => {
      let value = field.value;

      // ✅ Ensure all values are strings as required by Shopify
      switch (field.type?.toLowerCase()) {
        case "integer":
        case "number_integer":
        case "decimal":
        case "boolean":
          value = String(value); // must be a string
          break;
        case "json":
          value =
            typeof value === "object" ? JSON.stringify(value) : String(value);
          break;
        default:
          value = String(value);
      }

      return {
        ownerId,
        namespace: field.namespace || "custom",
        key: field.key,
        type: field.type,
        value,
      };
    });

    const res = await admin.graphql(mutation, {
      variables: { metafields: inputs },
    });

    const resJson = await res.json();
    const errors = resJson?.data?.metafieldsSet?.userErrors;
    if (errors?.length) {
      console.warn("⚠️ Metafield update errors (chunk):");
      errors.forEach((err) => {
        console.warn(
          `Field: ${err.field?.join(".") || "unknown"} | Message: ${err.message}`
        );
      });
    }
  }
}
