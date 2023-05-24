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
  if (isNaN(a)) {
    return timestamp;
  }

  const year = a.getFullYear();
  const month = (shortMonths && shortMonths[a.getMonth()]) || a.getMonth() + 1;
  const date = a.getDate();

  return date + " " + month + ". " + year;
}

/**
 * date
 * @param date yyyymmdd
 * @returns {string} format: yyyy-mm-dd
 */
export function numericToISO(numeric) {
  if (numeric.length === 8) {
    const y = numeric.slice(0, 4);
    const m = numeric.slice(4, 6);
    const d = numeric.slice(6, 8);
    return y + "-" + m + "-" + d;
  }
}

/**
 * date
 * @param date
 * @param prefix
 * @returns {string} format: dd. mmm. yyyy
 */
export function dateToShortDate(date, prefix = "") {
  // Dates can have many formats
  // example: "Årg. 68, nr. 7 (2015)"

  try {
    const shortMonths = months({ label: "shortenedMonths" });

    const array = date.split("-");

    const y = array[0];
    // remove leading zeros
    const m = array[1].replace(/^0+/, "");
    const d = array[2].replace(/^0+/, "");

    // month array starts at position 0, so we substracts m with 1
    return `${prefix}${d}. ${shortMonths[m - 1]}. ${y}`;
  } catch {
    return date;
  }
}

/**
 *
 * @returns {string} format: dd. mmm.
 */
export const dateToDayInMonth = (date) => {
  // get short month and remove leading spaces
  const shortMonths = months({ label: "shortenedMonths" });
  return `${date.getDate()}. ${shortMonths[date.getMonth()].replace(
    /\s/g,
    ""
  )}`;
};
