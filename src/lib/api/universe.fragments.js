import { ApiEnums } from "@/lib/api/api";
import {
  coverFragment,
  creatorsFragment,
  seriesFragment,
  universeFragment,
  workSliderFragment,
} from "@/lib/api/fragments.utils";
import isEmpty from "lodash/isEmpty";

export function getLimitOffset(limit, offset) {
  const limitOffsetChecked = [limit, offset]
    .filter(([key, value]) => key && typeof value === "number")
    .map(([key, value]) => `${key}: ${value}`);

  return !isEmpty(limitOffsetChecked)
    ? "(" + limitOffsetChecked.join(", ") + ")"
    : "";
}

/**
 *
 * @param workId
 * @param {number|null} seriesLimit
 * @param {number|null} seriesOffset
 * @param {number|null} worksLimit
 * @param {number|null} worksOffset
 * @returns {{variables: {workId}, apiUrl: string, slowThreshold: number, query: string}}
 */
export function universes({
  workId,
  seriesLimit = null,
  seriesOffset = null,
  worksLimit = null,
  worksOffset = null,
}) {
  const seriesLimitOffset = getLimitOffset(
    ["limit", seriesLimit],
    ["offset", seriesOffset]
  );
  const worksLimitOffset = getLimitOffset(
    ["limit", worksLimit],
    ["offset", worksOffset]
  );

  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query Universes($workId: String!) {
      work(id: $workId) {
        universes {
          ...universeFragment
          works${worksLimitOffset} {
            ...workSliderFragment
            manifestations {
              mostRelevant {
                ...coverFragment
              }
            }
            creators {
              ...creatorsFragment
            }
            universes {
              ...universeFragment
            }
          }
          series${seriesLimitOffset} {
            ...seriesFragment
            members {
              work {
                ...workSliderFragment
                manifestations {
                  mostRelevant {
                    ...coverFragment
                  }
                }
                creators {
                  ...creatorsFragment
                }
                universes {
                  ...universeFragment
                }
              }
              numberInSeries
              readThisFirst
              readThisWhenever
            }
          }
        }
      }
    }
    ${workSliderFragment}
    ${creatorsFragment}
    ${seriesFragment}
    ${universeFragment}
    ${coverFragment}
  `,
    variables: { workId },
    slowThreshold: 3000,
  };
}
