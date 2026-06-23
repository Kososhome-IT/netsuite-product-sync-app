export async function getVariants(admin,sku){
   return await admin.request(
         `
         query ($query: String!) {
           productVariants(first: 1, query: $query) {
             edges {
               node {
                 id
                 product { id }
                 inventoryItem { id }
               }
             }
           }
         }
         `,
         { variables: { query: `sku:${sku}` } }
       );
}

export async function updateVariant(admin, payload) {
  const variant = {
    id: payload.variantId,
    taxable: false,
    inventoryPolicy: payload.madeToOrder ? "CONTINUE" : "DENY",
    inventoryItem: {},
  };

  if (payload.price) {
    variant.price = String(payload.price);
  }

  if (payload.compare_at) {
    variant.compareAtPrice = String(payload.compare_at);
  }

  if (payload.barcode) {
    variant.barcode = payload.barcode;
  }

  if (payload.sku) {
    variant.inventoryItem.sku = payload.sku;
  }

  if (payload.hs_code) {
    variant.inventoryItem.harmonizedSystemCode = payload.hs_code;
  }

  if (payload.country_of_origin) {
    variant.inventoryItem.countryCodeOfOrigin =
      COUNTRY_MAP[payload.country_of_origin] ||
      payload.country_of_origin;
  }

  return await admin.request(
    `
      mutation productVariantsBulkUpdate(
        $productId: ID!
        $variants: [ProductVariantsBulkInput!]!
      ) {
        productVariantsBulkUpdate(
          productId: $productId
          variants: $variants
        ) {
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        productId: payload.productId,
        variants: [variant],
      },
    }
  );
}

export async function getvariantId(admin,productId){
return admin.request(
        `
        query ($id: ID!) {
          product(id: $id) {
            variants(first: 1) {
              edges {
                node { id inventoryItem { id } }
              }
            }
          }
        }
        `,
        { variables: { id: productId } }
      );
}

export async function productOptionUpdate(admin, payload) {
  return await admin.request(
    `
      mutation productOptionUpdate(
        $productId: ID!
        $option: OptionUpdateInput!
        $optionValuesToUpdate: [OptionValueUpdateInput!]
      ) {
        productOptionUpdate(
          productId: $productId
          option: $option
          optionValuesToUpdate: $optionValuesToUpdate
        ) {
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        productId: payload.productId,

        option: {
          id: payload.colorOption.id,
          linkedMetafield: {
            namespace: "shopify",
            key: "color-pattern",
          },
        },

        optionValuesToUpdate: [
          {
            id: payload.colorOptionValue.id,
            linkedMetafieldValue: payload.colorMetaobjectId,
          },
        ],
      },
    }
  );
}