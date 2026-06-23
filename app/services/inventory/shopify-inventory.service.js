export async function getVariantBySku(admin, sku) {
    const result = await admin.request(
        `
      query getVariantBySKU($query: String!) {
        productVariants(first: 1, query: $query) {
          edges {
            node {
              id
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
    return result?.data?.productVariants?.edges?.[0]?.node;
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