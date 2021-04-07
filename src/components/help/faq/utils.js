import orderBy from "lodash/orderBy";
import groupBy from "lodash/groupBy";
import get from "lodash/get";

import Translate from "@/components/base/translate";
import { helpText } from "@/lib/api/helptexts.fragments";

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

  // sort faq alfabetic order
  return orderBy(data, ["title"], ["asc"]);
}

/**
 * function to sort data for accordian structure
 *
 * @param {array} data
 *
 * @returns {array}
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
 * function to sort data for accordian structure
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

  const sortedGroups = {};
  Object.keys(groups).forEach((key) => {
    sortedGroups[key] = sortData(groups[key]);
  });

  return sortedGroups;
}
