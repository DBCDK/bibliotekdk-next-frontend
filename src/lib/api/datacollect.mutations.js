/**
 * @file Contains GraphQL mutation queries for AI data collection
 *
 */
import getConfig from "next/config";
import { v4 as uuidv4 } from "uuid";
import { SuggestTypeEnum } from "@/lib/enums";
import { ApiEnums } from "@/lib/api/api";

const config = getConfig();

// In memory anonymous session id
// Set to test if useFixedSessionId is true
const session_id = config?.publicRuntimeConfig?.useFixedSessionId
  ? "test"
  : uuidv4();

/**
 * When user clicks recommendation
 *
 * @param {Object} params
 */
export function collectRecommenderClick({
  recommender_based_on,
  recommender_click_hit,
  recommender_click_work,
  recommender_click_reader,
  recommender_shown_recommendations,
}) {
  return {
    apiUrl: ApiEnums.FBI_API,
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
 * @param {Object} params
 * @param {string} params.query
 * @param {Array} params.suggestions
 */
export function collectSuggestPresented({ query, suggestions }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `mutation ($input: DataCollectInput!) {
      data_collect(input: $input)
    }
    `,
    variables: {
      input: {
        suggest_presented: {
          suggest_query: query,
          suggest_query_request_types: [
            SuggestTypeEnum.SUBJECT,
            SuggestTypeEnum.CREATOR,
            SuggestTypeEnum.TITLE,
          ],
          suggest_query_results: suggestions.map((suggestion) => ({
            type: suggestion.type,
            value: suggestion.term,
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
 * @param {Object} params
 * @param {string} params.query
 * @param {Array} params.suggestion
 * @param {number} suggest_query_hit.suggestions
 */
export function collectSuggestClick({ query, suggestion, suggest_query_hit }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `mutation ($input: DataCollectInput!) {
      data_collect(input: $input)
    }
    `,
    variables: {
      input: {
        suggest_click: {
          suggest_query: query,
          suggest_query_hit,
          suggest_query_request_types: [
            SuggestTypeEnum.SUBJECT,
            SuggestTypeEnum.CREATOR,
            SuggestTypeEnum.TITLE,
          ],
          suggest_query_result: {
            type: suggestion.type.toLowerCase(),
            value: suggestion.term,
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
 * @param {Object} params
 * @param params.search_request
 */
export function collectSearch({
  search_request,
  search_response_works,
  search_offset,
}) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `mutation ($input: DataCollectInput!) {
      data_collect(input: $input)
    }
    `,
    variables: {
      input: {
        search: {
          search_request,
          search_response_works,
          search_offset,
          session_id,
        },
      },
    },
  };
}

/**
 * When user searches and then clicks on work
 *
 * @param {Object} params
 * @param params.search_request
 * @param params.search_query_hit
 * @param params.search_query_work
 */
export function collectSearchWorkClick({
  search_request,
  search_query_hit,
  search_query_work,
}) {
  return {
    apiUrl: ApiEnums.FBI_API,
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

/**
 * When user post search feedback
 *
 * @param thumbs thumbsup or thumbsdown
 * @param query current searchquery
 * @param reason only form thumbsdown - what can we improve
 * @returns {{variables: {input: {search_feedback: {reason, query, thumbs}}}, query: string}}
 */
export function collectSearchFeedback({ thumbs, query, reason }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `mutation ($input: DataCollectInput!) {
      data_collect(input: $input)
    }
    `,
    variables: {
      input: {
        search_feedback: {
          thumbs,
          query,
          reason,
        },
      },
    },
  };
}
