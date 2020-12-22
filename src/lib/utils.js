import uniq from "lodash/uniq";

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
    creators && creators[0] && creators[0].name
  )}/${id}`;
}
