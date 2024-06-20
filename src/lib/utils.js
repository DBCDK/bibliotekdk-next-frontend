import getConfig from "next/config";
import Translate from "@/components/base/translate";
import uniq from "lodash/uniq";
import animations from "@/components/base/animation/animations.module.css";
import { matchHas } from "next/dist/shared/lib/router/utils/prepare-destination";
import {
  fieldsToAdvancedUrl,
  getAdvancedSearchField,
} from "@/components/search/advancedSearch/utils";
import { LogicalOperatorsEnum } from "@/components/search/enums";

const APP_URL =
  getConfig()?.publicRuntimeConfig?.app?.url || "http://localhost:3000";

/**
 * @file
 * This file contains utility function
 */

/**
 * Grap isbn, And ONLY the isbn,  from given ccl (is=[ISBNNUMBER]).
 * @param ccl
 * @returns {isbn|null}
 */
export function isbnFromQuery(ccl) {
  if (!ccl) {
    return null;
  }
  // ccl should start with ccl=is - and end with a number (or -)
  const regexp = /^is=([0-9\-\/]*)$/;
  const groups = ccl.match(regexp);
  return groups?.[1] || null;
}

export function oclcFromQuery(ccl) {
  if (!ccl) {
    return null;
  }
  if (ccl?.startsWith("wcx=")) {
    return ccl.replace("wcx=", "");
  }
  return null;
}

/**
 * forfatter,titel,emne og fritekst - can be combined :)
 * @param ccl
 */
// export function (ccl) {}

/**
 * Find out what kind of linkme syntax we are handling
 * cql={} OR ccl = {} OR rec.id={} OR srollToEdition - take out the part to parse
 * and pass it to parseLinkme function
 * @param linkme
 */
export function preParsLinkme(linkme) {
  // @TODO .. should we return a type ? like type:cql ?

  let regexp = /^ccl=|^cql=/;
  if (linkme.match(regexp)) {
    return { type: "ccl", linkme: decodeURIComponent(linkme.substring(4)) };
  }
  regexp = /^rec.id=/;
  if (linkme.match(regexp)) {
    return { type: "recid", linkme: decodeURIComponent(linkme.substring(7)) };
  }

  return { type: "straight", linkme: decodeURIComponent(linkme) };
}

/**
 * Parse the query from linkme page - the query is a mix: ti, fo, em, tekst.
 * We only handle logical operator AND ..
 * @param query {}
 *  query object from ctx.query
 */
export function parseLinkmeQuery(query) {
  console.log(query, "QUERY");

  const mappings = {
    fo: "creator",
    em: "subject",
    ti: "title",
    tekst: "tekst",
  };
  // const parts = query.split("&");

  // console.log(parts, "PPPPPAAAAAAAAAAAAAAAAAAAAAAAAAAARTS");
  const inputFields = [];
  // let single;
  let operator;
  for (const [key, val] of Object.entries(query)) {
    if (Object.keys(mappings).includes(key)) {
      operator = inputFields.length < 1 ? null : LogicalOperatorsEnum.AND;
      inputFields.push(
        getAdvancedSearchField({
          type: mappings[key],
          value: val,
          operator: operator,
        })
      );
    }
  }

  return inputFields;
}

/**
 * Kind of preparser .. there are a bunch of links around the world and we want to convert them
 * to the syntax we accept.
 * eg. linkme.php?
 * @param linkme
 *  comes in the form cql={} OR ccl = {} OR rec.id={} OR srollToEdition
 * @returns {*}
 */
export function parseLinkme(fullLinkme) {
  const { type, linkme } = preParsLinkme(fullLinkme);

  console.log(linkme, "LIIIIIIIIIIIIIIIIINKKKKKKKKKKKKKME");
  // Faust-nr. is 8 or 9 digits - this one handles numbers with no key .. like: ?12345678:
  let regexp = /^(\d{8}|\d{9})$/;
  if (linkme.match(regexp)) {
    return `faust=${linkme}`;
  }
  // isbn numbers - 10 or 13 digits
  regexp = /^(\d{10}|\d{13})$/;
  if (linkme.match(regexp)) {
    return `isbn=${linkme}`;
  }

  // @TODO howabout urlencoded strings ??

  // rec.id (pid) .. eg 870970-basis:12345678
  regexp = /^([0-9]+-[A-Za-z]+:[0-9]+)$/i;
  if (linkme.match(regexp)) {
    return `rec.id=${linkme}`;
  }

  // @TODO scrollToEdition ??

  // @TODO linkme.php?scrollToEdition=true&rec.id=870970-basis%3A25657365 -- handle 'scrollToEdition' :)

  return parseLinkmeQuery(linkme);
}

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
    (creator) => creator?.__typename === "Corporation"
  );

  return corporations?.length > 0 ? corporations : creatorsBeforeFilter;
}

