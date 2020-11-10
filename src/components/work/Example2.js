/**
 * @file
 * This is an example component showing
 * how to fetch data from the API
 *
 * see Example.js for more documentation
 */

import { useData } from "@/lib/api";
import Link from "next/link";
import { encodeTitleCreator } from "@/lib/utils";

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
    // delay: 4000, // for debugging
    query: `query ($workId: String!) {
    manifestation(pid: $workId) {
      recommendations {
        manifestation {
          pid
          title
          creators {
            name
          }
        }
      }
    }
  }
  `,
    variables: { workId },
    slowThreshold: 2000,
  };
}

/**
 * Example component, showing work recommendations
 *
 * @param {Object} props Component props
 * @param {Object[]} props.recommendations Array of recommendations
 */
export function Example2({ recommendations }) {
  return (
    <div>
      <h2>Anbefalinger</h2>
      <div>
        {recommendations.map(({ manifestation }) => (
          <div key={manifestation.title[0]}>
            <Link
              href="/materiale/[title_author]/[workId]"
              as={`/materiale/${encodeURIComponent(
                encodeTitleCreator(
                  manifestation.title[0],
                  manifestation.creators[0] && manifestation.creators[0].name
                )
              )}/${manifestation.pid}`}
            >
              {manifestation.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example skeleton component
 *
 * @param {Object} props Component props
 * @param {boolean} props.isSlow Is it unexpectingly slow to load?
 */
export function Example2Skeleton({ isSlow }) {
  return (
    <div style={isSlow && { color: "red" }}>
      <h2>Indlæser anbefalinger</h2>
    </div>
  );
}

/**
 * Example error component
 */
export function Example2Error() {
  return (
    <div>
      <h2>Der skete en fejl</h2>
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
  const { data, isLoading, isSlow, error } = useData(query({ workId }));
  if (isLoading) {
    return <Example2Skeleton isSlow={isSlow} />;
  }
  if (error) {
    return <Example2Error />;
  }
  return <Example2 {...data.manifestation} />;
}
Container.query = query;

export default Container;
