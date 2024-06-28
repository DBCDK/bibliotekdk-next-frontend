import getConfig from "next/config";
import Translate from "@/components/base/translate";
import uniq from "lodash/uniq";
import animations from "@/components/base/animation/animations.module.css";

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

/**
 * check if given ccl (or cql) is a 'hidden' rec.id - if so return it as is
 * @param ccl
 * @returns {*|null}
 */
export function recIdFromQuery(ccl) {
  // look for a hidden rec.id eg. rec.id=123456-basis:12345678
  const regexp = /^rec.id=([0-9]+-[A-Za-z]+:[0-9]+)$/i;
  return ccl.trim().match(regexp) ? ccl : null;
}

/**
 * Get oclc number. Query comes in the form ccl=wcx=474942501
 * @param ccl
 * @returns {*|null}
 */
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
 * Recognize a faustnumber. Some linkme queries comes in the form /linkme.php?cql=8787345331 - that is
 * we do NOT know what to look for .. so we check if it might be a faust
 * @param ccl
 */
export function faustFromQuery(ccl) {
  // look for 8 or 9 digits - probably a faust
  const regexp = /^(\d{8}|\d{9})$/;
  return ccl.match(regexp) ? ccl : null;
}

/**
 * Some of the linkme queries comes with an OR clause. - like: dkcclterm.is=9788726510478 OR dkcclterm.is=8726510472
 * if so - grab the first, skip the rest
 *
 * also if query is cql we only use the first part - skip part AFTER operator
 *
 * @param value
 */
export function checkQueryValue(value) {
  const parts = value.split(/ OR | or | eller | ELLER | and | AND /);
  // we also need to replace eg. escapecharacters, quotes .. and probably more
  return parts[0].replace(/\\|/g, "").replace(/"/g, "");
}

/**
 * Parse the ccl OR cql part of the query to linkme.php into something
 * that new linkme page can understand
 *
 * this one is dumb -> /linkme.php?cql=rec.id=%2803205215%20or%20810015-katalog%3A00194810%29 .. todo handle rec.id with logical operator
 *
 * @param cclOrCql
 * @returns null|string
 *   hopefully a path for the linkme page to understand OR a path to advanced search
 *   if it fail
 */
export function parseLinkme(cclOrCql) {
  if (!cclOrCql) {
    return null;
  }
  const decoded = decodeURIComponent(cclOrCql);
  // check for a faust
  const faust = faustFromQuery(cclOrCql);
  if (faust) {
    return `/linkme?faust=${faust}`;
  }
  // sometimes rec.id is behind the cclOrCql parameter
  // like /linkme.php?cql=rec.id=810015-katalog%3A00194810%29
  const params = recIdFromQuery(cclOrCql);
  if (params) {
    return `/linkme?${params}`;
  }

  // rest are searches - make an url to advanced search :)
  // split string on ' og '
  const parts = decoded.split(" og ");
  // query comes like (.*)=(.*) - that is a key (any character) and a value (any character)
  const reqexp = /(.*)=(.*)/iu;
  // we collect the queries in an array
  const queries = [];
  let matches;
  const query = {};
  // make an object to parse
  parts.forEach((part) => {
    matches = checkQueryValue(part).match(reqexp);
    if (matches) {
      let fisk = matches[1];
      let val = matches[2];
      query[fisk] = val;

      queries.push({ query });
    }
  });
  // the parseLinkmeQuery function sorts away all not supported fields
  const queryFields = parseLinkmeQuery(query);
  if (queryFields.length < 1) {
    return null;
  }
  // get a path to redirect to
  const path = fieldsToAdvancedUrl({ inputFields: queryFields });

  return path;
}

/**
 * Parse the query from linkme page - the query is a mix: ti, fo, em, tekst.
 * We only handle logical operator AND ..
 * @param query {}
 *  query object from ctx.query (see pages/linkme.js)
 */
export function parseLinkmeQuery(query) {
  const mappings = {
    fo: "creator",
    forfatter: "creator",
    em: "subject",
    emne: "subject",
    "dkcclterm.ht": "subject",
    ti: "title",
    titel: "title",
    tekst: "tekst",
    fritekst: "tekst",
    is: "isbn",
    isbn: "isbn",
    "dkcclterm.is": "isbn",
  };
  const inputFields = [];

  let operator;
  for (const [key, val] of Object.entries(query)) {
    // only handle known keys
    if (Object.keys(mappings).includes(key)) {
      operator = inputFields.length < 1 ? null : LogicalOperatorsEnum.AND;
      // val may be an array in ctx.query ({fisk:[hest,hund]})
      if (Array.isArray(val)) {
        val.forEach((v) => {
          operator = inputFields.length < 1 ? null : LogicalOperatorsEnum.AND;
          inputFields.push(
            getAdvancedSearchField({
              type: mappings[key],
              value: removeReserved(v),
              operator: operator,
            })
          );
        });
      } else {
        inputFields.push(
          getAdvancedSearchField({
            type: mappings[key],
            value: removeReserved(val),
            operator: operator,
          })
        );
      }
    }
  }

  return inputFields;
}

/**
 * Remove some characters from a string - for now we only remove '?' at the END of the string, but there are probably more
 *
 * @param str
 * @returns {*}
 */
function removeReserved(str) {
  // '?' is a masking character - that is it can replace a letter in a string
  // .. but if it is in the end of the word it fucks up complex search (for titles at least)
  // remove '?' from the end of the string
  return str.replace(/[?]$/, "");
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
