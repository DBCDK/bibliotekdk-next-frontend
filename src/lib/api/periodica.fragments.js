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
        extendedWork {
          ... on PeriodicalArticle {
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
            parentPeriodical {
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
              extendedWork {
                ... on Periodical {
                  issues {
                    subjects {
                      entries {
                        term
                      }
                    }
                  }
                }
              }
            }
            parentIssue {
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
      }
    }`,
    variables: { id },
    slowThreshold: 3000,
  };
}

export function publicationYearsForIssue({ id, filters }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query GetPublicationYearsForIssue($id: String!, $filters: PeriodicalIssueFilterInput ) {
      work(id: $id) {
        titles {
          full
          main
        }
        extendedWork {
          ... on Periodical {
            issues(filters: $filters) {
              hitcount
              publicationYears {
                hitcount
                entries(offset:0, limit: 1000){
                  term
                  score
                }
              }
            }
          }
        }
      }
    }
    `,
    variables: { id, filters },
    slowThreshold: 3000,
  };
}
export function publicationSubjectsForIssue({ id, filters }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query GetPublicationSubjectsForIssue($id: String!, $filters: PeriodicalIssueFilterInput ) {
      work(id: $id) {
        titles {
          full
          main
        }
        extendedWork {
          ... on Periodical {
            issues(filters: $filters) {
              hitcount
              subjects {
                hitcount
                entries(offset:0, limit: 100){
                  term
                  score
                }
              }
            }
          }
        }
      }
    }
    `,
    variables: { id, filters },
    slowThreshold: 3000,
  };
}
export function publicationMonthsForIssue({ id, filters }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query GetPublicationMonthsForIssue($id: String!, $filters: PeriodicalIssueFilterInput ) {
      work(id: $id) {
        titles {
          full
          main
        }
        extendedWork {
          ... on Periodical {
            issues(filters: $filters) {
              hitcount
              publicationMonths {
                hitcount
                entries(offset:0, limit: 1000){
                  term
                  score
                }
              }
            }
          }
        }
      }
    }
    `,
    variables: { id, filters },
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
export function AllPeriodicaIssuesByworkId({
  id,
  issuesOffset,
  issuesLimit,
  worksLimit,
  filters,
}) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query GetPeriodicaByWork($id: String!, $issuesOffset: Int! $issuesLimit: Int!, $worksLimit: Int!, $filters: PeriodicalIssueFilterInput ) {
      work(id: $id) {
        titles {
          full
          main
        }
        manifestations {
          bestRepresentation {
            identifiers {
              type
              value
            }
          }
        }
        extendedWork {
          ... on Periodical {
            issues(filters: $filters) {
              hitcount
              entries(offset: $issuesOffset, limit: $issuesLimit) {
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
    variables: { id, issuesOffset, issuesLimit, worksLimit, filters },
    slowThreshold: 3000,
  };
}
