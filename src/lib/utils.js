import getConfig from "next/config";
import Translate from "@/components/base/translate";
import uniq from "lodash/uniq";

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

export function extractCreatorsPrioritiseCorporation(creatorsBeforeFilter) {
  if (!creatorsBeforeFilter) return;
  if (!Array.isArray(creatorsBeforeFilter)) {
    creatorsBeforeFilter = [creatorsBeforeFilter];
  }
  const corporations = creatorsBeforeFilter?.filter(
    (creator) => creator.__typename === "Corporation"
  );

  return corporations?.length > 0 ? corporations : creatorsBeforeFilter;
}

/**
 * Encode title and creator to be used
 * as part of the URL path
 *
 * @param {string} title
 * @param {array<object>} creators
 *
 * @returns {string} encoded string
 */
export function encodeTitleCreator(title = "", creators = []) {
  const creator = extractCreatorsPrioritiseCorporation(creators)?.[0];

  return creator
    ? encodeString(title) + "_" + encodeString(creator.display)
    : encodeString(title);
}

/**
 *
 * @param {string} fullTitle
 * @param {array<object>} creators
 * @param {string} workId
 * @return {{query: {title_author: string, workId}, pathname: string}}
 */
export function getWorkUrl(fullTitle, creators, workId) {
  return `/materiale/${encodeTitleCreator(fullTitle, creators)}/${workId}`;
}

/**
 *
 * @param {string} title
 * @param {number|string} articleId
 * @return {{query: {articleId, title}, pathname: string}}
 */
export function getArticleUrl(title, articleId) {
  return `/artikel/${encodeString(title)}/${articleId}`;
}

/**
 *
 * @param {string} title
 * @param {string} workId
 * @param {string} id
 * @returns {string}
 */
export function getInfomediaReviewUrl(title, workId, id) {
  return `/anmeldelse/${encodeString(title)}/${workId}/${id}`;
}

/**
 *
 * @param {string} title
 * @param {string} workId
 * @param {string} pid
 * @returns {string}
 */
export function getMaterialReviewUrl(title, workId, pid) {
  return `/anmeldelse/${title}/${workId}/${pid}`;
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
    extractCreatorsPrioritiseCorporation(creators) || [{ display: "" }]
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

export function uniqueSubjectEntries(oldArray) {
  return uniq(oldArray.map((subject) => subject.display));
}

export function uniqueEntries(oldArray) {
  return uniq(oldArray);
}

export function comparableYear(a) {
  return !a ||
    !["string", "number"].includes(typeof a) ||
    ["????", ""].includes(a)
    ? 1
    : a;
}

export function chainFunctions(functions) {
  return (initialValue) =>
    functions.reduce((accumulator, func) => func(accumulator), initialValue);
}

/**
 * Get the first match of a series of conditions
 * @template T
 * @template V
 * @param {T} matcherValue
 * @param {V} defaultReturn
 * @param {[T, V][]} matcherArray
 * @returns {V}
 */
export function getFirstMatch(matcherValue, defaultReturn, matcherArray) {
  return (
    matcherArray?.find((el) => el[0] === matcherValue)?.[1] || defaultReturn
  );
}

export function getElementById(elementId) {
  return elementId && document.querySelector(`#${CSS.escape(elementId)}`);
}

/**
 * function that translates and encodes label
 * @param {string} context
 * @param {string} label
 * @param requestedLang
 * @returns {string}
 */
export function translateAndEncode(context, label, requestedLang = undefined) {
  return encodeString(
    Translate({
      context,
      label,
      requestedLang,
    })
  );
}

/**
 *
 * @param {*} agencyID
 * @returns boolean true if public library (Folkebibliotek)
 */
export const isPublicLibrary = (agencyID) => {
  const faroeIslandsLibraries = ["900455", "911116", "911130"];
  const parsedID = agencyID + "";
  return (
    parsedID?.charAt(0) === "7" || faroeIslandsLibraries.includes(parsedID)
  );
};

export const LibraryTypeEnum = Object.freeze({
  DANISH_PUBLIC_LIBRARY: "DANISH_PUBLIC_LIBRARY",
  FAROESE_LIBRARY: "FAROESE_LIBRARY",
  OTHER_LIBRARY: "OTHER_LIBRARY",
  GREENLAND_LIBRARY: "GREENLAND_LIBRARY",
});

/**
 * Gets the library type
 * @param {*} agencyID
 * @returns string true if public library (Folkebibliotek)
 */
export function getLibraryType(agencyID) {
  const faroeIslandsLibraries = ["900455", "911116", "911130"];
  const greenlandLibraries = ["900500", "911130", "945800"];
  const parsedID = agencyID + "";

  if (faroeIslandsLibraries.includes(parsedID)) {
    return LibraryTypeEnum.FAROESE_LIBRARY;
  } else if (greenlandLibraries.includes(parsedID)) {
    return LibraryTypeEnum.GREENLAND_LIBRARY;
  } else if (parsedID?.charAt(0) === "7") {
    return LibraryTypeEnum.DANISH_PUBLIC_LIBRARY;
  } else {
    return LibraryTypeEnum.OTHER_LIBRARY;
  }
}
