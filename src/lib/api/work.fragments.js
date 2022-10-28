/**
 * @file Contains GraphQL queries all taking a workId as variable
 *
 */

import { ApiEnums } from "@/lib/api/api";

/**
 * Covers for the different material types
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function covers({ workId }) {
  return {
    // delay: 250,
    query: `query ($workId: String!) {
      work(id: $workId) {
        materialTypes {
          cover {
            detail
          }
        }
      }
      monitor(name: "bibdknext_work_covers")
    }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Details for work manifestations
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function details({ workId }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($workId: String!) {
          work(id: $workId) {
            title
            fullTitle
            creators {
              name
            }
            seo {
              title
              description
            }
            subjects {
              type
              value
            }          
            materialTypes {
              materialType
              manifestations {
                admin{
                  requestButton
                }
                content
                creators {
                  type
                  functionSingular
                  name
                }
                datePublished
                edition
                isbn
                materialType
                language
                onlineAccess {
                  ... on UrlReference {
                    url
                    origin
                    note
                    accessType
                  }
                  ... on InfomediaReference {
                    infomediaId
                    pid
                  }
                  ... on WebArchive {
                    type
                    url
                    pid
                  }
                  ... on DigitalCopy{
                    issn
                  }
                }
                physicalDescription
                publisher              
              }
            }
            workTypes
          }
        monitor(name: "bibdknext_work_details")
      }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Details for all manifestations in a work
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function detailsAllManifestations({ workId }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($workId: String!) {
        work(id: $workId) {
          id
          title
          fullTitle
          description
          creators {
            type
            name
          }
          cover {
            detail
          }
          path
          seo {
            title
            description
          }
          workTypes
          manifestations {
            pid
            admin{
              requestButton
            }
            inLanguage
            usedLanguage
            content
            creators {
              type
              functionSingular
              name
            }
            cover {
              detail
            }
            datePublished
            datePublishedArticle: datePublished(format: "YYYY-MM-DD")
            dk5 {
              value
            }
            edition
            hostPublication {
              title
              details
            }
            physicalDescriptionArticles
            isbn
            materialType
            notes
            language
            onlineAccess {
              ... on UrlReference {
                url
                origin
                note
                accessType
              }
              ... on InfomediaReference {
                infomediaId
                pid
              }
              ... on WebArchive {
                type
                url
                pid
              }
              ... on DigitalCopy{
                issn
              }
            }
            originals
            originalTitle
            pid
            physicalDescription
            publisher
            shelf{
              prefix
              shelfmark
            }
            title
            volume
          }
        }
        monitor(name: "bibdknext_work_detailsallmanifestations")
      }`,
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
export function recommendations({ workId }) {
  return {
    // delay: 4000, // for debugging
    query: `query ($workId: String!) {
    manifestation(pid: $workId) {
      recommendations {
        reader
        manifestation {
          cover {
            detail
          }
          pid
          title
          creators {
            name
          }
        }
      }
    }
    monitor(name: "bibdknext_work_recommendations")
  }
  `,
    variables: { workId: workId.replace("work-of:", "") },
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
    // delay: 1000, // for debugging
    query: `query ($workId: String!) {
        work(id: $workId) {
          id
          title
          reviews {
            __typename
            ... on ReviewInfomedia {
              author
              date
              media
              rating
              reference{
                infomediaId
                pid
              }
            }
            ... on ReviewExternalMedia {
              author
              date
              media
              rating
              url
              alternateUrl
            }
            ... on ReviewMatVurd {
              author
              date
              all {
                text
                work {
                  title
                  id
                  creators {
                    name
                  }
                }
              }
            }
          }
        }
        monitor(name: "bibdknext_work_reviews")
      }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * localizations for a work
 */
export function localizations({ workId }) {
  return {
    // delay: 4000, // for debugging
    query: `
    query WorkFragmentLocalizations($workId: String!){
      work(id:$workId){
        materialTypes{
          materialType
          localizations {
            count
            agencies{
              agencyId
              holdingItems{
                localizationPid
                localIdentifier
                codes
              }
            }
          }
        }
      }
      monitor(name: "bibdknext_work_localizations")
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
    // delay: 4000, // for debugging
    query: `query ($workId: String!) {
      work(id: $workId) {
        series {
          title
          works {
            id
            title
            creators {
              name
            }
            cover {
              detail
            }
          }
        }
      }
      monitor(name: "bibdknext_work_series")
    }
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
    // delay: 4000, // for debugging
    query: `query ($workId: String!, $locale: String) {
      work(id: $workId) {
        workTypes
        manifestations {
          title
          creators {
            name
          }
          datePublished(locale: $locale, format: "LL")
        }
        subjects {
          type
          value
        }
      }
      monitor(name: "bibdknext_work_infomedia_public")
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
            accessTypes {
              code
            }
            access {
              __typename  
              ... on AccessUrl {
                url
                origin
                loginRequired
              }
              ... on Ereol {
                url
              }
              ... on InterLibraryLoan {
                loanIsPossible
              }
              ... on InfomediaService {
                id
              }
              ... on DigitalArticleService {
                issn
              }
            }
            materialTypes {
              specific
            }
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

/**
 * Description work info that is fast to fetch
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function buttonTxt_TempForAlfaApi({ workId }) {
  return {
    // delay: 250,
    query: `
    query buttonTxt($workId: String!) {
      work(id: $workId) {
        materialTypes {
          manifestations {
            pid
            onlineAccess {
              ... on UrlReference {
                url
                origin
              }
              ... on InfomediaReference {
                infomediaId
                pid
              }
              ... on WebArchive {
                url
              }
              ... on DigitalCopy {
                issn
              }
            }
            materialType
            admin {
              requestButton
            }
          }
          materialType
        }
        manifestations {
          pid
          onlineAccess {
            ... on UrlReference {
              url
              origin
            }
            ... on InfomediaReference {
              infomediaId
              pid
            }
            ... on WebArchive {
              url
            }
            ... on DigitalCopy {
              issn
            }
          }
          materialType
          admin {
            requestButton
          }
        }
        materialTypes {
          materialType
        }
        workTypes
      }
      monitor(name: "bibdknext_work_basic")
    }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}
