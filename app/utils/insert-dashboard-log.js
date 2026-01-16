import { pool } from "./db.psql.js";

/**
 * Insert a dashboard sync log
 * MUST NEVER throw
 */
export async function insertLog({
  shop,
  netsuite_user = "system",
  product_sku,
  shopify_product_id = null,
  product_name = null,
  action,              // created | updated
  status,              // success | failed
  error_stage = null,  // product | variant | inventory | metafields
  error_message = null,
}) {
  try {
    const query = `
      INSERT INTO dashboard_logs (
        shop,
        netsuite_user,
        product_sku,
        shopify_product_id,
        product_name,
        action,
        status,
        error_stage,
        error_message
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    `;

    const values = [
      shop,
      netsuite_user,
      product_sku,
      shopify_product_id,
      product_name,
      action,
      status,
      error_stage,
      error_message,
    ];

    await pool.query(query, values);
  } catch (err) {
    // 🚨 Logging must never break Shopify sync
    console.error("⚠️ Failed to insert dashboard log:", err.message);
  }
}
