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
        workReviews {
          pid
          author
          date
          origin
          rating
          infomediaId
          urls {
            origin
            url
            note
          }
          periodica {
            volume
            pages
            hostPublication {
              workId
              titles {
                main
              }
            }
          }
          librariansReview {
            text
            work {
              workId
              creators {
                display
              }
              titles {
                main
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
              pid
              access {
                __typename
                ... on InterLibraryLoan {
                  loanIsPossible
                }
                ... on AccessUrl {
                  origin
                  url
                  loginRequired
                }
                ... on Ereol {
                  origin
                  url
                  canAlwaysBeLoaned
                }
                ... on InfomediaService {
                  id
                }
                ... on DigitalArticleService {
                  issn
                }
              }
              cover {
                detail
                origin
              }              
              materialTypes {
                specific
              }
              titles {
                main
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
              creators {
                display
                roles {
                  functionCode
                  function {
                    singular
                  }
                }
              }
            }
          }
        }
        monitor(name: "bibdknext_work_overview_details")
      }`,
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
                  pid
                  cover {
                    detail
                    origin
                  }                  
                  identifiers {
                    type
                    value
                  }
                  materialTypes {
                    specific
                  }
                  titles {
                    main
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
                  creators {
                    display
                    roles {
                      functionCode
                      function {
                        singular
                      }
                    }
                  }
                }
              }
            }
            monitor(name: "bibdknext_work_json_ld")
          }`,
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
          all {
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

export function orderPageManifestations({ workId }) {
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
            pid
            materialTypes {
              specific
            }
            accessTypes {
              code
              display
            }
            access {
              __typename
              ... on AccessUrl {
                url
                origin
              }
              ... on InfomediaService {
                id
              }
              ... on DigitalArticleService {
                issn
              }
              ... on Ereol {
                url
                origin
              }
              ... on InterLibraryLoan{
                loanIsPossible
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
          all {
            pid
            materialTypes {
              specific
            }
            cover {
              detail
              origin
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
