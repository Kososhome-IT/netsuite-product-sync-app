export async function getVariantBySku(admin, sku) {
  const query = `sku:${sku} AND product_status:ACTIVE,DRAFT`;

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

  if (!edges.length) {
    return null;
  }

  const normalizedSku = String(sku).trim().toLowerCase();

  const exactMatch = edges.find(
    (edge) => String(edge?.node?.sku || "").trim().toLowerCase() === normalizedSku
  );

  return exactMatch?.node || edges[0]?.node || null;
}

export async function setInventoryQuantity(admin, inventoryItemId, locationId, quantity
) {
    return await admin.request(
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
                            inventoryItemId,
                            locationId,
                            quantity,
                        },
                    ],
                },
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