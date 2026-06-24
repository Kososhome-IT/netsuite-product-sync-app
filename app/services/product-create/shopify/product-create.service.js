

export async function getProductCategory(admin, payload) {
  return await admin.request(
    `
      query ($id: ID!) {
        product(id: $id) {
          category {
            id
          }
        }
      }
    `,
    {
      variables: {
        id: payload.productId,
      },
    }
  );
}

export async function updateProduct(admin, payload) {
  const input = {
    id: payload.productId,
    title: payload.title,
    descriptionHtml: payload.descriptionHtml,
    vendor: payload.vendor,
  };

  if (payload.createCategoryConfig?.taxonomyId) {
    input.category = payload.createCategoryConfig.taxonomyId;
  }

  return await admin.request(
    `
      mutation productUpdate($input: ProductInput!) {
        productUpdate(input: $input) {
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        input,
      },
    }
  );
}

export async function createProduct(admin, payload) {
  const productOptions = [];

  if (payload.color?.trim()) {
    productOptions.push({
      name: "Color",
      values: [
        {
          name: payload.color.trim(),
        },
      ],
    });
  }

  if (payload.size?.trim()) {
    productOptions.push({
      name: "Size",
      values: [
        {
          name: payload.size.trim(),
        },
      ],
    });
  }

  if (payload.style?.trim()) {
    productOptions.push({
      name: "Style",
      values: [
        {
          name: payload.style.trim(),
        },
      ],
    });
  }

  const product = {
    title: payload.title,
    status: "DRAFT",
    handle: payload.prohandle,
    vendor: payload.vendor,
    descriptionHtml: payload.descriptionHtml,
  };

  if (payload.createCategoryConfig?.taxonomyId) {
    product.category = payload.createCategoryConfig.taxonomyId;
  }

  if (productOptions.length > 0) {
    product.productOptions = productOptions;
  }

  return await admin.request(
    `
      mutation productCreate($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            options {
              id
              name
              optionValues {
                name
              }
            }
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
        product,
      },
    }
  );
}

export async function getProductOptions(admin, payload) {
  return await admin.request(
    `
      query ($id: ID!) {
        product(id: $id) {
          options {
            id
            name
            optionValues {
              id
              name
            }
          }
        }
      }
    `,
    {
      variables: {
        id: payload.productId,
      },
    }
  );
}



