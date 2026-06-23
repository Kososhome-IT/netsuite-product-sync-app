export async function setMetafields(admin, payload) {
  const metafields = payload.chunk.map((mf) => ({
    ownerId: payload.productId,
    namespace: mf.namespace || "custom",
    key: mf.key,
    type: mf.type,
    value: mf.value,
  }));

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
        metafields,
      },
    }
  );
}