/**
 * Encode title and creator to be used
 * as part of the URL path
 *
 * @param {string} title
 * @param {Array<Object>} creators
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
 * @param {Array<Object>} creators
 * @param {string} workId
 * @returns {{query: {title_author: string, workId}, pathname: string}}
 */
export function getWorkUrl(fullTitle, creators, workId) {
  return `/materiale/${encodeTitleCreator(fullTitle, creators)}/${workId}`;
}

/**
 *
 * @param {string} title
 * @param {string} helpTextId
 * @returns {{query: {title_author: string, workId}, pathname: string}}
 */
export function getHelpUrl(title, helpTextId) {
  return `/hjaelp/${encodeString(title)}/${helpTextId}`;
}

/**
 *
 * @param {string} fullTitle
 * @param {string} workId
 * @returns {{query: {seriesTitle: string, workId: string, seriesNumber?: string}, pathname: string}}
 */
export function getSeriesUrl(fullTitle, workId) {
  return `/serie/${encodeString(fullTitle)}/${workId}`;
}

/**
 *
 * @param {string} fullTitle
 * @param {string} workId
 * @returns {{query: {universeTitle: string, workId: string, universeNumber?: string}, pathname: string}}
 */
export function getUniverseUrl(fullTitle, key) {
  return `/univers/${encodeString(fullTitle)}/${key}`;
}

/**
 *
 * @param {string} title
 * @param {number|string} articleId
 * @returns {{query: {articleId, title}, pathname: string}}
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
 * @param {Object} work
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
 * @param {Object} article
 *
 * @returns {string} The canonical article URL
 */
export function getArticlePath({ title, nid }) {
  return `artikel/${encodeString(title)}/${nid}`;
}

/**
 * Create canonical URL for given article
 * @param {Object} props
 * @param {Object} props.article
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
 * @returns {string}
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
 * Get the first match of a firstWorkFirstSeries of conditions
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
 * @param {string} agencyID
 * @returns {boolean} returns true if public library (Folkebibliotek)
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
/**
 * Parses an iso-8601 date string into human readable strings.
 * @param {string} isoDateString
 * @returns an object containing date and time fields. Eks {date: "D. 24. juni", time:"Kl. 11:07"}
 */
export function parseDate(isoDateString) {
  const dateObj = new Date(isoDateString);
  const day = dateObj.getUTCDate();
  const monthNames = [
    "jan.",
    "feb.",
    "mar.",
    "apr.",
    "maj",
    "jun.",
    "jul.",
    "aug.",
    "sep.",
    "okt.",
    "nov.",
    "dec.",
  ];
  const monthName = monthNames[dateObj.getUTCMonth()];

  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const year = dateObj.getFullYear();
  //check if the date is today:
  const today = new Date();

  const isToday =
    dateObj.getUTCDate() === today.getUTCDate() &&
    dateObj.getUTCMonth() === today.getUTCMonth() &&
    dateObj.getUTCFullYear() === today.getUTCFullYear();

  return { day, monthName, year, hours, minutes, isToday };
}

//TODO move to a loacation that is more central
export function buildHtmlLink(txt, url, overrideTarget = null) {
  const target = overrideTarget || "_blank";

  return `<a href="${url}" target=${target} class="${animations.underlineContainer} ${animations.top_line_false} ${animations.top_line_keep_false}">${txt}</a>`;
}

export function setSessionStorageItem(key, value) {
  //private mode in Safari and firefox throws errors if sessionStorage i used.
  try {
    sessionStorage.setItem(key, value);
  } catch (e) {
    console.error("Failed to set item in sessionStorage:", e);
  }
}

export function getSessionStorageItem(key) {
  try {
    //private mode in Safari and firefox throws errors if sessionStorage i used.

    return sessionStorage.getItem(key);
  } catch (e) {
    console.error("Failed to get item from sessionStorage:", e);
    return null; // return a default value
  }
}

export function removeSessionStorageItem(key) {
  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    console.error("Failed to remove item from sessionStorage:", e);
  }
}

export function setLocalStorageItem(key, value) {
  //private mode in Safari and firefox throws errors if localStorage i used.
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error("Failed to set item in localStorage:", e);
  }
}

export function getLocalStorageItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error("Failed to get item from localStorage:", e);
    return null;
  }
}

export function removeLocalStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error("Failed to remove item from localStorage:", e);
  }
}

/**
 * Converts unixtimestamp to 'dd. mmm yyyy' format
 * @param {*} unixtimestamp
 * @returns
 */
export function unixToFormatedDate(unixtimestamp) {
  const date = new Date(unixtimestamp);

  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "maj",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}. ${month} ${year}`;
}
