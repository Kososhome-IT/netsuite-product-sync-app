import { json } from "@remix-run/node";
import { buildInventoryMetafields,toNumber} from "../services/inventory/utils/inventory.utils";
import { WAREHOUSE_LOCATION_MAP} from "../services/inventory/utils/warehouse.config";
import { getVariantBySku,setInventoryQuantity,updateInventoryMetafields,ensureInventoryLocationActive} from "../services/inventory/shopify-inventory.service";
import prisma from "../db.server";
import { getAdminClient } from "../services/shopify-admin.service";


/* ----------------------------------------------------
   ACTION
---------------------------------------------------- */
export async function action({ request }) {

  console.log("inventory update recived")
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }


  let body = {};
  let sku = "UNKNOWN";
  let warehouse = "UNKNOWN";
  let quantity = 0;
  let locationId = "UNKNOWN";
  let setResult = null;
  let metafieldsResult = null;

  try {
    /* ---------------- Parse Body ---------------- */
    body = await request.json();
    console.log("inventory Data recived", JSON.stringify(body,null,2))
    sku = body.sku;
    warehouse = body.warehouse;
    quantity = Number(body.quantity) + toNumber(body.intransit) + toNumber(body.onorder) ;

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

  
    /* ---------------- Admin Client ---------------- */
    const admin = await getAdminClient();
    /* ---------------- Resolve Location ---------------- */
    locationId = WAREHOUSE_LOCATION_MAP[warehouse];
    console.log("locationId",locationId)

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
    const variant = await  getVariantBySku(admin,sku)
console.log("[inventory varient]",JSON.stringify(variant,null,2))
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
          responsePayload: null,
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

    /* ---------------- Ensure Location Active ---------------- */

await ensureInventoryLocationActive(
  admin,
  variant.inventoryItem.id,
  locationId
);

    /* ---------------- Set Inventory ---------------- */
    setResult = await setInventoryQuantity(admin,variant.inventoryItem.id,locationId,quantity)
console.log("[inventory set result]",JSON.stringify(setResult,null,2))
    const errors = setResult?.data?.inventorySetQuantities?.userErrors || [];

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

    const inventoryMetafields = buildInventoryMetafields({
      variantId: variant.id,
      warehouse,
      body,
      quantity,
    });
 console.log(
  "[inventoryMetafields]",JSON.stringify(inventoryMetafields, null, 2)
);

    if (inventoryMetafields.length) {
      console.log(
  JSON.stringify(inventoryMetafields, null, 2)
);

      metafieldsResult = await updateInventoryMetafields(admin, inventoryMetafields)

      const metafieldErrors = metafieldsResult?.data?.metafieldsSet?.userErrors || [];

      if (metafieldErrors.length > 0) {
        await prisma.inventoryLog.create({
          data: {
            sku,
            warehouse,
            locationId,
            quantity,
            status: "FAILED",
            source: "NetSuite",
            errorMessage: JSON.stringify(metafieldErrors),
            requestPayload: body,
            responsePayload: {
              inventory: setResult?.data ?? null,
              metafields: metafieldsResult?.data ?? null,
            },
          },
        });

        return json(
          { success: false, errors: metafieldErrors },
          { status: 400 }
        );
      }
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
        responsePayload: {
          inventory: setResult?.data ?? null,
          metafields: metafieldsResult?.data ?? null,
        },
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
