import { ApiEnums } from "@/lib/api/api";
import {
  coverFragment,
  creatorsFragment,
  seriesFragment,
  universeFragment,
  workSliderFragment,
} from "@/lib/api/fragments.utils";

export function universes({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query Universes($workId: String!) {
      work(id: $workId) {
        universes {
          ...universeFragment
          works {
            ...workSliderFragment
            manifestations {
              mostRelevant {
                ...coverFragment
              }
            }
            creators {
              ...creatorsFragment
            }
            universe {
              ...universeFragment
            }
            universes {
              ...universeFragment
            }
          }
          series {
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
                universe {
                  ...universeFragment
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
