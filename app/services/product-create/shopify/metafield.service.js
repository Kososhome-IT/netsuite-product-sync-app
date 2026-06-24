export async function setMetafields(admin, payload) {
  const ownerId = payload.ownerId || payload.productId;

  const metafields = payload.chunk.map((mf) => ({
    ownerId,
    namespace: mf.namespace || "custom",
    key: mf.key,
    type: mf.type,
    value: mf.value,
  }));

  console.log(`[SET METAFIELDS] ownerId=${ownerId} total=${metafields.length}`);

  metafields.forEach((mf, index) => {
    let shortValue = mf.value;

    if (typeof shortValue === "string" && shortValue.length > 150) {
      shortValue = shortValue.slice(0, 150) + "...";
    }

    console.log(
      `[MF ${index}] ${mf.namespace}.${mf.key} | type=${mf.type} | value=${shortValue}`
    );
  });

  const response = await admin.request(
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

  const userErrors = response?.data?.metafieldsSet?.userErrors || [];

  if (userErrors.length) {
    console.log("[SET METAFIELDS ERROR] Shopify returned metafield errors:");

    userErrors.forEach((err, index) => {
      console.log(
        `[MF ERROR ${index}] field=${JSON.stringify(err.field)} | message=${err.message}`
      );
    });
  } else {
    console.log("[SET METAFIELDS SUCCESS]");
  }

  return response;
}