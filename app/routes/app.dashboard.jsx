import { json } from "@remix-run/node";
import { useLoaderData, useLocation, Link } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Page,
  Layout,
  Card,
  Text,
  Badge,
  Box,
  BlockStack,
  InlineStack,
  IndexTable,
  TextField,
  Select,
  Button,
  EmptyState,
} from "@shopify/polaris";
import { query } from "../utils/db.psql";

/* =====================================================
 * HELPERS
 * ===================================================== */
function truncateText(value, max = 60) {
  if (!value) return "—";
  const str = String(value);
  if (str.length <= max) return str;
  return `${str.slice(0, max)}...`;
}

function shortProductId(gid) {
  if (!gid) return "—";
  const parts = String(gid).split("/");
  return parts[parts.length - 1] || gid;
}

function getActionBadgeTone(action) {
  if (action === "created") return "success";
  if (action === "updated") return "info";
  return "attention";
}

function getStatusBadgeTone(status) {
  if (status === "success") return "success";
  if (status === "warning") return "warning";
  return "critical";
}

/* =====================================================
 * LOADER
 * ===================================================== */
export const loader = async ({ request }) => {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get("page") || 1);
  const limit = 10;
  const offset = (page - 1) * limit;

  const search = (url.searchParams.get("search") || "").trim();
  const status = (url.searchParams.get("status") || "all").trim();
  const action = (url.searchParams.get("action") || "all").trim();

  const where = [];
  const values = [];
  let paramIndex = 1;

  if (search) {
    where.push(`
      (
        COALESCE(netsuite_user, '') ILIKE $${paramIndex}
        OR COALESCE(product_sku, '') ILIKE $${paramIndex}
        OR COALESCE(product_name, '') ILIKE $${paramIndex}
        OR COALESCE(shopify_product_id, '') ILIKE $${paramIndex}
      )
    `);
    values.push(`%${search}%`);
    paramIndex += 1;
  }

  if (status !== "all") {
    where.push(`status = $${paramIndex}`);
    values.push(status);
    paramIndex += 1;
  }

  if (action !== "all") {
    where.push(`action = $${paramIndex}`);
    values.push(action);
    paramIndex += 1;
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const logsSql = `
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
    ${whereClause}
    ORDER BY updated_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const logsRes = await query(logsSql, [...values, limit, offset]);

  const countSql = `
    SELECT COUNT(*)::int AS count
    FROM dashboard_logs
    ${whereClause}
  `;
  const countRes = await query(countSql, values);

  // Top cards stay global for now (not filtered)
  const totalRes = await query(`
    SELECT COUNT(*)::int AS count FROM dashboard_logs
  `);

  const successRes = await query(`
    SELECT COUNT(*)::int AS count
    FROM dashboard_logs
    WHERE status = 'success'
  `);

  const failedRes = await query(`
    SELECT COUNT(*)::int AS count
    FROM dashboard_logs
    WHERE status != 'success'
  `);

  const filteredCount = countRes.rows[0]?.count || 0;
  const totalPages = Math.ceil(filteredCount / limit);

  return json({
    logs: logsRes.rows || [],
    totalCount: totalRes.rows[0]?.count || 0,
    filteredCount,
    totalPages,
    page,
    success: successRes.rows[0]?.count || 0,
    failed: failedRes.rows[0]?.count || 0,
    filters: {
      search,
      status,
      action,
    },
  });
};

/* =====================================================
 * COMPONENT
 * ===================================================== */
function MetricCard({ title, value, tone = "base", subtitle }) {
  const valueColor =
    tone === "success"
      ? "success"
      : tone === "critical"
      ? "critical"
      : undefined;

  return (
    <Card>
      <BlockStack gap="200">
        <Text as="span" variant="bodySm" tone="subdued">
          {title}
        </Text>

        <Text as="h3" variant="heading2xl" tone={valueColor}>
          {value}
        </Text>

        {subtitle ? (
          <Text as="span" variant="bodySm" tone="subdued">
            {subtitle}
          </Text>
        ) : null}
      </BlockStack>
    </Card>
  );
}

/* =====================================================
 * PAGE
 * ===================================================== */
export default function DashboardPage() {
  const {
    logs,
    totalCount,
    filteredCount,
    totalPages,
    page,
    success,
    failed,
    filters,
  } = useLoaderData();

  const location = useLocation();

  const buildURL = (updates = {}) => {
    const params = new URLSearchParams(location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // whenever filters change, reset to page 1 unless explicitly passing page
    if (!Object.prototype.hasOwnProperty.call(updates, "page")) {
      params.set("page", "1");
    }

    return `${location.pathname}?${params.toString()}`;
  };

  const statusOptions = [
    { label: "All statuses", value: "all" },
    { label: "Success", value: "success" },
    { label: "Failed", value: "failed" },
    { label: "Warning", value: "warning" },
  ];

  const actionOptions = [
    { label: "All actions", value: "all" },
    { label: "Created", value: "created" },
    { label: "Updated", value: "updated" },
    { label: "Failed", value: "failed" },
  ];

  const resourceName = {
    singular: "log",
    plural: "logs",
  };

  return (
    <Page
      fullWidth
      title="Sync Dashboard"
      subtitle="Monitor product sync activity between NetSuite and Shopify"
    >
      <TitleBar title="Sync Dashboard" />

      <Layout>
        {/* =====================================================
            KPI CARDS
           ===================================================== */}
        <Layout.Section>
          <Box paddingBlockEnd="400">
            <InlineStack gap="400" align="start" wrap={false}>
              <Box minWidth="220px" width="100%">
                <MetricCard
                  title="Total Syncs"
                  value={totalCount}
                  subtitle="All dashboard log records"
                />
              </Box>

              <Box minWidth="220px" width="100%">
                <MetricCard
                  title="Successful"
                  value={success}
                  tone="success"
                  subtitle="Completed successfully"
                />
              </Box>

              <Box minWidth="220px" width="100%">
                <MetricCard
                  title="Failed"
                  value={failed}
                  tone="critical"
                  subtitle="Require review"
                />
              </Box>
            </InlineStack>
          </Box>
        </Layout.Section>

        {/* =====================================================
            MAIN LOG CARD
           ===================================================== */}
        <Layout.Section>
          <Card padding="0">
            <Box padding="500">
              <BlockStack gap="400">
                {/* Header */}
                <InlineStack align="space-between" blockAlign="start" gap="300">
                  <BlockStack gap="100">
                    <Text as="h2" variant="headingLg">
                      Recent Sync Activity
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Displays the most recent product sync operations from NetSuite to Shopify.
                    </Text>
                  </BlockStack>

                  <Badge tone="info">{filteredCount} records</Badge>
                </InlineStack>

                {/* Filters */}
                <InlineStack gap="300" align="start" wrap>
                  <Box minWidth="320px" width="100%">
                    <TextField
                      label="Search"
                      labelHidden
                      autoComplete="off"
                      value={filters.search}
                      placeholder="Search by SKU, product, user, or Shopify product ID"
                      onChange={() => {}}
                      connectedRight={
                        <Link to={buildURL({ search: filters.search })}>
                          <Button size="slim">Apply</Button>
                        </Link>
                      }
                    />
                  </Box>

                  <Box minWidth="180px">
                    <Select
                      label="Status"
                      labelHidden
                      options={statusOptions}
                      value={filters.status}
                      onChange={() => {}}
                    />
                  </Box>

                  <Box minWidth="180px">
                    <Select
                      label="Action"
                      labelHidden
                      options={actionOptions}
                      value={filters.action}
                      onChange={() => {}}
                    />
                  </Box>

                  <InlineStack gap="200">
                    <Link
                      to={buildURL({
                        search: filters.search,
                        status: filters.status,
                        action: filters.action,
                      })}
                    >
                      <Button variant="primary">Apply filters</Button>
                    </Link>

                    <Link to={location.pathname}>
                      <Button>Reset</Button>
                    </Link>
                  </InlineStack>
                </InlineStack>
              </BlockStack>
            </Box>

            {/* =====================================================
                TABLE / EMPTY STATE
               ===================================================== */}
            {logs.length === 0 ? (
              <Box padding="600">
                <EmptyState
                  heading="No sync logs found"
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>Try changing the filters or search query.</p>
                </EmptyState>
              </Box>
            ) : (
              <IndexTable
                resourceName={resourceName}
                itemCount={logs.length}
                selectable={false}
                headings={[
                  { title: "NetSuite User" },
                  { title: "SKU" },
                  { title: "Shopify Product ID" },
                  { title: "Product Name" },
                  { title: "Action" },
                  { title: "Status" },
                  { title: "Error" },
                  { title: "Updated At" },
                ]}
              >
                {logs.map((entry, index) => (
                  <IndexTable.Row
                    id={String(entry.id)}
                    key={entry.id}
                    position={index}
                  >
                    <IndexTable.Cell>
                      <Text as="span" variant="bodyMd" fontWeight="medium">
                        {entry.netsuite_user || "—"}
                      </Text>
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                      <Text as="span" variant="bodyMd">
                        {entry.product_sku || "—"}
                      </Text>
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                      <Text
                        as="span"
                        variant="bodySm"
                        tone="subdued"
                        title={entry.shopify_product_id || ""}
                      >
                        {shortProductId(entry.shopify_product_id)}
                      </Text>
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                      <div title={entry.product_name || ""}>
                        <Text as="span" variant="bodyMd">
                          {truncateText(entry.product_name || "NA", 48)}
                        </Text>
                      </div>
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                      <Badge tone={getActionBadgeTone(entry.action)}>
                        {entry.action || "—"}
                      </Badge>
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                      <Badge tone={getStatusBadgeTone(entry.status)}>
                        {entry.status || "—"}
                      </Badge>
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                      <div title={entry.error_message || ""}>
                        <Text
                          as="span"
                          variant="bodySm"
                          tone={entry.error_message ? "critical" : "subdued"}
                        >
                          {entry.error_message
                            ? truncateText(entry.error_message, 80)
                            : "No Error"}
                        </Text>
                      </div>
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                      <Text as="span" variant="bodySm" tone="subdued">
                        {entry.updated_at
                          ? new Date(entry.updated_at).toLocaleString()
                          : "—"}
                      </Text>
                    </IndexTable.Cell>
                  </IndexTable.Row>
                ))}
              </IndexTable>
            )}

            {/* =====================================================
                PAGINATION
               ===================================================== */}
            {totalPages > 1 && (
              <Box padding="500" borderBlockStartWidth="025" borderColor="border">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="span" variant="bodySm" tone="subdued">
                    Page {page} of {totalPages}
                  </Text>

                  <InlineStack gap="200">
                    {page > 1 ? (
                      <Link
                        to={buildURL({
                          page: page - 1,
                          search: filters.search,
                          status: filters.status,
                          action: filters.action,
                        })}
                      >
                        <Button>Previous</Button>
                      </Link>
                    ) : (
                      <Button disabled>Previous</Button>
                    )}

                    {page < totalPages ? (
                      <Link
                        to={buildURL({
                          page: page + 1,
                          search: filters.search,
                          status: filters.status,
                          action: filters.action,
                        })}
                      >
                        <Button variant="primary">Next</Button>
                      </Link>
                    ) : (
                      <Button disabled>Next</Button>
                    )}
                  </InlineStack>
                </InlineStack>
              </Box>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}