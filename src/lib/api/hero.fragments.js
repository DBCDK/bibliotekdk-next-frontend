/**
 * Get published hero images from backend
 *
 * @returns {{query: string}}
 */
export function frontpageHero() {
  return {
    query: `
    { 
      nodeQuery(limit: 40, filter: {conditions: [
    {field: "type", value: ["hero_frontpage"]}, 
    {field: "status", value: "1"}]}, 
    sort: [{field: "changed", direction: DESC}]) {
        entities {
          __typename
          ... on NodeHeroFrontpage {
            nid
            title
            entityPublished
            fieldHeroDescription
            fieldImage {
              alt
              title
              url
              width
              height
            }
          }
        }
      }
      monitor(name: "hero_frontpage")
    }`,
  };
}
