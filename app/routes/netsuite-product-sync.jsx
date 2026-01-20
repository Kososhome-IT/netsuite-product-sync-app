import { json } from "@remix-run/node";
import { createAdminApiClient } from "@shopify/admin-api-client";
import { ApiVersion } from "@shopify/shopify-app-remix/server";
import { sessionStorage } from "../shopify.server";
import { insertLog } from "../utils/insert-dashboard-log";

/* =====================================================
 * INVENTORY VERIFICATION (API VERSION SAFE)
 * ===================================================== */
const verifyInventory = async ({ admin, inventoryItemId, stage }) => {
  const res = await admin.request(
    `
    query ($id: ID!) {
      inventoryItem(id: $id) {
        id
        inventoryLevels(first: 10) {
          edges {
            node {
              location {
                name
              }
              quantities(names: ["available"]) {
                name
                quantity
              }
            }
          }
        }
      }
    }
    `,
    { variables: { id: inventoryItemId } }
  );

  console.log(`📦 INVENTORY VERIFY [${stage}]`, JSON.stringify(res, null, 2));
  return res;
};

export const action = async ({ request }) => {
  const shop = "dummy-ranjit.myshopify.com";

  let productId;
  let variantId;
  let inventoryItemId;
  let actionType = "updated";
  let sku;
  let title;
  let netsuite_user = "system";

  try {
    /* ---------------- SESSION ---------------- */
    const session = await sessionStorage.loadSession(`offline_${shop}`);
    if (!session) {
      return json({ error: "Offline session missing" }, { status: 401 });
    }

    const admin = createAdminApiClient({
      storeDomain: shop,
      apiVersion: ApiVersion.April25,
      accessToken: session.accessToken,
    });

    /* ---------------- LOCATIONS ---------------- */
    const locationRes = await admin.request(`
      query {
        locations(first: 10) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `);

    if (!locationRes?.data?.locations?.edges) {
      throw new Error("Failed to fetch Shopify locations");
    }

    const locationMap = {};
    for (const edge of locationRes.data.locations.edges) {
      locationMap[edge.node.name.toLowerCase()] = edge.node.id;
    }

    /* ---------------- PAYLOAD ---------------- */
    const payload = await request.json();
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

    /* ---------------- SEARCH BY SKU ---------------- */
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

    /* ---------------- CREATE PRODUCT ---------------- */
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
        { variables: { input: { title, vendor, descriptionHtml } } }
      );

      if (productRes.data.productCreate.userErrors.length) {
        throw new Error("Product creation failed");
      }

      productId = productRes.data.productCreate.product.id;

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
      productId = existingVariant.product.id;
      variantId = existingVariant.id;
      inventoryItemId = existingVariant.inventoryItem.id;
    }

    /* ---------------- UPDATE PRODUCT ---------------- */
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
          input: { id: productId, title, descriptionHtml, vendor },
        },
      }
    );

    /* ---------------- UPDATE VARIANT ---------------- */
    await admin.request(
      `
      mutation ProductVariantsBulkUpdate(
        $productId: ID!,
        $variants: [ProductVariantsBulkInput!]!
      ) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
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
              inventoryManagement: "SHOPIFY",
              barcode,
            },
          ],
        },
      }
    );

    /* ---------------- UPDATE INVENTORY ITEM ---------------- */
    await admin.request(
      `
      mutation InventoryItemUpdate($id: ID!, $input: InventoryItemInput!) {
        inventoryItemUpdate(id: $id, input: $input) {
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

    /* ---------------- VERIFY BEFORE INVENTORY ---------------- */
    await verifyInventory({ admin, inventoryItemId, stage: "BEFORE" });

    /* ---------------- INVENTORY ACTIVATE + ADJUST ---------------- */
    if (actionType === "created") {
      await new Promise((r) => setTimeout(r, 500));

      for (const locationId of Object.values(locationMap)) {
        await admin.request(
          `
          mutation inventoryActivate($inventoryItemId: ID!, $locationId: ID!) {
            inventoryActivate(
              inventoryItemId: $inventoryItemId
              locationId: $locationId
            ) {
              inventoryLevel { id }
              userErrors { field message }
            }
          }
          `,
          { variables: { inventoryItemId, locationId } }
        );
      }

      const changes = [];
      for (const [loc, qty] of Object.entries(quantity_by_location)) {
        const locationId = locationMap[loc.toLowerCase()];
        if (!locationId || !Number.isFinite(Number(qty))) continue;

        changes.push({
          inventoryItemId,
          locationId,
          delta: Number(qty), // must be POSITIVE for initial stock
        });
      }

      if (changes.length) {
        const adjustRes = await admin.request(
          `
          mutation inventoryAdjustQuantities(
            $input: InventoryAdjustQuantitiesInput!
          ) {
            inventoryAdjustQuantities(input: $input) {
              userErrors { field message }
            }
          }
          `,
          {
            variables: {
              input: {
                name: "available",
                reason: "correction",
                changes,
              },
            },
          }
        );

        if (adjustRes.data.inventoryAdjustQuantities.userErrors.length) {
          throw new Error(
            JSON.stringify(
              adjustRes.data.inventoryAdjustQuantities.userErrors
            )
          );
        }
      }
    }

    /* ---------------- VERIFY AFTER INVENTORY ---------------- */
    const verifyAfter = await verifyInventory({
      admin,
      inventoryItemId,
      stage: "AFTER",
    });

    /* ---------------- METAFIELDS (UNCHANGED) ---------------- */
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

    /* ---------------- SUCCESS LOG ---------------- */
    await insertLog({
      shop,
      netsuite_user,
      product_sku: sku,
      shopify_product_id: productId,
      product_name: title,
      action: actionType,
      status: "success",
      inventory_debug: JSON.stringify(
        verifyAfter?.data?.inventoryItem?.inventoryLevels?.edges || []
      ),
    });

    return json({
      success: true,
      action: actionType,
      productId,
      variantId,
      inventoryItemId,
      sku,
    });
  } catch (error) {
    console.error("❌ Sync failed:", error);

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

    return json({ error: "Failed", details: error.message }, { status: 500 });
  }
};
