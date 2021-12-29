import groupBy from "lodash/groupBy";
import flatten from "lodash/flatten";

export function sortManifestations(manifestations) {
  // materialType type priority list
  const groupOrder = [
    "Bog",
    "Ebog",
    "Lydbog (net)",
    "Lydbog (cd-mp3)",
    "Lydbog (cd)",
    "Lydbog (bånd)",
  ];

  // Group manifistations by materialType
  const groups = groupBy(manifestations, "materialType");

  // Sort groups by groupOrder list
  const orderedGroups = Object.keys(groups).sort((a, b) => {
    //  If not in groupOrder list, send to last
    if (!groupOrder.includes(a)) {
      return 1;
    }
    if (!groupOrder.includes(b)) {
      return -1;
    }
    // else sort
    return groupOrder.indexOf(a) - groupOrder.indexOf(b);
  });

  // Order individual groups by datePublished
  const res = [];
  orderedGroups.forEach((name) => {
    // custom sort function
    res.push(
      groups[name].sort(function (a, b) {
        a = a.datePublished;
        b = b.datePublished;

        // if invalid, empty or missing, send to last
        if (!a || a === "" || a === "????") {
          return 1;
        }
        if (!b || b === "" || b === "????") {
          return -1;
        }
        // else sort
        if (a === b) {
          return 0;
        }
        return a > b ? -1 : 1;
      })
    );
  });

  // Return flatten array of the result (not arrays in arrays)
  return flatten(res);
}
