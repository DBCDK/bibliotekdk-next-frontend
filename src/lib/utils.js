import getConfig from "next/config";

const APP_URL =
  getConfig()?.publicRuntimeConfig?.app?.url || "http://localhost:3000";

/**
 * @file
 * This file contains utility function
 */

/**
 * Encode string
 * Get rid of diacritics and stuff
 *
 * @param {string} str
 *
 * @returns {string} encoded string
 */
export function encodeString(str = "") {
  return str
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\w]/g, "-")
    .replace(/-+/g, "-");
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
  return creator
    ? encodeString(title) + "_" + encodeString(creator)
    : encodeString(title);
}

/**
 * Create canonical URL for given work
 * @param {object} work
 *
 * @returns {string} The canonical work URL
 */
export function getCanonicalWorkUrl({ title, creators, id }) {
  return `${APP_URL}/materiale/${encodeTitleCreator(
    title,
    creators?.[0]?.name
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
 * @param {object} props
 * @param {object} props.article
 *
 * @returns {string} The canonical article URL
 */
export function getCanonicalArticleUrl(props) {
  return `${APP_URL}/${getArticlePath(props)}`;
}

/**
 * Handle this work as a periodica
 *
 * @param {object} workTypes
 * @param {object} materialTypes
 * @returns {boolean}
 */
export function getIsPeriodicaLike(workTypes, materialTypes) {
  return (
    !!workTypes?.find((workType) => workType?.toLowerCase() === "periodica") ||
    !!materialTypes?.find(
      (materialType) => materialType?.specific?.toLowerCase() === "årbog"
    )
  );
}

/**
 * Generalised infomediaUrl-builder
 *
 * @param {string} title
 * @param {string} workId
 * @param {string} infomadiaId
 * @return {string}
 */
export function infomediaUrl(title, workId, infomadiaId) {
  return `/infomedia/${title}/${workId}/${infomadiaId}`;
}

export function flattenWord(word) {
  return word?.toLowerCase().replace(/[^0-9a-z]/gi, "");
}

export function uniqueSubjectEntries(oldArray) {
  return [
    ...new Set(
      oldArray?.map((s) => s?.display?.toLowerCase().replace(/\./g, ""))
    ),
  ];
}

export function uniqueEntries(oldArray) {
  return [
    ...new Set(oldArray?.map((s) => s?.toLowerCase().replace(/\./g, ""))),
  ];
}

export function indexInArray(referenceArray, element, defaultValue = 2) {
  return referenceArray?.indexOf(element) !== -1
    ? referenceArray?.indexOf(element)
    : defaultValue;
}

export function comparableYear(a) {
  return !a ||
    !["string", "number"].includes(typeof a) ||
    ["????", ""].includes(a)
    ? 1
    : a;
}
