/**
 * @file
 * This is an example component showing
 * how to fetch data from the API
 *
 * Should be removed when we have real components
 * doing the same thing
 */

import { useData } from "../../lib/api";

/**
 * This function will create a query object
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
function query({ workId }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($workId: String!) {
    manifestation(pid: $workId) {
      title
      abstract
    }
  }
  `,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/* Renders an example component */
export function Example({ title, abstract }) {
  return (
    <div>
      <h1>{title}</h1>
      <div>{abstract}</div>
    </div>
  );
}

/* Renders an example skeleton component */
export function ExampleSkeleton({ isSlow }) {
  return (
    <div>
      <h1>{isSlow ? "Indlæser - gaaaab" : "Indlæser"}</h1>
    </div>
  );
}

/* Renders an example error component */
export function ExampleError() {
  return (
    <div>
      <h1>Der skete en fejl</h1>
    </div>
  );
}
/* Fetches data and renders variants of the Example component*/
function Container({ workId }) {
  // use the useData hook to fetch data
  const { data, isLoading, isSlow, error } = useData(query({ workId }));

  if (isLoading) {
    return <ExampleSkeleton isSlow={isSlow} />;
  }
  if (error) {
    return <ExampleError />;
  }

  return <Example {...data.manifestation} />;
}

// Attach query to container to expose the query to some page
Container.query = query;

// Export container as the default
export default Container;
