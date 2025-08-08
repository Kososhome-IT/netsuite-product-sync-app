import { pool } from './db.psql.js';

export async function insertLog({ netsuite_user, sku, shopify_product_id, product_name }) {
  try {
    const queryText = `INSERT INTO dashboard_logs (netsuite_user, product_sku, shopify_product_id, product_name) VALUES ($1, $2, $3, $4)`;
    const values = [netsuite_user, sku, shopify_product_id, product_name];
    await pool.query(queryText, values);
  } catch (error) {
    console.error('Failed to insert log:', error);
    throw error;
  }
}
