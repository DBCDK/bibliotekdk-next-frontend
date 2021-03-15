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
  return str
    .replace(/\s+/g, "-")
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .toLowerCase();
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
  // @TODO there may be more than one creator - should it be handled? if yes
  // then it should be handled here - make creator an array
  return encodeString(title) + "_" + encodeString(creator);
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
 * Create internal article path for given article
 * @param {object} article
 *
 * @returns {string} The canonical article URL
 */
export function getArticlePath({ title, nid }) {
  return `artikel/${encodeString(title)}/${nid}`;
}

/**
 * Create canonical URL for given article
 * @param {object} article
 *
 * @returns {string} The canonical article URL
 */
export function getCanonicalArticleUrl(props) {
  return `${config.externalBaseUrl}/${getArticlePath(props)}`;
}
