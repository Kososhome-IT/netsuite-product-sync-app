import { json } from "@remix-run/node";
import { createAdminApiClient } from "@shopify/admin-api-client";
import { ApiVersion } from "@shopify/shopify-app-remix/server";
import { sessionStorage } from "../shopify.server";
import { insertLog } from "../utils/insert-dashboard-log";

/**
 * POST /product-sync
 * External system → Remix app → Offline OAuth session → Shopify Admin API
 */
export const action = async ({ request }) => {
  try {
    /* ----------------------------------------------------
     * 1. PROTECT ENDPOINT (MANDATORY)
     * ---------------------------------------------------- */
    // const authHeader = request.headers.get("authorization");
    // if (authHeader !== `Bearer ${process.env.SYNC_SECRET}`) {
    //   return json({ error: "Unauthorized" }, { status: 401 });
    // }

    /* ----------------------------------------------------
     * 2. SHOP DOMAIN
     * ---------------------------------------------------- */
    const shop = "dummy-ranjit.myshopify.com";

    /* ----------------------------------------------------
     * 3. LOAD OFFLINE OAUTH SESSION
     * Session ID format is ALWAYS: offline_<shop>
     * ---------------------------------------------------- */
    const offlineSessionId = `offline_${shop}`;
    const session = await sessionStorage.loadSession(offlineSessionId);

    if (!session) {
      return json(
        {
          error:
            "Offline Shopify session not found. Please reinstall the app.",
        },
        { status: 401 }
      );
    }

    /* ----------------------------------------------------
     * 4. CREATE ADMIN API CLIENT (CORRECT WAY)
     * ---------------------------------------------------- */
    const admin = createAdminApiClient({
      storeDomain: shop,
      apiVersion: ApiVersion.January24,
      accessToken: session.accessToken,
    });

    /* ----------------------------------------------------
     * 5. READ PAYLOAD
     * ---------------------------------------------------- */
    const payload = await request.json();
    const {
      sku,
      title,
      descriptionHtml,
      metafields = [],
      variantMetafields = [],
      netsuite_user = "unknown_user",
    } = payload;

    if (!title) {
      return json({ error: "Title is required" }, { status: 400 });
    }

    let productId = null;
    let variantId = null;

    /* ----------------------------------------------------
     * 6. FIND PRODUCT BY SKU
     * ---------------------------------------------------- */
    if (sku) {
      const res = await admin.request(
        `
        query ($query: String!) {
          productVariants(first: 1, query: $query) {
            edges {
              node {
                id
                product { id title }
              }
            }
          }
        }
        `,
        { variables: { query: `sku:${sku}` } }
      );

      const edge = res.data?.productVariants?.edges?.[0];
      if (edge) {
        productId = edge.node.product.id;
        variantId = edge.node.id;
      }
    }

    /* ----------------------------------------------------
     * 7. UPDATE PRODUCT IF EXISTS
     * ---------------------------------------------------- */
    if (productId && variantId) {
      await admin.request(
        `
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product { id }
            userErrors { field message }
          }
        }
        `,
        {
          variables: {
            input: {
              id: productId,
              title,
              descriptionHtml: descriptionHtml || "",
            },
          },
        }
      );

      if (metafields.length) {
        await updateMetafields(admin, productId, metafields);
      }

      if (variantMetafields.length) {
        await updateMetafields(admin, variantId, variantMetafields);
      }

      await insertLog({
        netsuite_user,
        sku,
        shopify_product_id: productId,
        product_name: title,
      });

      return json({ action: "updated", productId, variantId });
    }

    /* ----------------------------------------------------
     * 8. CREATE PRODUCT
     * ---------------------------------------------------- */
    const createRes = await admin.request(
      `
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
      `,
      {
        variables: {
          input: {
            title,
            descriptionHtml: descriptionHtml || "",
          },
        },
      }
    );
console.log(
  "RAW productCreate response:",
  JSON.stringify(createRes, null, 2)
);
    const productCreatePayload = createRes.data?.productCreate;

if (productCreatePayload?.userErrors?.length) {
  console.error("❌ Shopify productCreate userErrors:", productCreatePayload.userErrors);

  return json(
    {
      error: "Product creation failed",
      shopifyErrors: productCreatePayload.userErrors,
    },
    { status: 400 }
  );
}

const product = productCreatePayload?.product;

if (!product) {
  return json(
    {
      error: "Product creation failed",
      details: "No product returned and no userErrors",
    },
    { status: 500 }
  );
}

    const newProductId = product.id;
    const newVariantId = product.variants.edges[0].node.id;

    /* ----------------------------------------------------
     * 9. SET SKU
     * ---------------------------------------------------- */
    if (sku) {
      await admin.request(
        `
        mutation productVariantsBulkUpdate(
          $productId: ID!,
          $variants: [ProductVariantsBulkInput!]!
        ) {
          productVariantsBulkUpdate(
            productId: $productId,
            variants: $variants
          ) {
            userErrors { field message }
          }
        }
        `,
        {
          variables: {
            productId: newProductId,
            variants: [
              {
                id: newVariantId,
                inventoryItem: { sku },
              },
            ],
          },
        }
      );
    }

    if (metafields.length) {
      await updateMetafields(admin, newProductId, metafields);
    }

    if (variantMetafields.length) {
      await updateMetafields(admin, newVariantId, variantMetafields);
    }

    await insertLog({
      netsuite_user,
      sku,
      shopify_product_id: newProductId,
      product_name: title,
    });

    return json({
      action: "created",
      productId: newProductId,
      variantId: newVariantId,
    });
  } catch (error) {
    console.error("❌ Shopify Sync Error:", error);
    return json(
      { error: "Failed to sync", details: error.message },
      { status: 500 }
    );
  }
};

/* ----------------------------------------------------
 * METAFIELD HELPER
 * ---------------------------------------------------- */
async function updateMetafields(admin, ownerId, metafields) {
  const chunkSize = 25;

  for (let i = 0; i < metafields.length; i += chunkSize) {
    const chunk = metafields.slice(i, i + chunkSize);

    await admin.request(
      `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          userErrors { field message }
        }
      }
      `,
      {
        variables: {
          metafields: chunk.map((f) => ({
            ownerId,
            namespace: f.namespace || "custom",
            key: f.key,
            type: f.type,
            value:
              typeof f.value === "object"
                ? JSON.stringify(f.value)
                : String(f.value),
          })),
        },
      }
    );
  }
}
