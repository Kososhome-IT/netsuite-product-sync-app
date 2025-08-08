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
  Badge,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchNetSuiteInventoryItemsWithDetails } from "../netsuite-intigration/netsuite.server";

// Loader to fetch customers from NetSuite
export const loader = async () => {
  try {
    const customers = await fetchNetSuiteInventoryItemsWithDetails();
    // console.log("✅ Invetory Items fetched:", customers);

    return json({ success: true, customers });
  } catch (error) {
    console.error("❌ API Route Error:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

export default function ProductPage() {
  const { customers, error, success } = useLoaderData();
 const rows = customers.map((customer, index) => ([
    <Text fontWeight="semibold" key={`user-${index + 1}`}>{index + 1}</Text>,
    customer.id,
    <Badge key={`badge-${customer.externalId}`} status="info">{customer.externalId}</Badge>,
    customer.displayName || "N/A",
    <Text
      variant="bodySm"
      as="span"
      tone="subdued"
      key={`date-${customer.upcCode}`}
    >
      {customer.upcCode || "N/A"}
    </Text>, customer.custitem_ch_website_description || "N/A"
  ]))
return (

  <Page>
    <TitleBar title="NetSuite Inventory Items"></TitleBar>
    <Layout>
      <Layout.Section>
        <BlockStack gap="300">
          <Card roundedAbove="sm"
            padding="400"
            background="bg-surface"
            shadow="md">
            <Box paddingBlockEnd="300">
              <Text variant="headingMd" as="h2">
                Inventory Items
              </Text>
            </Box>

            <Divider />
            <Box
              border="base"
              borderRadius="300"
              overflowX="auto"
              background="bg-subdued"
              padding="200"
            ><DataTable
                columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text']}
                headings={['Sr No', 'Id', 'SKU/Item Number', 'Name', 'UPC', 'Website Description']}
                rows={rows}/>
            </Box>
          </Card>
        </BlockStack>
      </Layout.Section>

    </Layout>
  </Page>

);
}
