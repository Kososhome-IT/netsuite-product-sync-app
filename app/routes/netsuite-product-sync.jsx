import { json } from "@remix-run/node";
import { createAdminApiClient } from "@shopify/admin-api-client";
import { ApiVersion } from "@shopify/shopify-app-remix/server";
import { sessionStorage } from "../shopify.server";

/**
 * POST /product-sync
 * - Search by SKU
 * - Update product if found
 * - Create product if not found
 * - Update variant + inventory item + metafields
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
    const shop = "project-shibuya.myshopify.com";

    /* ----------------------------------------------------
     * 3. LOAD OFFLINE OAUTH SESSION
     * Session ID format is ALWAYS: offline_<shop>
     * ---------------------------------------------------- */
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

    /* ---------------- PAYLOAD ---------------- */
    const payload = await request.json();
    const {
      title,
      descriptionHtml = "",
      sku,
      vendor,
      price = "0.00",
      barcode,
      hs_code,
      country_of_origin,
      weight,
      metafields = [],
    } = payload;

    if (!title || !sku) {
      return json({ error: "title and sku are required" }, { status: 400 });
    }

    /* =====================================================
     * 0️⃣ SEARCH PRODUCT BY SKU (IDEMPOTENCY)
     * ===================================================== */
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
      {
        variables: { query: `sku:${sku}` },
      }
    );

    let productId;
    let variantId;
    let inventoryItemId;
    let actionType = "updated";

    const existingVariant =
      searchRes.data?.productVariants?.edges?.[0]?.node;

    /* =====================================================
     * 1️⃣ CREATE PRODUCT IF SKU NOT FOUND
     * ===================================================== */
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
            },
          },
        }
      );

      if (
        productRes.errors?.graphQLErrors?.length ||
        productRes.data?.productCreate?.userErrors?.length
      ) {
        return json(
          {
            error: "Product creation failed",
            details:
              productRes.errors?.graphQLErrors ||
              productRes.data.productCreate.userErrors,
          },
          { status: 400 }
        );
      }

      productId = productRes.data.productCreate.product.id;

      /* Get default variant + inventory item */
      const productQueryRes = await admin.request(
        `
        query ($id: ID!) {
          product(id: $id) {
            variants(first: 1) {
              edges {
                node {
                  id
                  inventoryItem { id }
                }
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
    } else {
      /* =====================================================
       * SKU FOUND → REUSE EXISTING PRODUCT
       * ===================================================== */
      productId = existingVariant.product.id;
      variantId = existingVariant.id;
      inventoryItemId = existingVariant.inventoryItem.id;
    }

    /* =====================================================
     * 2️⃣ UPDATE VARIANT (PRICE + BARCODE)
     * ===================================================== */
    const variantUpdateRes = await admin.request(
      `
      mutation ProductVariantsBulkUpdate(
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
          productId,
          variants: [
            {
              id: variantId,
              price: String(price),
              inventoryPolicy: "DENY",
              barcode,
            },
          ],
        },
      }
    );

    if (
      variantUpdateRes.errors?.graphQLErrors?.length ||
      variantUpdateRes.data?.productVariantsBulkUpdate?.userErrors?.length
    ) {
      return json(
        {
          error: "Variant update failed",
          details:
            variantUpdateRes.errors?.graphQLErrors ||
            variantUpdateRes.data.productVariantsBulkUpdate.userErrors,
        },
        { status: 400 }
      );
    }

    /* =====================================================
     * 3️⃣ UPDATE INVENTORY ITEM (SKU + PHYSICAL DATA)
     * ===================================================== */
    const inventoryRes = await admin.request(
      `
      mutation InventoryItemUpdate(
        $id: ID!,
        $input: InventoryItemInput!
      ) {
        inventoryItemUpdate(id: $id, input: $input) {
          inventoryItem { id }
          userErrors { field message }
        }
      }
      `,
      {
        variables: {
          id: inventoryItemId,
          input: {
            sku,
            tracked: true,
            harmonizedSystemCode: hs_code,
            countryCodeOfOrigin: country_of_origin?.toUpperCase(),
            ...(Number.isFinite(Number(weight)) && {
              measurement: {
                weight: {
                  value: Number(weight),
                  unit: "POUNDS",
                },
              },
            }),
          },
        },
      }
    );

    if (
      inventoryRes.errors?.graphQLErrors?.length ||
      inventoryRes.data?.inventoryItemUpdate?.userErrors?.length
    ) {
      return json(
        {
          error: "Inventory update failed",
          details:
            inventoryRes.errors?.graphQLErrors ||
            inventoryRes.data.inventoryItemUpdate.userErrors,
        },
        { status: 400 }
      );
    }

    /* =====================================================
     * 4️⃣ PRODUCT METAFIELDS (BATCHED)
     * ===================================================== */
    const CHUNK_SIZE = 25;
    for (let i = 0; i < metafields.length; i += CHUNK_SIZE) {
      const chunk = metafields.slice(i, i + CHUNK_SIZE);

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
            metafields: chunk.map((mf) => ({
              ownerId: productId,
              namespace: mf.namespace || "custom",
              key: mf.key,
              type: mf.type,
              value: String(mf.value),
            })),
          },
        }
      );
    }

    return json({
      success: true,
      action: actionType,
      productId,
      variantId,
      inventoryItemId,
      sku,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return json(
      { error: "Failed", details: error.message },
      { status: 500 }
    );
  }
};
