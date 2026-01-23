import { json } from "@remix-run/node";
import { sessionStorage } from "../shopify.server";
import { ApiVersion } from "@shopify/shopify-app-remix/server";
import { createAdminApiClient } from "@shopify/admin-api-client";

/* ----------------------------------------------------
   Warehouse → Shopify Location Mapping (ENV-based)
---------------------------------------------------- */
const WAREHOUSE_LOCATION_MAP = {
  "High Point, NC": `gid://shopify/Location/${process.env.NC_WAREHOUSE_LOCATION_ID}`,
  "Los Angeles, CA": `gid://shopify/Location/${process.env.CA_WAREHOUSE_LOCATION_ID}`,
};

export async function action({ request }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const shop = process.env.SHOP;

  try {
    /* ----------------------------------------------------
       1. Load OFFLINE Shopify Session
       Session ID format: offline_<shop>
    ---------------------------------------------------- */
    const offlineSessionId = `offline_${shop}`;
    const session = await sessionStorage.loadSession(offlineSessionId);

    if (!session) {
      return json(
        { error: "Offline session missing. Reinstall app." },
        { status: 401 }
      );
    }

    /* ----------------------------------------------------
       2. Create Admin API Client (Offline-safe)
    ---------------------------------------------------- */
    const admin = createAdminApiClient({
      storeDomain: shop,
      apiVersion: ApiVersion.April25,
      accessToken: session.accessToken,
    });

    /* ----------------------------------------------------
       3. Parse Request Body
    ---------------------------------------------------- */
    const body = await request.json();
    const { sku, warehouse, quantity } = body;

    if (!sku || !warehouse || quantity === undefined) {
      return json(
        { error: "sku, warehouse and quantity are required" },
        { status: 400 }
      );
    }

    /* ----------------------------------------------------
       4. Resolve Warehouse → Location ID
    ---------------------------------------------------- */
    const locationId = WAREHOUSE_LOCATION_MAP[warehouse];

    if (!locationId || locationId.includes("undefined")) {
      return json(
        { error: `Unknown or misconfigured warehouse: ${warehouse}` },
        { status: 400 }
      );
    }

    /* ----------------------------------------------------
       5. Resolve SKU → Inventory Item ID
    ---------------------------------------------------- */
    const variantResult = await admin.request(
      `
      query getVariantBySKU($query: String!) {
        productVariants(first: 1, query: $query) {
          edges {
            node {
              inventoryItem {
                id
                tracked
              }
            }
          }
        }
      }
      `,
      {
        variables: {
          query: `sku:${sku}`,
        },
      }
    );

    const variant =
      variantResult?.data?.productVariants?.edges?.[0]?.node;

    if (!variant) {
      return json(
        { error: `No variant found for SKU: ${sku}` },
        { status: 404 }
      );
    }

    if (!variant.inventoryItem.tracked) {
      return json(
        { error: `Inventory tracking disabled for SKU: ${sku}` },
        { status: 400 }
      );
    }

    /* ----------------------------------------------------
       6. SET Inventory Quantity (Absolute)
    ---------------------------------------------------- */
    const setResult = await admin.request(
  `
  mutation inventorySetQuantities($input: InventorySetQuantitiesInput!) {
    inventorySetQuantities(input: $input) {
      userErrors {
        field
        message
      }
    }
  }
  `,
  {
    variables: {
      input: {
        reason: "correction",
        name: "available",
        ignoreCompareQuantity: true,
        quantities: [
          {
            inventoryItemId: variant.inventoryItem.id,
            locationId,
            quantity: Number(quantity),
          },
        ],
      },
    },
  }
);


    const errors =
      setResult?.data?.inventorySetQuantities?.userErrors || [];

    if (errors.length > 0) {
      return json({ success: false, errors }, { status: 400 });
    }

    /* ----------------------------------------------------
       7. Success Response
    ---------------------------------------------------- */
    return json({
      success: true,
      sku,
      warehouse,
      quantity,
      message: "Inventory synced from NetSuite",
    });
  } catch (error) {
    console.error("NetSuite inventory sync error:", error);
    return json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
