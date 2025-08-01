import fetch from 'node-fetch';
import dotenv from 'dotenv';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

dotenv.config();

function getOAuth() {
  return new OAuth({
    consumer: {
      key: process.env.NETSUITE_CONSUMER_KEY,
      secret: process.env.NETSUITE_CONSUMER_SECRET,
    },
    signature_method: 'HMAC-SHA256',
    hash_function(base_string, key) {
      return crypto
        .createHmac('sha256', key)
        .update(base_string)
        .digest('base64');
    },
  });
}

async function fetchWithOAuth(url, method = 'GET') {
  const oauth = getOAuth();
  const REALM = process.env.NETSUITE_REALM;

  const request_data = { url, method };

  const token = {
    key: process.env.NETSUITE_TOKEN_ID,
    secret: process.env.NETSUITE_TOKEN_SECRET,
  };

  const oauthHeader = oauth.toHeader(oauth.authorize(request_data, token));
  oauthHeader['Authorization'] = `OAuth realm="${REALM}", ${oauthHeader['Authorization'].substring(6)}`;

  const headers = {
    ...oauthHeader,
    'Content-Type': 'application/json',
  };

  console.log(`🔹 Fetching: ${url}`);

  const response = await fetch(url, { method, headers });
  const data = await response.json();

  if (!response.ok) {
    console.error(`❌ Netsuite Error: ${response.status} ${response.statusText}`, data);
    throw new Error(`❌ Netsuite Error: ${response.status} ${response.statusText}`);
  }

  return data;
}

export async function fetchNetSuiteInventoryItemsWithDetails() {
  const ACCOUNT_ID = process.env.NETSUITE_ACCOUNT_ID;
  const baseUrl = `https://${ACCOUNT_ID.toLowerCase().replace('_', '-')}.suitetalk.api.netsuite.com/services/rest/record/v1/inventoryItem`;

  try {
    // STEP 1: Fetch list of inventory item IDs
    const listData = await fetchWithOAuth(baseUrl);
    const items = listData.items?.slice(0, 50) || [];

    const detailedItems = [];

    for (const item of items) {
      const detailUrl = `${baseUrl}/${item.id}`;
      const detailData = await fetchWithOAuth(detailUrl);
      detailedItems.push(detailData);
    }

    console.log('✅ Detailed Inventory Items fetched from NetSuite:', JSON.stringify(detailedItems, null, 2));
    return detailedItems;
  } catch (error) {
    console.error('❌ Netsuite Fetch Error:', error);
    throw error;
  }
}

// ✅ Uncomment to test directly
// fetchNetSuiteInventoryItemsWithDetails().then(console.log).catch(console.error);
