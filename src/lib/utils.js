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
 * @return {string} encoded string
 */
export function encodeTitleCreator(title = "", creator = "") {
  return (
    title.replace(/\s+/g, "-") +
    "_" +
    creator.replace(/\s+/g, "-")
  ).toLowerCase();
}
