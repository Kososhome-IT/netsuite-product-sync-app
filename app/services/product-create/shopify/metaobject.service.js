export async function resolveMetaobjectIdsByDisplayValues({
  admin,
  metaobjectType,
  displayFieldKey,
  displayValues,
}) {
  let allNodes = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const res = await admin.request(
      `
      query ($type: String!, $cursor: String) {
        metaobjects(type: $type, first: 250, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            fields {
              key
              value
            }
          }
        }
      }
      `,
      {
        variables: {
          type: metaobjectType,
          cursor,
        },
      }
    );

    const data = res?.data?.metaobjects;
    const nodes = data?.nodes || [];

    allNodes.push(...nodes);
    hasNextPage = data?.pageInfo?.hasNextPage;
    cursor = data?.pageInfo?.endCursor;

    console.log(`📦 FETCHED METAOBJECTS: ${allNodes.length}`);
  }

  const nodes = allNodes;
  const valueSet = new Set(displayValues);
  const resolvedIds = [];

  for (const node of nodes) {
    const field = node.fields.find(
      (f) => f.key === displayFieldKey && valueSet.has(f.value)
    );
    if (field) resolvedIds.push(node.id);
  }

  return resolvedIds;
}