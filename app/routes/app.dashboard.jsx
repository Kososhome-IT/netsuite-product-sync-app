import {
  Box,
  Card,
  Layout,
  DataTable,
  Page,
  Text,
  Divider,
  Badge,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { query } from "../utils/db.psql";
import { TitleBar } from "@shopify/app-bridge-react";

/* =====================================================
 * LOADER
 * ===================================================== */
export const loader = async () => {
  const res = await query(`
    SELECT
      id,
      shop,
      netsuite_user,
      product_sku,
      shopify_product_id,
      product_name,
      action,
      status,
      error_message,
      updated_at
    FROM dashboard_logs
    ORDER BY updated_at DESC
    LIMIT 100
  `);

  return json(res.rows);
};

/* =====================================================
 * PAGE
 * ===================================================== */
export default function DashboardPage() {
  const logs = useLoaderData();

  const rows = logs.map((entry) => [
    <Text as="span" fontWeight="medium" key={`user-${entry.id}`}>
      {entry.netsuite_user || "—"}
    </Text>,

    entry.product_sku || "—",

    <Text as="span" key={`pid-${entry.id}`} tone="subdued">
      {entry.shopify_product_id || "—"}
    </Text>,

    entry.product_name || "—",

    <Badge
      key={`action-${entry.id}`}
      tone={entry.action === "created" ? "success" : "info"}
    >
      {entry.action}
    </Badge>,

    <Badge
      key={`status-${entry.id}`}
      tone={entry.status === "success" ? "success" : "critical"}
    >
      {entry.status}
    </Badge>,

    <Text
      as="span"
      variant="bodySm"
      tone="subdued"
      key={`date-${entry.id}`}
    >
      {new Date(entry.updated_at).toLocaleString()}
    </Text>,
  ]);

  return (
    <Page>
      <TitleBar title="Sync Dashboard" />

      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <Card padding="400">
              <InlineStack align="space-between">
                <Text variant="headingMd" as="h2">
                  Recent Sync Activity
                </Text>
                <Badge tone="info">{logs.length} records</Badge>
              </InlineStack>

              <Box paddingBlockStart="300" paddingBlockEnd="200">
                <Text variant="bodySm" tone="subdued">
                  Displays the most recent product sync operations from NetSuite
                  to Shopify.
                </Text>
              </Box>

              <Divider />

              <Box paddingBlockStart="300" overflowX="auto">
                {rows.length === 0 ? (
                  <Text tone="subdued">No logs available.</Text>
                ) : (
                  <DataTable
                    columnContentTypes={[
                      "text",
                      "text",
                      "text",
                      "text",
                      "text",
                      "text",
                      "text",
                    ]}
                    headings={[
                      "NetSuite User",
                      "SKU",
                      "Shopify Product ID",
                      "Product Name",
                      "Action",
                      "Status",
                      "Updated At",
                    ]}
                    rows={rows}
                  />
                )}
              </Box>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
