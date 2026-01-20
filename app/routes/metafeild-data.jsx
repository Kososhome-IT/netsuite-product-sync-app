import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const query = `
    query {
      metafieldDefinitions(first: 100, ownerType: PRODUCT) {
        edges {
          node {
            namespace
            key
            type {
              name
            }
          }
        }
      }
    }
  `;

  const response = await admin.graphql(query);
  const result = await response.json();

  return json(result.data.metafieldDefinitions.edges.map(e => e.node));
};
