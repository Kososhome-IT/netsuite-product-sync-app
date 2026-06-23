import { WAREHOUSE_METAFIELD_MAP } from "./warehouse.config";

export function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function normalizeInteger(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number)
    ? String(Math.trunc(number))
    : null;
}

export function normalizeDate(value) {
  if (!value) return null;

  const raw = String(value).trim();

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  // MM/DD/YYYY or MM-DD-YYYY
  let match = raw.match(
    /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/
  );

  if (match) {
    const [, month, day, year] = match;

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // YYYY/MM/DD
  match = raw.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/
  );

  if (match) {
    const [, year, month, day] = match;

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // Last attempt: let JS parse it
  const date = new Date(raw);

  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  console.error("Unable to parse date:", value);

  return null;
}

export function buildInventoryMetafields({
  variantId,
  warehouse,
  body,
  quantity,
}) {
  const keys = WAREHOUSE_METAFIELD_MAP[warehouse];

  if (!keys) return [];

  const candidates = [
    {
      key: keys.available,
      type: "number_integer",
      value: normalizeInteger(quantity),
    },
    {
      
      key: keys.inTransit,
      type: "number_integer",
      value: normalizeInteger(body.intransit),
    },
    {
      
      key: keys.goodsInTransitDate,
      type: "date",
      value: normalizeDate(body.expecteddeliverydate),
    },
    {
      
      key: keys.onOrder,
      type: "number_integer",
      value: normalizeInteger(body.onorder),
    },
    {
      
      key: keys.sellable,
      type: "number_integer",
      value: normalizeInteger(body.onorder),
    },
    {
      
      key: keys.openPurchaseDate,
      type: "date",
      value: normalizeDate(body.expectedduedate),
    },
  ];

  return candidates
    .filter(
      (metafield) =>
        metafield.value !== null &&
        metafield.value !== ""
    )
    .map((metafield) => ({
      ownerId: variantId,
      namespace: "custom",
      key: metafield.key,
      type: metafield.type,
      value: metafield.value,
    }));
}