// Create the pool once and reuse it everywhere
import { Pool } from 'pg';

export const pool = new Pool({
  user: 'shopifyapp',
  host: 'localhost',
  database: 'ch_shopify_app',
  password: 'root',
  port: 5432,
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
