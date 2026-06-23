export async function setInventoryTracking(admin, inventoryItemId){

     await admin.request(
        `
        mutation inventoryItemUpdate($id: ID!, $input: InventoryItemInput!) {
          inventoryItemUpdate(id: $id, input: $input) {
            inventoryItem { id tracked }
            userErrors { field message }
          }
        }
        `,
        {
          variables: {
            id: inventoryItemId,
            input: { tracked: true },
          },
        }
      );
}
