import {
  NETSUITE_CATEGORY_MAP,
  CATEGORY_CONFIG,
  GLOBAL_METAFIELDS_CONFIG,
  VARIANT_METAFIELDS_CONFIG,
} from "../../../config/category-mapping";

/* =====================================================
 * Resolve from NetSuite category name
 * ===================================================== */
export function resolveFromNetSuite(netsuiteCategory) {
  if (!netsuiteCategory) return null;

  const internalKey =
    NETSUITE_CATEGORY_MAP[netsuiteCategory.trim()];

  if (!internalKey) return null;

  return CATEGORY_CONFIG[internalKey] || null;
}

/* =====================================================
 * Resolve from Shopify taxonomy ID
 * ===================================================== */
export function resolveFromShopifyCategoryId(taxonomyId) {
  if (!taxonomyId) return null;

  return (
    Object.values(CATEGORY_CONFIG).find(
      (config) => config.taxonomyId === taxonomyId
    ) || null
  );
}

/* =====================================================
 * Merge metafields safely
 * ===================================================== */
export function mergeMetafields(existing, categoryBased) {
  const map = new Map();

  [...existing, ...categoryBased].forEach((mf) => {
    map.set(`${mf.namespace}.${mf.key}`, mf);
  });

  return Array.from(map.values());
}

export { VARIANT_METAFIELDS_CONFIG };
export { GLOBAL_METAFIELDS_CONFIG };

