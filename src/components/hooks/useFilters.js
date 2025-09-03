/**
 * Hook for filter sync across components 🤯
 *
 * OBS! useFilters hook is SWR connected and will trigger an update
 * on connected components.
 */

import { useEffect } from "react";
import { useRouter } from "next/router";
import isEqual from "lodash/isEqual";

import useSWR from "swr";
import { FilterTypeEnum } from "@/lib/enums";

const URL_FACET_DELIMITER = ",";
const DELIMITER_ENCODING = "__";

const URL_FACET_DELIMITER_REGEX = new RegExp(URL_FACET_DELIMITER, "g");
const DELIMITER_ENCODING_REGEX = new RegExp(DELIMITER_ENCODING, "g");

/**
 *
 * Settings
 *
 *
 */

// Global state
let locale = {};

// Global useFilters hook initialization
let initialized = false;

// Custom fetcher
const fetcher = () => locale;

/**
 *
 *
 *
 *
 */

/**
 * function to build the default (empty) filters object
 *
 * @returns {Object}
 */

export function buildFilters() {
  const params = {};
  types.forEach((type) => (params[type] = []));
  return params;
}

/**
 * Get filters from query params
 *
 * @param {Object} query (defaults to router.query)
 *
 * @returns {Object}
 *
 */
export function getQuery(query) {
  const base = buildFilters();

  const filters = {};
  Object.entries(query).forEach(([key, val]) => {
    if (types.includes(key) && val) {
      let realVal =
        typeof val === "string" ? val.split(URL_FACET_DELIMITER) : val;
      filters[key] =
        realVal &&
        realVal.map((v) =>
          v.replace(DELIMITER_ENCODING_REGEX, URL_FACET_DELIMITER)
        );
    }
  });

  return { ...base, ...filters };
}

/**
 * useFilters hook
 *
 * @returns {Object}
 *
 * filters
 * setFilters
 * getQuery
 * setQuery
 * getCount
 * types
 * workTypes
 *
 */

export default function useFilters() {
  // router
  const router = useRouter();

  // SWR
  const { data: _filters, mutate: _setFilters } = useSWR("filters", fetcher, {
    initialData: buildFilters(),
  });

  // represent all filters: All type names as key and empty array as value
  const base = buildFilters();

  /**
   * Restore filters and query from query params
   */
  useEffect(() => {
    const q = _getQuery();
    const initQuery = JSON.stringify(q);
    if (initialized !== initQuery) {
      // set initialized to initQuery, this prevents multiple mount call (multiple instances of hook)
      initialized = initQuery;
      // set locale object
      locale = q;
      // update locale state (swr)
      _setFilters(locale);
    }
  }, [router.query]);

  /**
   * Update locale filters
   *
   * @param {Object} include
   *
   */
  const setFilters = (include = {}) => {
    const params = {};
    Object.entries(include).forEach(([key, val]) => {
      if (types.includes(key)) {
        params[key] = val;
      }
    });

    // set locale object
    locale = { ...base, ...params };

    // update locale state (swr)
    _setFilters(locale);
  };

  /**
   * Set/unset a single filter.
   * @param {} filter
   *  the filter to update - comes in the form
   *    {
   *     "checked": true,
   *     "value": {
   *         "term": "film (dvd)",
   *         "key": "film (dvd)",
   *         "score": 45
   *     },
   *     "facetName": "materialTypesSpecific"
   * }
   */
  const setFilter = (filter) => {
    if (!filter.checked) {
      _removeAFilter(filter, filter?.value?.term);
    } else {
      _addAFilter(filter);
    }
  };

  const _addAFilter = (filter) => {
    const name = filter?.facetName;
    const actual = _filters[name];
    actual?.push(filter?.value?.term);
  };

  const _removeAFilter = (filter, term) => {
    const name = filter?.facetName;
    const actual = [..._filters[name]] || null;

    // delete in array
    const index = actual?.findIndex((act) => act === term);
    if (index > -1) {
      actual?.splice(index, 1);
      _filters[name] = actual;
    }
  };

  /**
   * Get filters from query params
   *
   * @param {Object} query (defaults to router.query)
   *
   * @returns {Object}
   *
   */
  const _getQuery = (query = router.query) => getQuery(query);

  /**
   * Set filters in query params
   *
   * @param {Object} include
   * @param {Array} exclude
   */
  const setQuery = ({ include = _filters, exclude = [] }) => {
    /**
     * ensure all filters is represented, if not, the router update
     * can get messed up by not removing all non-represented filters.
     */
    include = { ...base, ...include };

    const params = {};
    // include
    Object.entries(include).forEach(([key, val]) => {
      if (types.includes(key)) {
        params[key] = val
          .map((v) => v.replace(URL_FACET_DELIMITER_REGEX, DELIMITER_ENCODING))
          .join(URL_FACET_DELIMITER);
      }
    });

    // query params
    const query = { ...router.query };

    // merge current query params and new filters
    const merged = { ...query, ...params };

    // remove empty params
    Object.entries(merged).forEach(([key, val]) => {
      if (val === "") {
        delete merged[key];
      }
    });

    // exclude tags from query
    exclude.forEach((param) => delete merged[param]);

    // update router
    router &&
      router.push(
        {
          pathname: router.pathname,
          query: merged,
        },
        undefined,
        { scroll: router.pathname !== "/find" }
      );
  };

  /**
   * Serialiser AKTUELLE filtre (_filters) til URL-parametre.
   * - Samme regler som setQuery bruger ("," join + "__" escape)
   * - excludeKeys: spring nøgler over (fx "workTypes", hvis du sætter den separat)
   * - includeEmpty: sæt tomme arrays som "" (så setQuery kan slette param)
   */
  const _serialize = ({ excludeKeys = [], includeEmpty = false } = {}) => {
    const src = _filters || {};
    const out = {};

    Object.entries(src).forEach(([key, arr]) => {
      // kun kendte filter-keys
      if (!types.includes(key)) return;
      if (excludeKeys.includes(key)) return;

      const list = Array.isArray(arr) ? arr : [];

      if (list.length === 0) {
        if (includeEmpty) out[key] = "";
        return;
      }

      out[key] = list
        .map((v) =>
          String(v).replace(URL_FACET_DELIMITER_REGEX, DELIMITER_ENCODING)
        )
        .join(URL_FACET_DELIMITER);
    });

    return out;
  };

  /**
   * Count active filters in query (!OBS: Query filters only)
   *
   * @param exclude params
   *
   * @returns {number}
   */
  function getCount(exclude = []) {
    const filters = _getQuery();

    let count = 0;
    Object.entries(filters).map(([key, value]) => {
      // exluded keys
      if (!exclude.includes(key)) {
        // if there is an actual value
        if (value.length > 0) {
          value.forEach(() => count++);
        }
      }
    });

    return count;
  }

  /**
   * hasChanged returns true if url and filters is different (out of sync)
   *
   *
   * @returns {boolean}
   */
  function _isSynced() {
    const remote = _getQuery();
    const locale = _filters || {};
    return isEqual(remote, locale);
  }

  return {
    filters: _filters || {},
    setFilter,
    setFilters,
    getQuery: _getQuery,
    setQuery,
    getCount,
    isSynced: _isSynced(),
    types,
    workTypes,
    serialize: _serialize,
  };
}

