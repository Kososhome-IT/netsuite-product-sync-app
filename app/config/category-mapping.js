/* =====================================================
 * NETSUITE → INTERNAL KEY MAP
 * ===================================================== */

export const NETSUITE_CATEGORY_MAP = {
  "OBJECTS": "ARTWORK",
  "ABSTRACT": "ARTWORK",
  "LANDSCAPE": "ARTWORK",
  "Eastern King": "BEDS_BED_FRAMES",
  "Queen": "BEDS_BED_FRAMES",
  "California King": "BEDS_BED_FRAMES",
  "Buffets & Cabinets": "BUFFETS",
  "Display Cabinets": "DISPLAY_HUTCHES",
  "Desks": "DESKS",
  "Bar & Wine Storage": "WINE_LIQUOR_CABINETS",
  "Ottomans & Stools": "OTTOMANS",
  "Bookcases": "BOOKCASES_STANDING_SHELVES",
  "Tall Cabinets": "CABINETS_STORAGE",
  "Nightstands": "NIGHTSTANDS",
  "Dressers": "DRESSERS",
  "Chests": "STORAGE_CHESTS",
  "Pendants": "PENDANT_LIGHT_FIXTURES",
  "Chandeliers": "CHANDELIERS",
  "Accent Chairs": "ARMCHAIRS",
  "Bar & Counter Stools": "BAR_STOOLS",
  "Dining Chairs": "KITCHEN_DINING_ROOM_CHAIRS",
  "Sofas": "SOFAS",
  "Dining Benches": "DINING_BENCHES",
  "Sectionals": "SECTIONAL_SOFAS",
  "Outdoor Sofas & Sectionals": "OUTDOOR_SOFAS",
  "Outdoor Dining Chairs": "OUTDOOR_CHAIRS",
  "Accent Benches": "BENCHES",
  "Outdoor Accent Chairs": "OUTDOOR_CHAIRS",
  "Outdoor Bar & Counter Stools": "OUTDOOR_CHAIRS",
  "Dining Tables": "KITCHEN_DINING_ROOM_TABLES",
  "Coffee Tables": "COFFEE_TABLES",
  "Accent & End Tables": "ACCENT_TABLES",
  "Console Tables": "CONSOLE_TABLES",
  "Outdoor Accent & End Tables": "OUTDOOR_TABLES",
  "Outdoor Coffee Tables": "COFFEE_TABLES",
  "Outdoor Dining Tables": "DINING_TABLES",
  "Outdoor Bar & Counter Tables": "BAR_TABLES",
  "Bar & Counter Tables": "KITCHEN_DINING_ROOM_TABLES",
  "Solids": "THROW_PILLOWS",
  "Jute & Seagrass": "RUGS",
  "Patterns": "THROW_PILLOWS",
  "Quilts & Comforters": "QUILTS_COMFORTERS",
  "Wool & Wool Blends": "RUGS",
  "Racks & Baskets": "BASKETS",
  "Blankets & Throws": "THROW_BLANKETS",
  "Duvet Covers": "DUVET_COVERS",
  "Viscose": "RUGS",
  "Doormats": "DOOR_MATS",
  "Bedding Basics": "BEDDING",
  "Pillow Inserts": "THROW_PILLOW_ACCESSORIES",
};

export const GLOBAL_METAFIELDS_CONFIG = [
  {
    namespace: "custom",
    key: "collection",
    type: "single_line_text_field",
  },
  {
    namespace: "custom",
    key: "class",
    type: "single_line_text_field",
  },
  {
    namespace: "custom",
    key: "product_category",
    type: "single_line_text_field",
  },
  {
    namespace: "custom",
    key: "product_sub_category",
    type: "single_line_text_field",
  },
  {
    namespace: "custom",
    key: "room_type",
    type: "single_line_text_field",
  },
  {
    namespace: "custom",
    key: "made_to_order",
    type: "single_line_text_field",
  },
  {
    namespace: "custom",
    key: "made_in_usa",
    type: "single_line_text_field",
  },
  {
    namespace: "custom",
    key: "msrp",
    type: "number_decimal",
  },
  {
    namespace: "custom",
    key: "imap",
    type: "number_decimal",
  },
];

