/**
 * Get published hero images from backend
 *
 * @returns {{query: string}}
 */
import { ApiEnums } from "@/lib/api/api";

export function frontpageHero() {
  return {
    apiUrl: ApiEnums.FBI_API,
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
