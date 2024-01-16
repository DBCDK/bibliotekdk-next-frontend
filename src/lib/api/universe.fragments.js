import { ApiEnums } from "@/lib/api/api";
import {
  coverFragment,
  creatorsFragment,
  seriesFragment,
  universeFragment,
  workSliderFragment,
} from "@/lib/api/fragments.utils";

export function universeBasicInfo({ key }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query UniverseBasic($key: String!) {
      universe(key: $key) {
        title
        description
        workTypes
      }
    }
  `,
    variables: { key },
    slowThreshold: 3000,
  };
}

export function universeContent({ key, workType, offset, limit }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query UniverseContent($key: String!, $workType: WorkType, $offset: Int!, $limit: Int!) {
        universe(key: $key) {
          content(workType: $workType, offset: $offset, limit: $limit) {
            hitcount
            entries {
              __typename
              ... on Work {
                ...workSliderFragment
                manifestations {
                  mostRelevant {
                    ...coverFragment
                  }
                }
                creators {
                  ...creatorsFragment
                }
              }
              ... on Series {
                ...seriesFragment
                members(offset: 0, limit: 3) {
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
                  }
                  numberInSeries
                  readThisFirst
                  readThisWhenever
                }
              }
            }
          }
        }
    }
    ${workSliderFragment}
    ${creatorsFragment}
    ${seriesFragment}
    ${coverFragment}
  `,
    variables: { key, workType: workType?.toUpperCase(), offset, limit },
    slowThreshold: 3000,
  };
}

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
