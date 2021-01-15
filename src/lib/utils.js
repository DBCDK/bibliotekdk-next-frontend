import config from "../config";

/**
 * @file
 * This file contains utility function
 */

/**
 * Encode string
 *
 * @param {string}
 *
 * @returns {string} encoded string
 */
export function encodeString(str = "") {
  return str.replace(/\s+/g, "-").toLowerCase();
}

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
  return (encodeString(title) + "_" + encodeString(creator)).toLowerCase();
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

/**
 * Create canonical URL for given article
 * @param {object} article
 *
 * @returns {string} The canonical article URL
 */
export function getCanonicalArticleUrl({ title, nid }) {
  return `${config.externalBaseUrl}/${encodeString(title)}/${nid}`;
}
