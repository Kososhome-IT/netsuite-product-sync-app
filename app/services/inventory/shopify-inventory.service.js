export async function getVariantBySku(admin, sku) {
  const query = `sku:${sku}`;
console.log("variant sku",sku);
  const result = await admin.request(
    `
      query getVariantBySKU($query: String!) {
        productVariants(first: 10, query: $query) {
          edges {
            node {
              id
              sku
              product {
                id
                title
                status
              }
              inventoryItem {
                id
                tracked
              }
            }
          }
        }
      }
    `,
    { variables: { query } }
  );

  const edges = result?.data?.productVariants?.edges || [];
console.log("variant result",JSON.stringify(result ,null, 2));
// console.log("variant edges",JSON.stringify(edges ,null, 2));
  if (!edges.length) {
    return null;
  }

  const normalizedSku = String(sku).trim().toLowerCase();

  const exactMatch = edges.find(
    (edge) => String(edge?.node?.sku || "").trim().toLowerCase() === normalizedSku
  );

  return exactMatch?.node || edges[0]?.node || null;
}

import crypto from "node:crypto";
export async function setInventoryQuantity(admin, inventoryItemId, locationId, quantity) {
    
    const eventId = crypto.randomUUID();

    return await admin.request(
        `
        mutation inventorySetQuantities($input: InventorySetQuantitiesInput!, $eventId: String!) {
          inventorySetQuantities(input: $input) @idempotent(key: $eventId) {
            inventoryAdjustmentGroup {
              id
            }
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
                    quantities: [
                        {
                            inventoryItemId,
                            locationId,
                            quantity: Number(quantity),
                            changeFromQuantity: null
                        },
                    ],
                },
                eventId: eventId 
            },
        }
    );
}
export async function updateInventoryMetafields(
    admin,
    inventoryMetafields
) {

    return await admin.request(
        `
        mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            userErrors {
              field
              message
            }
          }
        }
        `,
        {
            variables: {
                metafields: inventoryMetafields,
            },
        }
    );
}

export async function activateInventoryLocation(
  admin,
  inventoryItemId,
  locationId
) {
  return await admin.request(
    `
   mutation inventoryActivate(
  $inventoryItemId: ID!
  $locationId: ID!
  $eventId: String!
) {
  inventoryActivate(
    inventoryItemId: $inventoryItemId
    locationId: $locationId
  ) @idempotent(key: $eventId) {
    inventoryLevel {
      id
    }

    userErrors {
      field
      message
    }
  }
}
    `,
    {
      variables: {
        inventoryItemId,
        locationId,
        eventId: crypto.randomUUID()
      },
    }
  );
}

export async function getInventoryLevels(admin, inventoryItemId) {
  return await admin.request(
    `
    query ($id: ID!) {
      inventoryItem(id: $id) {
        inventoryLevels(first: 20) {
          nodes {
            id
            location {
              id
              name
            }
          }
        }
      }
    }
    `,
    {
      variables: {
        id: inventoryItemId,
      },
    }
  );
}

export async function ensureInventoryLocationActive(
  admin,
  inventoryItemId,
  locationId
) {
  const levelResult = await getInventoryLevels(
    admin,
    inventoryItemId
  );

  const levels =
    levelResult?.data?.inventoryItem?.inventoryLevels?.nodes || [];

  const alreadyActive = levels.some(
    (level) => level.location.id === locationId
  );

  if (alreadyActive) {
    console.log(
      "[Inventory] Location already active:",
      locationId
    );

    return;
  }

  console.log(
    "[Inventory] Activating location:",
    locationId
  );

  const activationResult =
    await activateInventoryLocation(
      admin,
      inventoryItemId,
      locationId
    );

  const errors =
    activationResult?.data?.inventoryActivate?.userErrors || [];

  if (errors.length) {
    throw new Error(
      JSON.stringify(errors)
    );
  }
  
console.log("Location:", locationId);

console.log(
   "araw response activationResult", JSON.stringify(activationResult, null, 2)
);

  console.log(
    "[Inventory] Location activated successfully."
  );
}