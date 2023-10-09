import orderBy from "lodash/orderBy";
import groupBy from "lodash/groupBy";
import get from "lodash/get";

import Translate from "@/components/base/translate";

/**
 * function to sort data for accordion structure
 *
 * @param {array} data
 *
 * @returns {array}
 */
export function sortData(data) {
  data = data.map((d) => {
    return { title: d.title, content: get(d, "body.value", "") };
  });

  // sort faq alfabetic order
  return orderBy(data, ["title"], ["asc"]);
}

/**
 * function to group data for accordion structure
 *
 * @param {array} data
 *
 * @returns {Object}
 */
export function groupData(data) {
  const fallback = Translate({ context: "help", label: "faq-group-other" });

  const groups = groupBy(
    data,
    (e) => e?.fieldTags[0]?.entity?.entityLabel || fallback
  );

  return groups;
}

/**
 * function to group and sort data for accordion structure
 *
 * @param {array} data
 *
 * @returns {array}
 */
export function groupSortData(data) {
  const fallback = Translate({ context: "help", label: "faq-group-other" });

  const groups = groupBy(
    data,
    (e) => e?.fieldTags[0]?.entity?.entityLabel || fallback
  );

  // Sort groups naturaly by keyname
  const sortedKeys = Object.keys(groups).sort();
  // Fallback group keyname is send to last
  sortedKeys.push(sortedKeys.splice(sortedKeys.indexOf(fallback), 1)[0]);

  const sortedGroups = {};
  // Using the sorted keynames to sort group (values)
  sortedKeys.forEach((key) => {
    sortedGroups[key] = sortData(groups[key]);
  });

  return sortedGroups;
}
