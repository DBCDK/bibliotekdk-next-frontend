/**
 * cyKey
 * function to generate cypress keys (data-cy)
 *
 * @param {string} name
 * @param {string} prefix
 * @param {string} seperator
 * @param {boolean} lowerCase
 *
 * @returns {string}
 */

export function cyKey({
  name = "cypress",
  prefix = "key",
  seperator = "-",
  lowerCase = true,
}) {
  if (typeof name !== "string") {
    name = "cypress";
  }

  const n = `${prefix}-${name
    .replace(/\s/g, seperator)
    .replace("*", "")
    .replace("/", "-")}`;

  if (lowerCase) {
    return n.toLowerCase();
  }

  return n;
}
