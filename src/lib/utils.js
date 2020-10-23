import { uniq } from "lodash";

import config from "../config";

/**
 * @file
 * This file contains utility function
 */

/**
 * Encode title and creator to be used
 * as part of the URL path
 *
 * @param {string} title
 * @param {string} creator
 *
 * @returns {string} encoded string
 */
export function encodeTitleCreator(title = "", creator = "") {
  return (
    title.replace(/\s+/g, "-") +
    "_" +
    creator.replace(/\s+/g, "-")
  ).toLowerCase();
}

/**
 * Create canonical URL for given work
 * @param {object} work
 *
 * @returns {string} The canonical work URL
 */
export function getCanonicalWorkUrl({ title, creators, id }) {
  return `${config.externalBaseUrl}/${encodeTitleCreator(
    title,
    creators[0].name
  )}/${id}`;
}

/**
 * Generates the work page description
 * @param {object} work The work
 * @returns {string}
 */
export function getPageDescription({ title, creators, materialTypes }) {
  const creator = creators[0] && creators[0].name;
  const allowedTypes = ["lydbog", "ebog", "bog"];
  const types = uniq(
    materialTypes
      .map((entry) => {
        for (let i = 0; i < allowedTypes.length; i++) {
          if (entry.materialType.toLowerCase().includes(allowedTypes[i])) {
            return allowedTypes[i];
          }
        }
      })
      .filter((type) => !!type)
  );

  let typesString = "";
  types.forEach((type, idx) => {
    if (idx > 0) {
      if (idx === types.length - 1) {
        // last element
        typesString += " eller ";
      } else {
        // middle element
        typesString += ", ";
      }
    } else {
      // first element
      typesString = " som ";
    }
    typesString += type;
  });

  return `Lån ${title}${
    creator ? ` af ${creator}` : ""
  }${typesString}. Bestil, reserver, lån fra alle danmarks biblioteker. Afhent på dit lokale bibliotek eller find online.`;
}
