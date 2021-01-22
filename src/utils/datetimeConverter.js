const shortMonth = [
  "jan",
  "feb",
  "mar",
  "apr",
  "maj",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "dec",
];

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
