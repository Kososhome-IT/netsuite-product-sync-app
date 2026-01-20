import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

/**
 * GET /metafields.variant
 * Fetch VARIANT metafield definitions and types
 */
export const loader = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    const query = `
      query {
        metafieldDefinitions(first: 100, ownerType: PRODUCTVARIANT) {
          edges {
            node {
              id
              namespace
              key
              name
              description
              type {
                name
              }
              validations {
                name
                value
              }
            }
          }
        }
      }
    `;

    const response = await admin.graphql(query);
    const result = await response.json();

    if (result.errors) {
      return json({ success: false, errors: result.errors }, { status: 400 });
    }

    return json({
      success: true,
      metafields: result.data.metafieldDefinitions.edges.map(e => e.node),
    });
  } catch (error) {
    return json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
};
