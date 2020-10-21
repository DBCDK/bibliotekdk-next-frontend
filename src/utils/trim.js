/**
 * cyKey
 * function to generate cypress keys (data-cy)
 *
 * @param {obj} props
 * @param {string} props.name
 * @param {string} props.prefix
 * @param {string} props.seperator
 * @param {bool} lowerCase
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

  const n = `${prefix}-${name.replace(/\s/g, seperator)}`;

  if (lowerCase) {
    return n.toLowerCase();
  }

  return n;
}
