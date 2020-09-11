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

/**
 * Example component, showing basic info
 *
 * @param {Object} props Component props
 * @param {string} props.title Material title
 * @param {string} props.abstract Material abstract
 */
export function Example({ title, abstract }) {
  return (
    <div>
      <h1>{title}</h1>
      <div>{abstract}</div>
    </div>
  );
}

/**
 * Example skeleton component
 *
 * @param {Object} props Component props
 * @param {boolean} props.isSlow Is it unexpectingly slow to load?
 */
export function ExampleSkeleton({ isSlow }) {
  return (
    <div>
      <h1>{isSlow ? "Indlæser - gaaaab" : "Indlæser"}</h1>
    </div>
  );
}

/**
 * Example error component
 */
export function ExampleError() {
  return (
    <div>
      <h1>Der skete en fejl</h1>
    </div>
  );
}

/**
 * Container is a react component responsible for loading
 * data and displaying the right variant of the Example component
 *
 * @param {Object} props Component props
 * @param {string} props.workId Material work id
 */
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
