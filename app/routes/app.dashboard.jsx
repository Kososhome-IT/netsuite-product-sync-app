import {
  Box,
  Card,
  Layout,
   DataTable,
  Link,
  List,
  Page,
  Text,
  Divider,
  Badge ,
  BlockStack,
} from "@shopify/polaris";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { query } from "../utils/db.psql";
import { TitleBar } from "@shopify/app-bridge-react";
// import { AppProvider } from "@shopify/shopify-app-remix/react";
export const loader = async () => {
  const res = await query('SELECT * FROM dashboard_logs ORDER BY updated_at DESC');
  return json(res.rows);
};

export default function DashboardPage() {
  const data = useLoaderData();

   const rows = data.map(entry => [
    <Text fontWeight="semibold" key={`user-${entry.id}`}>{entry.netsuite_user}</Text>,
    entry.product_sku,
    <Badge key={`badge-${entry.id}`} status="info">{entry.shopify_product_id}</Badge>,
    entry.product_name,
    <Text
      variant="bodySm"
      as="span"
      tone="subdued"
      key={`date-${entry.id}`}
    >
      {new Date(entry.updated_at).toLocaleString()}
    </Text>,
  ]);
  return (
   
    <Page>
    <TitleBar title="Dashboard"></TitleBar>
      <Layout>
        <Layout.Section>
             <BlockStack gap="300">
          <Card  roundedAbove="sm"
            padding="400"
            background="bg-surface"
            shadow="md">
             <Box paddingBlockEnd="300">
              <Text variant="headingMd" as="h2">
                Recently Synced Products
              </Text>
            </Box>

            <Divider />
            <Box
              border="base"
              borderRadius="300"
              overflowX="auto"
              background="bg-subdued"
              padding="200"
              >
                
            <DataTable
            columnContentTypes={['text', 'text', 'text', 'text', 'text']}
            headings={['NetSuite User', 'SKU', 'Product ID', 'Name', 'Updated At']}
            rows={rows}
          />
            </Box>
          </Card>
            </BlockStack>
        </Layout.Section>
       
      </Layout>
    </Page>
   
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
