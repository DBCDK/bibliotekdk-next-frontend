import { ApiEnums } from "@/lib/api/api";
import {
  coverFragment,
  creatorsFragment,
  seriesFragment,
  universeFragment,
  workSliderFragment,
} from "@/lib/api/fragments.utils";

export function universesLight({ workId, worksLimit, seriesLimit }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query Universes($workId: String!, $worksLimit: Int, $seriesLimit: Int) {
      work(id: $workId) {
        universes {
          ...universeFragment
          works(limit: $worksLimit) {
            universes {
              ...universeFragment
            }
          }
          series(limit:$seriesLimit) {
            ...seriesFragment
            members {
              work {
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
    ${seriesFragment}
    ${universeFragment}
  `,
    variables: { workId, worksLimit, seriesLimit },
    slowThreshold: 3000,
  };
}

export function universes({ workId, worksLimit, seriesLimit }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query Universes($workId: String!, $worksLimit: Int, $seriesLimit: Int) {
      work(id: $workId) {
        universes {
          ...universeFragment
          works(limit: $worksLimit) {
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
          series(limit:$seriesLimit) {
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
    variables: { workId, worksLimit, seriesLimit },
    slowThreshold: 3000,
  };
}
