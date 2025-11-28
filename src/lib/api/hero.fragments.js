/**
 * Get published hero images from backend
 *
 * @returns {{query: string}}
 */
import { ApiEnums } from "@/lib/api/api";

export function frontpageHero() {
  const filter = {
    conditions: [
      { field: "type", value: ["hero_frontpage"] },
      { field: "status", value: "1" },
    ],
  };
  const sort = [{ field: "changed", direction: "DESC" }];

  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query ($filter: EntityQueryFilterInput, $sort: [EntityQuerySortInput]) {
      nodeQuery(limit: 75, filter: $filter, sort: $sort) {
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
    variables: { filter, sort },
    slowThreshold: 3000,
  };
}
