/**
 * @file
 * This file contain storybook stories for using the API.
 * The stories are used for testing the useData hook
 * is working as expected.
 */

import React from "react";
import { useData } from "@/lib/api/api";

export default {
  title: "useAPI",
};

/**
 * A function that creates queries for our stories
 *
 * @param {Object} variables
 * @param {string} variables.workId
 * @param {number} variables.delay
 * @param {number} variables.slowThreshold
 *
 * @return {Object} a query object
 */
function query({ workId, delay, slowThreshold }) {
  return {
    delay,
    query: `query ($workId: String!) {
    manifestation(pid: $workId) {
      title
    }
  }
  `,
    variables: { workId },
    slowThreshold,
  };
}

/**
 * A storybook component that shows the different
 * load states a useData request can be in.
 */
export const FetchingData = () => {
  const workId = "870970-basis:51883322"; // Doppler
  const { data, isLoading, isSlow } = useData(
    query({ workId, delay: 1000, slowThreshold: 500 })
  );

  return (
    <div>
      {isLoading && <h1>loader</h1>}
      {isSlow && <h1>langsomt</h1>}
      {data && <h1>{data.manifestation.title}</h1>}
    </div>
  );
};

/**
 * A storybook component that shows that useData
 * returns an error, when workId does not exist
 */
export const ErrorFetchingData = () => {
  const workId = "this-is-not-a-work-id";
  const { error } = useData(query({ workId }));
  return <div>{error && <h1>error</h1>}</div>;
};

/**
 * A storybook component that renders the inner state
 * of the API client
 */
export const ExposingClientState_noDoubletEntries = () => {
  const workId1 = "870970-basis:51883322"; // Doppler
  const query1 = useData(query({ workId: workId1 }));
  const query2 = useData(query({ workId: workId1 })); // same as query1

  if (query1.isLoading || query2.isLoading) {
    return <div />;
  }

  return (
    <div data-cy="client-state">{JSON.stringify(query1.client.getState())}</div>
  );
};

/**
 * A storybook component that renders the inner state
 * of the API client
 */
export const ExposingClientState_multipleEntries = () => {
  const workId1 = "870970-basis:51883322"; // Doppler
  const workId2 = "870970-basis:46578295"; // Egne rækker
  const query1 = useData(query({ workId: workId1 }));
  const query2 = useData(query({ workId: workId2 }));
  if (query1.isLoading || query2.isLoading) {
    return <div />;
  }

  return (
    <div data-cy="client-state">{JSON.stringify(query1.client.getState())}</div>
  );
};

/**
 * A storybook component that renders the inner state
 * of the API client
 */
export const ExposingClientState_withError = () => {
  const query1 = useData(query({})); // no variables given - error
  if (query1.isLoading) {
    return <div />;
  }

  return (
    <div data-cy="client-state">{JSON.stringify(query1.client.getState())}</div>
  );
};
