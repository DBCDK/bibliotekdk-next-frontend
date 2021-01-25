import Translate from "@/components/base/translate";
const shortMonth = Translate({ context: "units", label: "shortMonths" });

/**
 * epoch timestamp to human date
 *
 * @param {int} timestamp
 *
 * @returns {string}
 */

export function timestampToShortDate(timestamp) {
  const a = new Date(timestamp);
  const year = a.getFullYear();
  const month = shortMonth[a.getMonth()];
  const date = a.getDate();

  return date + " " + month + ". " + year;
}
