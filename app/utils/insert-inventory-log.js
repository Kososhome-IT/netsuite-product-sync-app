import prisma from "../db.server";

/**
 * Insert inventory log
 * MUST NEVER throw
 */
export async function insertInventoryLog({
  sku,
  warehouse,
  locationId,
  quantity,
  status,
  errorMessage = null,
  source = "NetSuite",
  requestPayload = null,
  responsePayload = null,
}) {
  try {
    await prisma.inventoryLog.create({
      data: {
        sku,
        warehouse,
        locationId,
        quantity,
        status,
        source,
        errorMessage,
        requestPayload,
        responsePayload,
      },
    });
  } catch (err) {
    console.error("⚠️ Inventory log failed:", err.message);
  }
}
