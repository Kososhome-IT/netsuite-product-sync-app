import { json } from "@remix-run/node";
import {
  useLoaderData,
  useSearchParams,
  useLocation,
  Link,
} from "@remix-run/react";
import {
  Page,
  Card,
  DataTable,
  Badge,
  Text,
  InlineStack,
  BlockStack,
  Button,
  Divider,
} from "@shopify/polaris";
import prisma from "../db.server";

/* ----------------------------------------------------
   Loader
---------------------------------------------------- */
export async function loader({ request }) {
  const url = new URL(request.url);

  const status = url.searchParams.get("status");
  const sku = url.searchParams.get("sku");

  const page = Number(url.searchParams.get("page") || 1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const where = {
    ...(status && status !== "ALL" ? { status } : {}),
    ...(sku ? { sku: { contains: sku, mode: "insensitive" } } : {}),
  };

  const [logs, totalCount, success, failed] = await Promise.all([
    prisma.inventoryLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.inventoryLog.count({ where }),
    prisma.inventoryLog.count({ where: { status: "SUCCESS" } }),
    prisma.inventoryLog.count({ where: { status: "FAILED" } }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return json({
    logs,
    totalCount,
    totalPages,
    page,
    success,
    failed,
  });
}

/* ----------------------------------------------------
   Error Cell
---------------------------------------------------- */
function ErrorCell({ message }) {
  if (!message) return "-";

  return (
    <div
      style={{
        maxWidth: "320px",
        whiteSpace: "normal",
        wordBreak: "break-word",
      }}
      title={message}
    >
      <Text tone="critical" truncate>
        {message}
      </Text>
    </div>
  );
}

/* ----------------------------------------------------
   UI
---------------------------------------------------- */
export default function InventoryLogsPage() {
  const {
    logs,
    totalCount,
    totalPages,
    page,
    success,
    failed,
  } = useLoaderData();

  const [searchParams] = useSearchParams();
  const location = useLocation(); // 🔑 REQUIRED

  const buildURL = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    return `${location.pathname}?${params.toString()}`;
  };

  const rows = logs.map((log) => [
    log.sku,
    log.warehouse,
    log.quantity,
    <Badge
      tone={log.status === "SUCCESS" ? "success" : "critical"}
      key={log.id}
    >
      {log.status}
    </Badge>,
    <ErrorCell message={log.errorMessage} key={`err-${log.id}`} />,
    new Date(log.createdAt).toLocaleString(),
  ]);

  return (
    <Page title="Inventory Sync Logs">
      <BlockStack gap="500">
        {/* Metrics */}
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

        {/* Table */}
        <Card>
          <DataTable
            columnContentTypes={[
              "text",
              "text",
              "numeric",
              "text",
              "text",
              "text",
            ]}
            headings={[
              "SKU",
              "Warehouse",
              "Qty",
              "Status",
              "Error",
              "Time",
            ]}
            rows={rows}
          />

         {/* -------- Pagination (Polaris-native, WORKING) -------- */}
{totalPages > 1 && (
  <InlineStack align="center" gap="300">
    {page > 1 && (
      <Button
        size="slim"
        variant="secondary"
        url={`${location.pathname}?${new URLSearchParams({
          ...Object.fromEntries(searchParams),
          page: String(page - 1),
        }).toString()}`}
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
        url={`${location.pathname}?${new URLSearchParams({
          ...Object.fromEntries(searchParams),
          page: String(page + 1),
        }).toString()}`}
      >
        Next
      </Button>
    )}
  </InlineStack>
)}

          {logs.length === 0 && (
            <>
              <Divider />
              <Text alignment="center" tone="subdued">
                No inventory logs found.
              </Text>
            </>
          )}
        </Card>
      </BlockStack>
    </Page>
  );
}
