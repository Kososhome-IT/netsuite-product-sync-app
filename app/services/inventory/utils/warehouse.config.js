export const WAREHOUSE_LOCATION_MAP = {
  "High Point, NC": `gid://shopify/Location/${process.env.NC_WAREHOUSE_LOCATION_ID}`,
  "Los Angeles, CA": `gid://shopify/Location/${process.env.CA_WAREHOUSE_LOCATION_ID}`,
};

export const WAREHOUSE_METAFIELD_MAP = {
  "High Point, NC": {
    sellable:"nc_sellable_qty",
    available: "nc_instock",
    inTransit: "nc_in_transit",
    goodsInTransitDate: "nc_on_order_eta",
    onOrder: "nc_on_order",
    openPurchaseDate: "nc_eta",
  },
  "Los Angeles, CA": {
    sellable:"ca_sellable_qty",
    available: "ca_instock",
    inTransit: "ca_in_transit",
    goodsInTransitDate: "ca_on_order_eta",
    onOrder: "ca_on_order",
    openPurchaseDate: "ca_eta",
  },
};