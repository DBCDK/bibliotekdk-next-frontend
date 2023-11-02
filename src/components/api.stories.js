/**
 * @file
 * This file contain storybook stories for using the API.
 * The stories are used for testing the useData hook
 * is working as expected.
 */

import React from "react";
import { useData } from "@/lib/api/api";

const exportedObject = {
  title: "hooks/useData",
};

export default exportedObject;

/**
 * A function that creates queries for our stories
 *
 * @param {Object} variables
 * @param {string} variables.workId
 * @param {number} variables.delay
 * @param {number} variables.slowThreshold
 *
 * @returns {Object} a query object
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
