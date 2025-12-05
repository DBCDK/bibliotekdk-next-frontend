import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { SuggestTypeEnum } from "@/lib/enums";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

/**
 * Hook for q search param sync across components 🤯
 *
 * OBS! useQ hook is SWR connected and will trigger an update
 * on connected components.
 */

/**
 *
 * Settings
 *
 *
 */

// Global state
let locale = {};

// Global useQ hook initialization
let initialized = false;

// Custom fetcher
const fetcher = () => locale;

// current supported filter types
export const types = [
  SuggestTypeEnum.ALL,
  SuggestTypeEnum.CREATOR,
  SuggestTypeEnum.SUBJECT,
  SuggestTypeEnum.TITLE,
];

/**
 * function to build the default (empty) q object
 *
 * @returns {Object}
 */

function buildQ() {
  // not set empty q types as default base for now
  const params = {};
  types.forEach((type) => (params[type] = ""));
  return params;
}

/**
 * Get all q types from query params
 *
 *
 * @returns {Object}
 *
 * @param query
 */
export const getQuery = (query = {}) => {
  const urlSearchParams = new URLSearchParams(query);

  const params = {};
  urlSearchParams.forEach((val, key) => {
    // remove empty key values
    if (val && val !== "") {
      // check if key actually is a q. param
      // filters also have a "creator" and "subject" param
      if (key.includes("q.")) {
        // The old q param will be converted to the new q.all (old hyperlinks to site e.g.)
        // Will not convert if a q.all already exist in query
        if (key === "q" && !query["q.all"]) {
          key = "q.all";
        }
        // strip q keys to match types
        key = key.replace("q.", "");
        if (types.includes(key) && val) {
          params[key] = val;
        }
      }
    }
  });

  return params;
};

/**
 * useQ hook
 *
 * @returns {Object}
 *
 * q
 * setQ
 * clearQ
 * setQuery
 * getQuery
 * hasQuery
 * types
 *
 */

function useQ() {
  // router
  const router = useRouter();

  // SWR
  const { data: _q, mutate: _setQ } = useSWR("q", fetcher, {
    initialData: {},
  });

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
      _setQ(locale);
    }
  }, [router.query]);

  /**
   * Update the locale q
   *
   * @param {Object} include
   *
   */
  const setQ = (include = {}) => {
    const params = {};
    Object.entries(include).forEach(([key, val]) => {
      // remove empty key values
      if (val && val !== "") {
        // strip q keys to match types
        key = key.replace("q.", "");
        if (types.includes(key)) {
          params[key] = val;
        }
      }
    });

    // set locale object
    locale = { ...params };

    // update locale state (swr)
    _setQ(locale);
  };

  /**
   * Clear the locale q
   *
   * @param {Object} exclude
   *
   */
  const clearQ = ({ exclude = [] }) => {
    const copy = { ..._q };
    // Remove all types from q (except excluded)
    types.forEach((type) => {
      if (!exclude.includes(type)) {
        delete copy[type];
      }
    });
    // update q by setQ func
    setQ(copy);
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
   * Set q types in query params
   *
   * @param {Object} include
   * @param {Array} exclude
   * @param pathname
   * @param query
   * @param method
   */

  const setQuery = ({
    include = _q,
    exclude = [],
    pathname,
    query = { ...router.query },
    method = "push",
  }) => {
    // include all q types (empty types)
    const base = buildQ();

    include = { ...base, ...include };

    const params = {};
    // include
    Object.entries(include).forEach(([key, val]) => {
      if (types.includes(key)) {
        params[`q.${key}`] = val;
      }
    });

    // query params
    // const query = { ...router.query };

    // merge current query params and new filters
    const merged = { ...query, ...params };

    // remove empty params
    Object.entries(merged).forEach(([key, val]) => {
      if (!val || val === "") {
        delete merged[key];
      }
    });

    // exclude tags from query
    exclude.forEach((param) => delete merged[param]);

    // update router
    router &&
      router[method](
        {
          pathname: pathname || router.pathname,
          query: !isEmpty(merged) ? merged : { "q.all": "" },
        },
        undefined,
        { scroll: router.pathname !== "/find/simpel" }
      );
  };

  /**
   * Count active q params in query
   *
   * @param exclude params
   *
   * @returns {number}
   */
  function getCount({ exclude = [] }) {
    const q = _getQuery();

    let count = 0;
    Object.entries(q).map((entry) => {
      // exluded keys
      if (!exclude.includes(entry[0])) {
        // if there is an actual value
        count++;
      }
    });

    return count;
  }

  /**
   * isSynced returns true if url and q is syncronized
   *
   *
   * @returns {boolean}
   */
  function _isSynced() {
    const remote = _getQuery();
    const locale = _q || {};
    return isEqual(remote, locale);
  }

  /**
   * Boolean to check if q contains a value
   */
  const obj = _getQuery();

  const _hasQuery = Boolean(
    obj[SuggestTypeEnum.ALL] ||
      obj[SuggestTypeEnum.CREATOR] ||
      obj[SuggestTypeEnum.TITLE] ||
      obj[SuggestTypeEnum.SUBJECT]
  );

  const _mode = router?.query?.mode || "simpel";

  return {
    // functions
    setQ,
    clearQ,
    getQuery: _getQuery,
    setQuery,
    getCount,
    isSynced: _isSynced,
    // constants
    q: _q || {},
    mode: _mode,
    hasQuery: _hasQuery,
    types,
    base: buildQ(),
  };
}

export default useQ;
