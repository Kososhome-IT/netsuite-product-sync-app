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
  Button,
} from "@shopify/polaris";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { query } from "../utils/db.psql";
import { TitleBar } from "@shopify/app-bridge-react";

/* =====================================================
 * LOADER (with pagination)
 * ===================================================== */
export const loader = async ({ request }) => {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get("page") || 1);
  const limit = 10;
  const offset = (page - 1) * limit;

  const logsRes = await query(
    `
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
    LIMIT $1 OFFSET $2
  `,
    [limit, offset]
  );

  const countRes = await query(`
    SELECT COUNT(*)::int AS count FROM dashboard_logs
  `);

  const successRes = await query(`
    SELECT COUNT(*)::int AS count FROM dashboard_logs WHERE status = 'success'
  `);

  const failedRes = await query(`
    SELECT COUNT(*)::int AS count FROM dashboard_logs WHERE status != 'success'
  `);

  const totalCount = countRes.rows[0].count;
  const totalPages = Math.ceil(totalCount / limit);

  return json({
    logs: logsRes.rows,
    totalCount,
    totalPages,
    page,
    success: successRes.rows[0].count,
    failed: failedRes.rows[0].count,
  });
};

/* =====================================================
 * PAGE
 * ===================================================== */
export default function DashboardPage() {
  const {
    logs,
    totalCount,
    totalPages,
    page,
    success,
    failed,
  } = useLoaderData();

  const location = useLocation();

  const buildURL = (newPage) => {
  const params = new URLSearchParams(location.search);
  params.set("page", String(newPage));
  return `${location.pathname}?${params.toString()}`;
};

  const rows = logs.map((entry) => [
    entry.netsuite_user || "—",
    entry.product_sku || "—",
    entry.shopify_product_id || "—",
    entry.product_name || "NA",

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
    entry.error_message || "No Error",
    new Date(entry.updated_at).toLocaleString(),
  ]);

  return (
    <Page>
      <TitleBar title="Sync Dashboard" />

      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {/* -------- Metrics -------- */}
            <InlineStack gap="300">
              <Card padding="300">
                <Text tone="subdued">Total</Text>
                <Text variant="headingMd">{totalCount}</Text>
              </Card>
              <Card padding="300">
                <Text tone="subdued">Success</Text>
                <Text variant="headingMd" tone="success">
                  {success}
                </Text>
              </Card>
              <Card padding="300">
                <Text tone="subdued">Failed</Text>
                <Text variant="headingMd" tone="critical">
                  {failed}
                </Text>
              </Card>
            </InlineStack>

            {/* -------- Table -------- */}
            <Card padding="400">
              <InlineStack align="space-between">
                <Text variant="headingMd">Recent Sync Activity</Text>
                <Badge tone="info">{totalCount} records</Badge>
              </InlineStack>

              <Box paddingBlockStart="200">
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
                      "text",
                    ]}
                    headings={[
                      "NetSuite User",
                      "SKU",
                      "Shopify Product ID",
                      "Product Name",
                      "Action",
                      "Status",
                      "Error Massage",
                      "Updated At",
                    ]}
                    rows={rows}
                    stickyHeader
                  />
                )}
              </Box>

              {/* -------- Pagination -------- */}
              {totalPages > 1 && (
                <InlineStack align="center" gap="300">
                  {page > 1 && (
                    <Button
                      size="slim"
                      variant="secondary"
                      url={buildURL(page - 1)}
                    >
                      Previous
                    </Button>
                  )}

                  <Text tone="subdued">
                    Page {page} of {totalPages}
                  </Text>

                  {page < totalPages && (
                    <Button
                      size="slim"
                      variant="secondary"
                      url={buildURL(page + 1)}
                    >
                      Next
                    </Button>
                  )}
                </InlineStack>
              )}
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
