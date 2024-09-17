import { ApiEnums } from "@/lib/api/api";
import {
  coverFragment,
  creatorsFragment,
  seriesFragment,
  workSliderFragment,
} from "@/lib/api/fragments.utils";

export function universeBasicInfo({ universeId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query UniverseBasic($universeId: String!) {
      universe(universeId: $universeId) {
        universeId
        title
        description
        workTypes
      }
    }
  `,
    variables: { universeId },
    slowThreshold: 3000,
  };
}

export function universeContent({ universeId, workType, offset, limit }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query UniverseContent($universeId: String!, $workType: WorkTypeEnum, $offset: Int!, $limit: Int!) {
        universe(universeId: $universeId) {
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
    variables: { universeId, workType: workType?.toUpperCase(), offset, limit },
    slowThreshold: 3000,
  };
}

export function universesBasicInfoByWork({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query UniversesBasicInfoByWork($workId: String!) {
      work(id: $workId) {
        universes {
          key
          title
          description
          workTypes
          universeId
        }
      }
    }
  `,
    variables: { workId },
    slowThreshold: 3000,
  };
}

export function universesByWork({ workId, offset, limit }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query UniversesByWork($workId: String!, $offset: Int, $limit: Int) {
      work(id: $workId) {
        universes {
          title
          key
          universeId
          content(offset: $offset, limit: $limit) {
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
    }
    ${workSliderFragment}
    ${creatorsFragment}
    ${seriesFragment}
    ${coverFragment}
  `,
    variables: { workId, offset, limit },
    slowThreshold: 3000,
  };
}
