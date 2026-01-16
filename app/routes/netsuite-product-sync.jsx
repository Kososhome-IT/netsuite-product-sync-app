import { json } from "@remix-run/node";
import { createAdminApiClient } from "@shopify/admin-api-client";
import { ApiVersion } from "@shopify/shopify-app-remix/server";
import { sessionStorage } from "../shopify.server";

/**
 * POST /product-create
 * - Create product
 * - Reuse default variant
 * - Update price (variant)
 * - Update SKU + barcode + country + HS + weight (inventory item)
 * - Update product metafields
 */
export const action = async ({ request }) => {
  try {
    /* ---------------- SHOP SESSION ---------------- */
    const shop = "dummy-ranjit.myshopify.com";
    const session = await sessionStorage.loadSession(`offline_${shop}`);

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
      return json(
        { error: "title and sku are required" },
        { status: 400 }
      );
    }

    /* =====================================================
     * 1️⃣ CREATE PRODUCT
     * ===================================================== */
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

    if (productRes.errors?.graphQLErrors?.length) {
      return json(
        { error: "Product creation failed", details: productRes.errors.graphQLErrors },
        { status: 400 }
      );
    }

    const productCreate = productRes.data?.productCreate;

    if (!productCreate || productCreate.userErrors?.length) {
      return json(
        { error: "Product creation failed", details: productCreate?.userErrors },
        { status: 400 }
      );
    }

    const productId = productCreate.product.id;

    /* =====================================================
     * 2️⃣ GET DEFAULT VARIANT + INVENTORY ITEM
     * ===================================================== */
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

    const defaultVariant =
      productQueryRes.data?.product?.variants?.edges?.[0]?.node;

    if (!defaultVariant) {
      return json(
        { error: "Default variant not found after product creation" },
        { status: 500 }
      );
    }

    const variantId = defaultVariant.id;
    const inventoryItemId = defaultVariant.inventoryItem.id;

    /* =====================================================
     * 3️⃣ UPDATE VARIANT (PRICE / INVENTORY POLICY ONLY)
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
     * 4️⃣ UPDATE INVENTORY ITEM (SKU + PHYSICAL DATA)
     * ===================================================== */
      
      const inventoryRes = await admin.request(
        `
        mutation InventoryItemUpdate(
          $id: ID!,
          $input: InventoryItemInput!
        ) {
          inventoryItemUpdate(id: $id, input: $input) {
            inventoryItem {
              id
              sku
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
            id: inventoryItemId,   // ✅ REQUIRED TOP-LEVEL ARG
            input: {
              sku,                               // ✅ SKU LIVES HERE
              tracked: true,
              harmonizedSystemCode: hs_code,
              countryCodeOfOrigin: country_of_origin?.toUpperCase(),

              ...(weight && {
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

      /* ---- HANDLE ERRORS ---- */
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
     * 5️⃣ PRODUCT METAFIELDS
     * ===================================================== */
    if (metafields.length) {
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
            metafields: metafields.map((mf) => ({
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
