/**
 * @file Contains GraphQL mutation queries for AI data collection
 *
 */
import getConfig from "next/config";
import { v4 as uuidv4 } from "uuid";

const { publicRuntimeConfig } = getConfig();

// In memory anonymous session id
// Set to test if useFixedSessionId is true
const session_id = publicRuntimeConfig.useFixedSessionId ? "test" : uuidv4();

/**
 * When user searches
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function collectSearch({ search_query }) {
  return {
    query: `mutation ($input: DataCollectInput!) {
      data_collect(input: $input)
    }
    `,
    variables: {
      input: {
        search: {
          search_query,
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
  search_query,
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
          search_query,
          search_query_hit,
          search_query_work,
          session_id,
        },
      },
    },
  };
}
