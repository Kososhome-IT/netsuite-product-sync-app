import { json } from "@remix-run/node";
import { sessionStorage } from "../shopify.server";
import { ApiVersion } from "@shopify/shopify-app-remix/server";
import { createAdminApiClient } from "@shopify/admin-api-client";
import prisma from "../db.server";

/* ----------------------------------------------------
   Warehouse → Shopify Location Mapping
---------------------------------------------------- */
const WAREHOUSE_LOCATION_MAP = {
  "High Point, NC": `gid://shopify/Location/${process.env.NC_WAREHOUSE_LOCATION_ID}`,
  "Los Angeles, CA": `gid://shopify/Location/${process.env.CA_WAREHOUSE_LOCATION_ID}`,
};

/* ----------------------------------------------------
   ACTION
---------------------------------------------------- */
export async function action({ request }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const shop = process.env.SHOP;

  let body = {};
  let sku = "UNKNOWN";
  let warehouse = "UNKNOWN";
  let quantity = 0;
  let locationId = "UNKNOWN";
  let setResult = null;

  try {
    /* ---------------- Parse Body ---------------- */
    body = await request.json();
    sku = body.sku;
    warehouse = body.warehouse;
    quantity = Number(body.quantity);

    if (!sku || !warehouse || body.quantity === undefined) {
      await prisma.inventoryLog.create({
        data: {
          sku,
          warehouse,
          locationId,
          quantity,
          status: "FAILED",
          source: "NetSuite",
          errorMessage: "Missing required fields",
          requestPayload: body,
        },
      });

      return json(
        { error: "sku, warehouse and quantity are required" },
        { status: 400 }
      );
    }

    /* ---------------- Load Offline Session ---------------- */
    const session = await sessionStorage.loadSession(`offline_${shop}`);

    if (!session) {
      await prisma.inventoryLog.create({
        data: {
          sku,
          warehouse,
          locationId,
          quantity,
          status: "FAILED",
          source: "NetSuite",
          errorMessage: "Offline session missing",
          requestPayload: body,
        },
      });

      return json(
        { error: "Offline session missing. Reinstall app." },
        { status: 401 }
      );
    }

    /* ---------------- Admin Client ---------------- */
    const admin = createAdminApiClient({
      storeDomain: shop,
      apiVersion: ApiVersion.April25,
      accessToken: session.accessToken,
    });

    /* ---------------- Resolve Location ---------------- */
    locationId = WAREHOUSE_LOCATION_MAP[warehouse];

    if (!locationId || locationId.includes("undefined")) {
      await prisma.inventoryLog.create({
        data: {
          sku,
          warehouse,
          locationId: "UNKNOWN",
          quantity,
          status: "FAILED",
          source: "NetSuite",
          errorMessage: `Unknown warehouse: ${warehouse}`,
          requestPayload: body,
        },
      });

      return json(
        { error: `Unknown or misconfigured warehouse: ${warehouse}` },
        { status: 400 }
      );
    }

    /* ---------------- Resolve SKU ---------------- */
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
      { variables: { query: `sku:${sku}` } }
    );

    const variant =
      variantResult?.data?.productVariants?.edges?.[0]?.node;

    if (!variant) {
      await prisma.inventoryLog.create({
        data: {
          sku,
          warehouse,
          locationId,
          quantity,
          status: "FAILED",
          source: "NetSuite",
          errorMessage: "SKU not found",
          requestPayload: body,
          responsePayload: variantResult?.data ?? null,
        },
      });

      return json(
        { error: `No variant found for SKU: ${sku}` },
        { status: 404 }
      );
    }

    if (!variant.inventoryItem.tracked) {
      await prisma.inventoryLog.create({
        data: {
          sku,
          warehouse,
          locationId,
          quantity,
          status: "FAILED",
          source: "NetSuite",
          errorMessage: "Inventory tracking disabled",
          requestPayload: body,
        },
      });

      return json(
        { error: `Inventory tracking disabled for SKU: ${sku}` },
        { status: 400 }
      );
    }

    /* ---------------- Set Inventory ---------------- */
    setResult = await admin.request(
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
                quantity,
              },
            ],
          },
        },
      }
    );

    const errors =
      setResult?.data?.inventorySetQuantities?.userErrors || [];

    if (errors.length > 0) {
      await prisma.inventoryLog.create({
        data: {
          sku,
          warehouse,
          locationId,
          quantity,
          status: "FAILED",
          source: "NetSuite",
          errorMessage: JSON.stringify(errors),
          requestPayload: body,
          responsePayload: setResult?.data ?? null,
        },
      });

      return json({ success: false, errors }, { status: 400 });
    }

    /* ---------------- SUCCESS ---------------- */
    await prisma.inventoryLog.create({
      data: {
        sku,
        warehouse,
        locationId,
        quantity,
        status: "SUCCESS",
        source: "NetSuite",
        requestPayload: body,
        responsePayload: setResult?.data ?? null,
      },
    });

    return json({
      success: true,
      sku,
      warehouse,
      quantity,
      message: "Inventory synced from NetSuite",
    });
  } catch (error) {
    await prisma.inventoryLog.create({
      data: {
        sku,
        warehouse,
        locationId,
        quantity,
        status: "FAILED",
        source: "NetSuite",
        errorMessage: error.message,
        requestPayload: body,
      },
    });

    console.error("Inventory sync error:", error);

    return json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
