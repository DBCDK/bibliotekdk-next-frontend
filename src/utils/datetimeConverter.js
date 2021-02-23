import { months } from "@/components/base/translate";

/**
 * epoch timestamp to human date
 *
 * @param {int} timestamp
 *
 * @returns {string}
 */

export function timestampToShortDate(timestamp) {
  if (!timestamp) {
    return;
  }

  const shortMonths = months({ label: "shortenedMonths" });

  const a = new Date(timestamp);

  const year = a.getFullYear();
  const month = (shortMonths && shortMonths[a.getMonth()]) || a.getMonth() + 1;
  const date = a.getDate();

  return date + " " + month + ". " + year;
}
