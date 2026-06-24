export function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidMetafieldValue(value) {
  if (value === undefined || value === null) return false;

  // string
  if (typeof value === "string") {
    return value.trim() !== "";
  }

  // array
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  // object
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  return true;
}

export function parseInchesAndPounds(rawValue) {
  if (!rawValue) return null;

  const str = String(rawValue).toLowerCase().trim();

  // extract number
  const numberMatch = str.match(/[\d.]+/);
  const value = numberMatch
    ? parseFloat(Number(numberMatch[0]).toFixed(2))
    : null;

  if (!value) return null;

  // detect unit
  let unit = null;
  if (str.includes("in") || str.includes("inch")) {
    unit = "in";
  } else if (str.includes("lb") || str.includes("pound")) {
    unit = "lb";
  }

  return { value, unit };
}

export function transformMetafieldValue(mf) {
  const raw = mf.value;
  const parsed = parseInchesAndPounds(raw);

  // DIMENSION
  if (mf.type === "dimension") {
    return JSON.stringify({
      value: parsed?.value ?? Number(raw),
      unit: "in",
    });
  }

  // WEIGHT
  if (mf.type === "weight") {
    return JSON.stringify({
      value: parsed?.value ?? Number(raw),
      unit: "lb",
    });
  }

  // default
  if (typeof raw === "string") return raw;
  return JSON.stringify(raw);
}