export const VARIANT_METAFIELDS_CONFIG = [

  /* ================= BASIC ================= */
  {
    namespace: "custom",
    key: "show_on_website",
    type: "single_line_text_field",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "internal_id",
    type: "number_integer",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "division_status",
    type: "single_line_text_field",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "best_sellers",
    type: "single_line_text_field",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "imap",
    type: "number_decimal",
    owner: "variant",
  },

  /* ================= DIMENSIONS ================= */
  {
    namespace: "custom",
    key: "width",
    type: "number_decimal",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "depth",
    type: "number_decimal",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "height",
    type: "number_decimal",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "item_weight",
    type: "weight",
    owner: "variant",
  },

  /* ================= INVENTORY ================= */
  {
    namespace: "custom",
    key: "increment_qty",
    type: "number_integer",
    owner: "variant",
  },

  /* ================= PACKAGED ================= */
  {
    namespace: "custom",
    key: "packaged_width",
    type: "number_decimal",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "packaged_depth",
    type: "number_decimal",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "packaged_height",
    type: "number_decimal",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "packaged_weight",
    type: "weight",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "packaged_cubic_feet",
    type: "number_decimal",
    owner: "variant",
  },

  /* ================= BOXES ================= */
 {
      namespace: "custom",
      key: `box_1_dimensions`,
      type: "single_line_text_field",
      owner: "variant",
    },
    {
      namespace: "custom",
      key: `box_1_weight`,
      type: "weight",
      owner: "variant",
    },
    {
      namespace: "custom",
      key: `box_1_cbf`,
      type: "number_decimal",
      owner: "variant",
    },
 {
      namespace: "custom",
      key: `box_2_dimensions`,
      type: "single_line_text_field",
      owner: "variant",
    },
    {
      namespace: "custom",
      key: `box_2_weight`,
      type: "weight",
      owner: "variant",
    },
    {
      namespace: "custom",
      key: `box_2_cbf`,
      type: "number_decimal",
      owner: "variant",
    },
     {
      namespace: "custom",
      key: `box_3_dimensions`,
      type: "single_line_text_field",
      owner: "variant",
    },
    {
      namespace: "custom",
      key: `box_3_weight`,
      type: "weight",
      owner: "variant",
    },
    {
      namespace: "custom",
      key: `box_3_cbf`,
      type: "number_decimal",
      owner: "variant",
    },
     {
      namespace: "custom",
      key: `box_4_dimensions`,
      type: "single_line_text_field",
      owner: "variant",
    },
    {
      namespace: "custom",
      key: `box_4_weight`,
      type: "weight",
      owner: "variant",
    },
    {
      namespace: "custom",
      key: `box_4_cbf`,
      type: "number_decimal",
      owner: "variant",
    },
     {
      namespace: "custom",
      key: `box_5_dimensions`,
      type: "single_line_text_field",
      owner: "variant",
    },
    {
      namespace: "custom",
      key: `box_5_weight`,
      type: "weight",
      owner: "variant",
    },
    {
      namespace: "custom",
      key: `box_5_cbf`,
      type: "number_decimal",
      owner: "variant",
    },
  /* ================= SHIPPING ================= */
  {
    namespace: "custom",
    key: "knock_down",
    type: "single_line_text_field",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "ship_type",
    type: "single_line_text_field",
    owner: "variant",
  },

  /* ================= ATTRIBUTES ================= */
  {
    namespace: "custom",
    key: "primary_material_finish_code",
    type: "single_line_text_field",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "materials",
    type: "single_line_text_field",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "size",
    type: "single_line_text_field",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "color_family",
    type: "single_line_text_field",
    owner: "variant",
  },

  /* ================= FLAGS ================= */
  {
    namespace: "custom",
    key: "first_look",
    type: "single_line_text_field",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "new",
    type: "single_line_text_field",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "fsc_certified_product",
    type: "single_line_text_field",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "certification",
    type: "single_line_text_field",
    owner: "variant",
  },

  /* ================= MEDIA ================= */
  {
    namespace: "custom",
    key: "ai_file_link",
    type: "url",
    owner: "variant",
  },

  /* ================= INVENTORY BY LOCATION ================= */
  {
    namespace: "custom",
    key: "nc_instock",
    type: "number_integer",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "ca_instock",
    type: "number_integer",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "ca_eta",
    type: "date",
    owner: "variant",
  },
  {
    namespace: "custom",
    key: "nc_eta",
    type: "date",
    owner: "variant",
  },
];

