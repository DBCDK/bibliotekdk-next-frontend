import { ApiEnums } from "@/lib/api/api";

/**
 * Get all works for a single periodiccissue
 * @param id
 * @returns {{apiUrl: string, query: string, variables: {id}, slowThreshold: number}}
 * @constructor
 */
export function PeriodicaIssuByWork({ id }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query WorkIdToIssn($id: String!) {
      work(id: $id) {
        titles {
          full
        }
        materialTypes {
          materialTypeSpecific {
            code
          }
        }
        periodicaInfo {
          similarArticles {
            work {
              workId
              latestPublicationDate
              titles {
                full
              }
              creators {
                display
              }
              manifestations {
                mostRelevant {
                  cover {
                    detail
                  }
                  hostPublication {
                    issue
                  }
                }
              }
            }
          }
          parent {
            workId
            titles {
              main
              full
            }
            manifestations {
              bestRepresentation {
                publisher
                cover {
                  detail
                }
              }
            }
            periodicaInfo {
              periodica {
                subjects {
                  entries {
                    term
                  }
                }
              }
            }
          }
          issue {
            display
            works {
              workId
              manifestations {
                all {
                  pid
                  hostPublication {
                    title
                    issue
                  }
                  titles {
                    full
                  }
                  creators {
                    display
                  }
                  abstract
                  subjects {
                    dbcVerified {
                      display
                    }
                  }
                  physicalDescription {
                    summaryFull
                  }
                  edition {
                    publicationYear {
                      year
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    variables: { id },
    slowThreshold: 3000,
  };
}

/**
 * Get ALL works for ALL issues (limeted by issue- and work-linmit
 * @param id
 * @param issuesLimit
 * @param worksLimit
 * @returns {{apiUrl: string, query: string, variables: {id, issuesLimit, worksLimit}, slowThreshold: number}}
 * @constructor
 */
export function AllPeriodicaIssuesByworkId({ id, issuesLimit, worksLimit }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query GetPeriodicaByWork($id: String!, $issuesLimit: Int!, $worksLimit: Int!) {
      work(id: $id) {
        titles {
          full
          main
        }
        periodicaInfo {
          periodica {
            issues {
              hitcount
              entries(limit: $issuesLimit) {
                display
                works(limit: $worksLimit) {
                  workId
                  materialTypes {
                    materialTypeSpecific {
                      code
                    }
                  }
                  manifestations {
                    all {
                      pid
                      hostPublication {
                        title
                        issue
                      }
                      titles {
                        full
                      }
                      creators {
                        display
                      }
                      abstract
                      subjects {
                        dbcVerified {
                          display
                        }
                      }
                      physicalDescription {
                        summaryFull
                      }
                      edition {
                        publicationYear {
                          year
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    `,
    variables: { id, issuesLimit, worksLimit },
    slowThreshold: 3000,
  };
}
