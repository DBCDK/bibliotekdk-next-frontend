/**
 * @file Contains GraphQL queries all taking a workId as variable
 *
 */

import { ApiEnums } from "@/lib/api/api";

export function tableOfContents({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query TableOfContents($workId: String!) {
      work(id: $workId) {
        manifestations {
          all {
            materialTypes {
              specific
            }
            tableOfContents {
              heading
              listOfContent {
                content
              }
            }
          }
        }
      }
    }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Recommendations for a work
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function recommendations({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 4000, // for debugging
    query: `query Recommendations($workId: String!) {
    recommend(id: $workId) {
      result {
        reader
        work {
          ...workSliderFragment
        }
      }
    }
  }
  ${workSliderFragment}
  `,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Recommendations for a work
 *
 * This is still the old laesekompas recommender
 * Will be changed at some point
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function reviews({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query Reviews($workId: String!) {
              work(id: $workId) {
                workId
                titles {
                  main
                }
                subjects {
                  dbcVerified {
                    display
                    type
                  }
                }
                relations {
                  hasReview {
                    pid
                    creators {
                      display
                    }
                    access {
                      __typename
                      ... on InfomediaService {
                        id
                      }
                      ... on AccessUrl {
                        origin
                        url
                        note
                        loginRequired
                        type
                      }
                      ... on DigitalArticleService {
                        issn
                      }
                    }
                    hostPublication {
                      title
                      issue
                    }
                    physicalDescriptions {
                      summary
                    }
                    recordCreationDate
                    review {
                      rating
                      reviewByLibrarians {
                        content
                        heading
                        type
                        manifestations {
                          ownerWork {
                            workId
                            titles {
                              main
                            }
                            creators {
                              display
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Series for a work
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function series({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 4000, // for debugging
    query: `query Series($workId: String!) {
      work(id: $workId) {
        seriesMembers {
          ...workSliderFragment
        }
      }
    }
    ${workSliderFragment}
  `,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Infomedia
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function infomediaArticlePublicInfo({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,

    // delay: 4000, // for debugging
    query: `query InfomediaPublic($workId: String!) {
      work(id: $workId) {
        workTypes
        titles {
          main
        }
        creators {
          display
        }
        subjects {
          dbcVerified {
            display
            type
          }
        }
        manifestations {
          latest {
            physicalDescriptions {
              summary
            }
            hostPublication {
              issue
              title
            }
          }
        }
        
      }
    }
  `,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Subject work info that is fast to fetch
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function subjects({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 250,
    query: `
    query subjects($workId: String!) {
      work(id: $workId) {
        subjects {
          dbcVerified {
            display
          }
        }
      }
      monitor(name: "bibdknext_work_basic")
    }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Description work info that is fast to fetch
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function description({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 250,
    query: `
    query description($workId: String!) {
      work(id: $workId) {
        abstract
      }
      monitor(name: "bibdknext_work_basic")
    }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Description work info that is fast to fetch
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function pidsAndMaterialTypes({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query fetchPids($workId: String!) {
      work(id: $workId) {
        manifestations {
          all {
            pid
            materialTypes {
              specific
            }
          }
        }
      }
      monitor(name: "bibdknext_work_pidsAndMaterialTypes")
    }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Description work info that is fast to fetch
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function buttonTxt({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 250,
    query: `
    query buttonTxt ($workId: String!) {
      work(id: $workId) {
        titles {
          main
        }
        materialTypes {
          specific
        }
        manifestations {
          all {
            pid
          }
          mostRelevant {
            pid
          }
        }
        workTypes
      }
      monitor(name: "bibdknext_work_basic")
    }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

export function fbiOverviewDetail({ workId }) {
  return {
    // delay: 4000, // for debugging
    apiUrl: ApiEnums.FBI_API,
    query: `query overViewDetails($workId: String!) {
        work(id: $workId) {
          workId
          workTypes
          genreAndForm 
          creators {
            display
          }
          materialTypes {
            specific
          }
          titles {
            full
          }                                  
          manifestations {
            all {
              ...manifestationDetailsForAccessFactory
              ...manifestationAccess
              cover {
                detail
                origin
              }              
              genreAndForm
              languages {
                subtitles {
                  display
                }
                spoken {
                  display
                }
                main {
                  display
                }
              }
              physicalDescriptions {
                summary
              }
              edition {
                publicationYear {
                  display
                }
              }
              contributors {
                display
                roles {
                  functionCode
                  function {
                    plural
                    singular
                  }
                }
              }
            }
          }
        }
        monitor(name: "bibdknext_work_overview_details")
      }
      ${manifestationDetailsForAccessFactory}
      ${manifestationAccess}`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Get parameters needed to generate JsonLD - @see components/work/header/Header.js
 * @param workId
 * @returns {{variables: {workId}, apiUrl: string, slowThreshold: number, query: string}}
 */
export function workJsonLd({ workId }) {
  return {
    // delay: 4000, // for debugging
    apiUrl: ApiEnums.FBI_API,
    query: `query workJsonLd($workId: String!) {
            work(id: $workId) {
              workId
              workTypes
              abstract
              titles {
                main
              }
              abstract
              creators {
                display
              }
              manifestations {
                all {
                  ...manifestationDetailsForAccessFactory
                  cover {
                    detail
                    origin
                  }                  
                  identifiers {
                    type
                    value
                  }
                  languages {
                    main {
                      display
                    }
                  }
                  physicalDescriptions {
                    summary
                  }
                  edition {
                    publicationYear {
                      display
                    }
                  }
                  contributors {
                    display
                    roles {
                      functionCode
                      function {
                        plural
                        singular
                      }
                    }
                  }
                  hostPublication{
                    title      
                    summary
                  }
                }
              }
            }
            monitor(name: "bibdknext_work_json_ld")
          }
          ${manifestationDetailsForAccessFactory}`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

export function editionWork({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query editionWork($workId: String!) {
      work(id: $workId) {
        titles {
          full
        }
        materialTypes {
          specific
        }
        workTypes
      }
      monitor(name: "bibdknext_edition_work")
    }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

export function listOfAllManifestations({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query listOfAllManifestations($workId: String!) {
      work(id: $workId) {
        manifestations {
          mostRelevant {
            pid
            volume
            titles {
              main
            }
            materialTypes {
              specific
            }
            edition {
              publicationYear {
                display
              }
            }
          }
        }
      }
      monitor(name: "bibdknext_list_of_all_manifestations")
    }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

export function orderPageWorkWithManifestations({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query orderPageManifestations($workId: String!) {
      work(id: $workId) {
        materialTypes {
          specific
        }
        workTypes
        manifestations {
          all {
            ...manifestationAccess
            ...manifestationDetailsForAccessFactory
          }
        }
      }
    }
    ${manifestationDetailsForAccessFactory}
    ${manifestationAccess}`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

export function overviewWork({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query overviewWork($workId: String!) {
      work(id: $workId) {
        titles {
          full
        }
        creators {
          display
        }
        materialTypes {
          specific
        }
        manifestations {
          mostRelevant {
            pid
            materialTypes {
              specific
            }
            cover {
              detail
              origin
            }
            access {
              __typename
            }
          }
        }
      }
      monitor(name: "bibdknext_overview_work")
    }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

// Use this fragments in queries that provide data
// to the WorkSlider
const workSliderFragment = `fragment workSliderFragment on Work {
  workId
  titles {
    main
  }
  creators {
    display
  }
  manifestations {
    all {
      materialTypes {
        specific
      }
      cover {
        detail
        origin
      }
    }
  }
}`;

export function pidToWorkId({ pid }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query pidToWorkId($pid: String!) {
      work(pid: $pid) {
        titles {
          main
        }
        creators{
          display
        }
        workId
      }
      monitor(name: "bibdknext_pid_to_workid")
    }`,
    variables: { pid },
    slowThreshold: 3000,
  };
}

const manifestationDetailsForAccessFactory = `fragment manifestationDetailsForAccessFactory on Manifestation {
  pid
  titles {
    main
    full
  }
  creators {
    display
    nameSort
    roles {
      functionCode
      function {
        plural
        singular
      }
    }
  }
  materialTypes {
    specific
  }
  workTypes
}`;

const manifestationAccess = `fragment manifestationAccess on Manifestation {
   access {
    __typename
    ... on AccessUrl {
      origin
      url
      note
      loginRequired
      type
    }
    ... on InfomediaService {
      id
    }
    ... on Ereol {
      origin
      url
      canAlwaysBeLoaned
      note
    }
    ... on DigitalArticleService {
      issn
    }
    ... on InterLibraryLoan {
      loanIsPossible
    }
  }
}`;