export const CATEGORY_CONFIG = {

  ARTWORK: {
    taxonomyId: "gid://shopify/TaxonomyCategory/hg-3-4",
    metafields: [

      {
        namespace: "custom",
        key: "artist_medium",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "frame",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "frame_style",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "frame_thickness",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  BEDS_BED_FRAMES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-2-2",
    metafields: [

      {
        namespace: "custom",
        key: "adjustable_mattress_compatible",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "bed_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "box_spring_required",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "cleaning_code",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "clearance_footboard_to_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "clearance_of_headboard_to_top_of_slats",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "clearance_side_rails_to_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "interior_dimensions_for_mattress",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "number_of_slats",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "overall_footboard_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "overall_headboard_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "overall_side_rail_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "slat_material",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "slats_type",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  BUFFETS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-4-2",
    metafields: [

      {
        namespace: "custom",
        key: "casegoods_adjustable_levelers",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_adjustable_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_anti_tip_kit_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_bottle_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_clearance_from_floors",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_catch_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_mounting_location",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_fixed_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_hinge_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_wire_management_holes",
        type: "number_integer",
        value: ""
      },
    ]
  },
  DISPLAY_HUTCHES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-4-3-8",
    metafields: [

      {
        namespace: "custom",
        key: "casegoods_adjustable_levelers",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_adjustable_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_anti_tip_kit_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_bottle_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_clearance_from_floors",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_catch_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_mounting_location",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_fixed_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_hinge_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_wire_management_holes",
        type: "number_integer",
        value: ""
      },
    ]
  },
  DESKS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-12-1",
    metafields: [

      {
        namespace: "custom",
        key: "casegoods_adjustable_levelers",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_adjustable_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_anti_tip_kit_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_bottle_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_clearance_from_floors",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_catch_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_mounting_location",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_fixed_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_hinge_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_wire_management_holes",
        type: "number_integer",
        value: ""
      },
    ]
  },
  WINE_LIQUOR_CABINETS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-4-15",
    metafields: [

      {
        namespace: "custom",
        key: "casegoods_adjustable_levelers",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_adjustable_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_anti_tip_kit_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_bottle_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_clearance_from_floors",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_catch_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_mounting_location",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_fixed_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_hinge_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_wire_management_holes",
        type: "number_integer",
        value: ""
      },
    ]
  },
  OTTOMANS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-14",
    metafields: [

      {
        namespace: "custom",
        key: "casegoods_adjustable_levelers",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_adjustable_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_anti_tip_kit_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_bottle_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_clearance_from_floors",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_catch_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_mounting_location",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_fixed_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_hinge_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_wire_management_holes",
        type: "number_integer",
        value: ""
      },
    ]
  },
  BOOKCASES_STANDING_SHELVES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-19-1",
    metafields: [

      {
        namespace: "custom",
        key: "casegoods_adjustable_levelers",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_adjustable_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_anti_tip_kit_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_bottle_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_clearance_from_floors",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_catch_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_mounting_location",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_fixed_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_hinge_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_wire_management_holes",
        type: "number_integer",
        value: ""
      },
    ]
  },
  CABINETS_STORAGE: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-4",
    metafields: [

      {
        namespace: "custom",
        key: "casegoods_adjustable_levelers",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_adjustable_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_anti_tip_kit_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_bottle_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_clearance_from_floors",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_catch_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_mounting_location",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_fixed_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_hinge_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_wire_management_holes",
        type: "number_integer",
        value: ""
      },
    ]
  },
  NIGHTSTANDS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-24-6",
    metafields: [

      {
        namespace: "custom",
        key: "casegoods_adjustable_levelers",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_adjustable_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_anti_tip_kit_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_bottle_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_clearance_from_floors",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_catch_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_mounting_location",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_fixed_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_hinge_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_wire_management_holes",
        type: "number_integer",
        value: ""
      },
    ]
  },
  DRESSERS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-4-5",
    metafields: [

      {
        namespace: "custom",
        key: "casegoods_adjustable_levelers",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_adjustable_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_anti_tip_kit_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_bottle_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_clearance_from_floors",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_catch_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_mounting_location",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_fixed_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_hinge_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_wire_management_holes",
        type: "number_integer",
        value: ""
      },
    ]
  },
  STORAGE_CHESTS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-4-13",
    metafields: [

      {
        namespace: "custom",
        key: "casegoods_adjustable_levelers",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_adjustable_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_anti_tip_kit_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_bottle_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_clearance_from_floors",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_catch_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_door_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_mounting_location",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_glide_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_fixed_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_hinge_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_shelf_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "casegoods_wire_management_holes",
        type: "number_integer",
        value: ""
      },
    ]
  },
  PENDANT_LIGHT_FIXTURES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/hg-13-9-5",
    metafields: [

      {
        namespace: "custom",
        key: "bulb_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "bulbs_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "canopy_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "dimmable",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "hanging_method",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "hanging_method_adjustable",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "lighting_frame_size",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "max_voltage",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "max_wattage",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "maximum_hanging_length",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "minimum_hanging_length",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "number_of_bulbs",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "sloped_ceiling_compatible",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  CHANDELIERS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/hg-13-9-3",
    metafields: [

      {
        namespace: "custom",
        key: "bulb_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "bulbs_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "canopy_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "dimmable",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "hanging_method",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "hanging_method_adjustable",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "lighting_frame_size",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "max_voltage",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "max_wattage",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "maximum_hanging_length",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "minimum_hanging_length",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "number_of_bulbs",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "sloped_ceiling_compatible",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  ARMCHAIRS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-7-1-1",
    metafields: [

      {
        namespace: "custom",
        key: "adjustable_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "arm_height_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "functionality",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "material_cleaning_code",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_footrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "remote_control",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rub_count",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_count",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_depth",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_width",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "type_of_motion",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "usb_port",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  BAR_STOOLS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-7-12-2",
    metafields: [

      {
        namespace: "custom",
        key: "adjustable_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "arm_height_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "functionality",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "material_cleaning_code",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_footrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "remote_control",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rub_count",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_count",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_depth",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_width",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "type_of_motion",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "usb_port",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  KITCHEN_DINING_ROOM_CHAIRS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-7-9",
    metafields: [

      {
        namespace: "custom",
        key: "adjustable_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "arm_height_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "functionality",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "material_cleaning_code",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_footrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "remote_control",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rub_count",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_count",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_depth",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_width",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "type_of_motion",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "usb_port",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  SOFAS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-22",
    metafields: [

      {
        namespace: "custom",
        key: "adjustable_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "arm_height_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "functionality",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "material_cleaning_code",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_footrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "remote_control",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rub_count",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_count",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_depth",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_width",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "type_of_motion",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "usb_port",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  DINING_BENCHES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-3-1-7",
    metafields: [

      {
        namespace: "custom",
        key: "adjustable_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "arm_height_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "functionality",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "material_cleaning_code",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_footrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "remote_control",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rub_count",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_count",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_depth",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_width",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "type_of_motion",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "usb_port",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  SECTIONAL_SOFAS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-22-6",
    metafields: [

      {
        namespace: "custom",
        key: "adjustable_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "arm_height_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "functionality",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "material_cleaning_code",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_footrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "remote_control",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rub_count",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_count",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_depth",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_width",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "type_of_motion",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "usb_port",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  OUTDOOR_SOFAS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-15-4-4",
    metafields: [

      {
        namespace: "custom",
        key: "adjustable_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "arm_height_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "functionality",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "material_cleaning_code",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_footrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "remote_control",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rub_count",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_count",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_depth",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_width",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "type_of_motion",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "usb_port",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  OUTDOOR_CHAIRS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-15-4-2",
    metafields: [

      {
        namespace: "custom",
        key: "adjustable_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "arm_height_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "functionality",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "material_cleaning_code",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_footrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "remote_control",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rub_count",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_count",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_depth",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_width",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "type_of_motion",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "usb_port",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  BENCHES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-3",
    metafields: [

      {
        namespace: "custom",
        key: "adjustable_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "arm_height_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "back_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "functionality",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "material_cleaning_code",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_footrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "power_headrest",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "remote_control",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rub_count",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_construction",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_count",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_composition",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_cushion_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_depth",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_weight_capacity",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "seat_width",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "type_of_motion",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "usb_port",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  KITCHEN_DINING_ROOM_TABLES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-24-4",
    metafields: [

      {
        namespace: "custom",
        key: "apron_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "leaf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "number_of_leaves",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_under_shelf",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_extension_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_front_to_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_side_to_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_front_and_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_top_thickness",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_width_without_extension",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  COFFEE_TABLES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-24-1-1",
    metafields: [

      {
        namespace: "custom",
        key: "apron_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "leaf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "number_of_leaves",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_under_shelf",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_extension_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_front_to_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_side_to_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_front_and_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_top_thickness",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_width_without_extension",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  ACCENT_TABLES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-24-1",
    metafields: [

      {
        namespace: "custom",
        key: "apron_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "leaf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "number_of_leaves",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_under_shelf",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_extension_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_front_to_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_side_to_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_front_and_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_top_thickness",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_width_without_extension",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  CONSOLE_TABLES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-24-4-1",
    metafields: [

      {
        namespace: "custom",
        key: "apron_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "leaf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "number_of_leaves",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_under_shelf",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_extension_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_front_to_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_side_to_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_front_and_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_top_thickness",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_width_without_extension",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  OUTDOOR_TABLES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-15-6",
    metafields: [

      {
        namespace: "custom",
        key: "apron_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "leaf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "number_of_leaves",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_under_shelf",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_extension_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_front_to_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_side_to_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_front_and_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_top_thickness",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_width_without_extension",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  DINING_TABLES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-15-6-5",
    metafields: [

      {
        namespace: "custom",
        key: "apron_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "leaf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "number_of_leaves",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_under_shelf",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_extension_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_front_to_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_side_to_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_front_and_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_top_thickness",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_width_without_extension",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  BAR_TABLES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/fr-15-6-1",
    metafields: [

      {
        namespace: "custom",
        key: "apron_height",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "leaf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "number_of_leaves",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_from_floor",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_clearance_under_shelf",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_extension_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_large_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_front_to_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_measurement_between_legs_side_to_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_medium_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_front_and_back",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_overhang_side",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_interior_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_drawer_quantity",
        type: "number_integer",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_small_shelf_dimensions",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_top_thickness",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "table_width_without_extension",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  THROW_PILLOWS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/hg-3-64",
    metafields: [

      {
        namespace: "custom",
        key: "back_bottom_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "backing_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "closure_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "fill_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "inner_corner_ties",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "insert_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "packaging_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "pre_shrunken_before_use",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "primary_front_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rug_pad_recommended",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "special_wash_or_treatment",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  RUGS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/hg-3-57",
    metafields: [

      {
        namespace: "custom",
        key: "back_bottom_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "backing_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "closure_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "fill_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "inner_corner_ties",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "insert_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "packaging_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "pre_shrunken_before_use",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "primary_front_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rug_pad_recommended",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "special_wash_or_treatment",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  QUILTS_COMFORTERS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/hg-15-1-10",
    metafields: [

      {
        namespace: "custom",
        key: "back_bottom_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "backing_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "closure_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "fill_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "inner_corner_ties",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "insert_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "packaging_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "pre_shrunken_before_use",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "primary_front_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rug_pad_recommended",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "special_wash_or_treatment",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  BASKETS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/hg-3-6",
    metafields: [

      {
        namespace: "custom",
        key: "back_bottom_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "backing_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "closure_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "fill_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "inner_corner_ties",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "insert_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "packaging_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "pre_shrunken_before_use",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "primary_front_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rug_pad_recommended",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "special_wash_or_treatment",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  THROW_BLANKETS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/hg-15-1-4-2",
    metafields: [

      {
        namespace: "custom",
        key: "back_bottom_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "backing_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "closure_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "fill_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "inner_corner_ties",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "insert_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "packaging_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "pre_shrunken_before_use",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "primary_front_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rug_pad_recommended",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "special_wash_or_treatment",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  DUVET_COVERS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/hg-15-1-5",
    metafields: [

      {
        namespace: "custom",
        key: "back_bottom_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "backing_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "closure_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "fill_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "inner_corner_ties",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "insert_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "packaging_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "pre_shrunken_before_use",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "primary_front_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rug_pad_recommended",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "special_wash_or_treatment",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  DOOR_MATS: {
    taxonomyId: "gid://shopify/TaxonomyCategory/hg-3-26",
    metafields: [

      {
        namespace: "custom",
        key: "back_bottom_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "backing_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "closure_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "fill_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "inner_corner_ties",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "insert_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "packaging_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "pre_shrunken_before_use",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "primary_front_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rug_pad_recommended",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "special_wash_or_treatment",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  BEDDING: {
    taxonomyId: "gid://shopify/TaxonomyCategory/hg-15-1",
    metafields: [

      {
        namespace: "custom",
        key: "back_bottom_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "backing_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "closure_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "fill_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "inner_corner_ties",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "insert_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "packaging_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "pre_shrunken_before_use",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "primary_front_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rug_pad_recommended",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "special_wash_or_treatment",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
  THROW_PILLOW_ACCESSORIES: {
    taxonomyId: "gid://shopify/TaxonomyCategory/hg-3-78",
    metafields: [

      {
        namespace: "custom",
        key: "back_bottom_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "backing_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "closure_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "fill_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "inner_corner_ties",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "insert_included",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "packaging_type",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "pre_shrunken_before_use",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "primary_front_fabric",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "rug_pad_recommended",
        type: "single_line_text_field",
        value: ""
      },
      {
        namespace: "custom",
        key: "special_wash_or_treatment",
        type: "single_line_text_field",
        value: ""
      },
    ]
  },
};