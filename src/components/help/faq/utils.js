import orderBy from "lodash/orderBy";
import get from "lodash/get";

/**
 * function to sort data for accordian structure
 *
 * @param {array} data
 *
 * @returns {array}
 */
export function sortData(data) {
  data = data.map((d) => {
    return { title: d.title, content: get(d, "body.value", "") };
  });

  // latest articles first
  return orderBy(data, ["title"], ["asc"]);
}
