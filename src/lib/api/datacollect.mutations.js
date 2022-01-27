/**
 * @file Contains GraphQL mutation queries for AI data collection
 *
 */
import getConfig from "next/config";
import { v4 as uuidv4 } from "uuid";

const config = getConfig();

// In memory anonymous session id
// Set to test if useFixedSessionId is true
const session_id = config?.publicRuntimeConfig?.useFixedSessionId
  ? "test"
  : uuidv4();

/**
 * When user clicks recommendation
 *
 * @param {object} params
 * @param {string} params.query
 * @param {array} params.suggestions
 */
export function collectRecommenderClick({
  recommender_based_on,
  recommender_click_hit,
  recommender_click_work,
  recommender_click_reader,
  recommender_shown_recommendations,
}) {
  return {
    query: `mutation ($input: DataCollectInput!) {
      data_collect(input: $input)
    }
    `,
    variables: {
      input: {
        recommender_click: {
          recommender_based_on,
          recommender_click_hit,
          recommender_click_work,
          recommender_click_reader,
          recommender_shown_recommendations,
          session_id,
        },
      },
    },
  };
}

/**
 * When user gets suggestions
 *
 * @param {object} params
 * @param {string} params.query
 * @param {array} params.suggestions
 */
export function collectSuggestPresented({ query, suggestions }) {
  return {
    query: `mutation ($input: DataCollectInput!) {
      data_collect(input: $input)
    }
    `,
    variables: {
      input: {
        suggest_presented: {
          suggest_query: query,
          suggest_query_request_types: ["subject", "creator", "work"],
          suggest_query_results: suggestions.map((suggestion) => ({
            type: suggestion.__typename.toLowerCase(),
            value: suggestion.value || suggestion.name || suggestion.id,
          })),
          session_id,
        },
      },
    },
  };
}

/**
 * When user selects suggestion
 *
 * @param {object} params
 * @param {string} params.query
 * @param {array} params.suggestions
 * @param {number} suggest_query_hit.suggestions
 */
export function collectSuggestClick({ query, suggestion, suggest_query_hit }) {
  return {
    query: `mutation ($input: DataCollectInput!) {
      data_collect(input: $input)
    }
    `,
    variables: {
      input: {
        suggest_click: {
          suggest_query: query,
          suggest_query_hit,
          suggest_query_request_types: ["subject", "creator", "work"],
          suggest_query_result: {
            type: suggestion.__typename.toLowerCase(),
            value: suggestion.value || suggestion.name || suggestion.id,
          },
          session_id,
        },
      },
    },
  };
}

/**
 * When user searches
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function collectSearch({ search_request }) {
  return {
    query: `mutation ($input: DataCollectInput!) {
      data_collect(input: $input)
    }
    `,
    variables: {
      input: {
        search: {
          search_request,
          session_id,
        },
      },
    },
  };
}

/**
 * When user searches and then clicks on work
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function collectSearchWorkClick({
  search_request,
  search_query_hit,
  search_query_work,
}) {
  return {
    query: `mutation ($input: DataCollectInput!) {
      data_collect(input: $input)
    }
    `,
    variables: {
      input: {
        search_work: {
          search_request,
          search_query_hit,
          search_query_work,
          session_id,
        },
      },
    },
  };
}