const types = Object.values(FilterTypeEnum);

// Visible Worktypes for work type selections
export const workTypes = [
  "literature",
  "article",
  "movie",
  "music",
  "game",
  "sheetmusic",
];

// Included categories/facets by selected workType
// This list works as a sorted whitelist
export const includedTypes = {
  literature: [
    FilterTypeEnum.ACCESS_TYPES,
    FilterTypeEnum.CHILDREN_OR_ADULTS,
    FilterTypeEnum.CREATORS,
    FilterTypeEnum.FICTION_NONFICTION,
    FilterTypeEnum.FICTIONAL_CHARACTERS,
    FilterTypeEnum.GENRE_AND_FORM,
    FilterTypeEnum.MAIN_LANGUAGES,
    FilterTypeEnum.MATERIAL_TYPES,
    FilterTypeEnum.SUBJECTS,
  ],
  article: [
    FilterTypeEnum.ACCESS_TYPES,
    FilterTypeEnum.CREATORS,
    FilterTypeEnum.MAIN_LANGUAGES,
    FilterTypeEnum.MATERIAL_TYPES,
    FilterTypeEnum.SUBJECTS,
  ],
  movie: [
    FilterTypeEnum.ACCESS_TYPES,
    FilterTypeEnum.CHILDREN_OR_ADULTS,
    FilterTypeEnum.CREATORS,
    FilterTypeEnum.FICTIONAL_CHARACTERS,
    FilterTypeEnum.GENRE_AND_FORM,
    FilterTypeEnum.MAIN_LANGUAGES,
    FilterTypeEnum.MATERIAL_TYPES,
    FilterTypeEnum.SUBJECTS,
  ],
  game: [
    FilterTypeEnum.ACCESS_TYPES,
    FilterTypeEnum.CHILDREN_OR_ADULTS,
    FilterTypeEnum.FICTIONAL_CHARACTERS,
    FilterTypeEnum.GENRE_AND_FORM,
    FilterTypeEnum.MATERIAL_TYPES,
  ],
  music: [
    FilterTypeEnum.ACCESS_TYPES,
    FilterTypeEnum.CHILDREN_OR_ADULTS,
    FilterTypeEnum.CREATORS,
    FilterTypeEnum.GENRE_AND_FORM,
    FilterTypeEnum.MATERIAL_TYPES,
  ],
  sheetmusic: [
    FilterTypeEnum.ACCESS_TYPES,
    FilterTypeEnum.CREATORS,
    FilterTypeEnum.GENRE_AND_FORM,
    FilterTypeEnum.MATERIAL_TYPES,
    FilterTypeEnum.SUBJECTS,
  ],
};
