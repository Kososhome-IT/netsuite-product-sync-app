import express from 'express';
import dotenv from 'dotenv';
import { updateShopifyProduct } from './utils/shopify.server.js'; // adjust the path accordingly

dotenv.config();

const app = express();
app.use(express.json()); // parse JSON bodies

app.post('/netsuite/webhook/product-update', async (req, res) => {
  try {
    const payload = req.body;
    console.log('✅ Payload from NetSuite:', payload);

    // TEMP: Replace with real logic later
    const updated = { message: "Mock Shopify update successful", data: payload };

    return res.status(200).json({ success: true, result: updated });
  } catch (error) {
    console.error('❌ Error in NetSuite API Handler:', error);
    return res.status(500).json({ error: 'Failed to process NetSuite payload', detail: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
});
