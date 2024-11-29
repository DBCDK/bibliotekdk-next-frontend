/**
 * @file Contains GraphQL queries all taking 'q' as variable
 *
 */

import { ApiEnums } from "@/lib/api/api";

/**
 * Detailed search response
 *
 * @param {Object} params
 * @param {string} params.q the query string
 */
export function fast({ q, workType }) {
  workType = workType?.toUpperCase();

  return {
    apiUrl: ApiEnums.FBI_API_SIMPLESEARCH,
    // delay: 1000, // for debugging
    query: `
    query SuggestFragmentsFast($q: String!, $workType: WorkType) {
      suggest(q: $q, workType: $workType) {
        result {
          type
          term
        }
      }
      monitor(name: "bibdknext_suggest_all")
    }`,
    variables: { q, workType },
    slowThreshold: 3000,
  };
}

export function csSuggest({ q, type }) {
  //Prevent sending suggestion request when type is "isbn". There is no isbn suggestion.
  if (type === "isbn") {
    return null;
  }
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query CS_suggester ($q:String!, $type:ComplexSuggestionTypeEnum! ){
        complexSuggest(q: $q, type: $type) {
       result {
          type
          term
        }
      }
    }`,
    variables: { q, type: type?.toUpperCase() },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {Object} params
 * @param {string} params.q the query string
 */
export function all({ q, workType, suggestType = "", limit = 100000 }) {
  workType = workType?.toUpperCase();
  suggestType = suggestType?.toUpperCase();

  return {
    apiUrl: ApiEnums.FBI_API_SIMPLESEARCH,
    // delay: 1000, // for debugging
    query: `
    query SuggestFragmentsAll($q: String!, $workType: WorkTypeEnum, $limit: Int) {
      suggest(q: $q, workType: $workType, limit: $limit) {
          ...suggestResponseFragment
      }
      monitor(name: "bibdknext_suggest_all")
    }
    ${suggestResponseFragment}`,
    variables: { q, workType, suggestType, limit },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {Object} params
 * @param {string} params.q the query string
 */
export function typedSuggest({
  q,
  workType,
  suggestType = "",
  limit = 100000,
}) {
  workType = workType?.toUpperCase();
  suggestType = suggestType?.toUpperCase();
  return {
    apiUrl: ApiEnums.FBI_API_SIMPLESEARCH,
    // delay: 1000, // for debugging
    query: `
    query SuggestFragmentsTyped($q: String!, $workType: WorkTypeEnum, $suggestType: SuggestionType, $limit: Int) {
      suggest(q: $q, workType: $workType, suggestType: $suggestType, limit: $limit) {
        ...suggestResponseFragment
      }
      monitor(name: "bibdknext_suggest_typedSuggest")
    }
    ${suggestResponseFragment}`,
    variables: { q, workType, suggestType, limit },
    slowThreshold: 3000,
  };
}

const suggestResponseFragment = `fragment suggestResponseFragment on SuggestResponse {
  result {
    traceId
    type
    term
  }
}`;
