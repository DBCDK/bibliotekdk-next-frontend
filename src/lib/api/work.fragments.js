/**
 * @file Contains GraphQL queries all taking a workId as variable
 *
 */

import { ApiEnums } from "@/lib/api/api";
import {
  coverFragment,
  creatorsFragment,
  manifestationDetailsForAccessFactory,
  materialTypesFragment,
  seriesFragment,
  universeFragment,
  workSliderFragment,
} from "@/lib/api/fragments.utils";

export function tableOfContents({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query TableOfContents($workId: String!) {
      work(id: $workId) {
        manifestations {
          mostRelevant {
            pid
            materialTypes {
              ...materialTypesFragment
            }
            tableOfContents {
              heading
              listOfContent {
                content
              }
              content
            }
            ...manifestationDetailsForAccessFactory
          }
        }
      }
    }
    ${manifestationDetailsForAccessFactory}
    ${materialTypesFragment}`,
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
 * @returns {Object} a query object
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
          creators {
            ...creatorsFragment
          }
        }
      }
    }
  }
  ${workSliderFragment}
  ${creatorsFragment}
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
 * @returns {Object} a query object
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
                workTypes
                creators{
                  display
                }
                subjects {
                  dbcVerified {
                    display
                    type
                    ... on SubjectText {
                      language {
                        isoCode
                      }
                    }
                  }
                }
                relations {
                  hasReview {
                    abstract
                    pid
                    creators {
                      ...creatorsFragment
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
                    edition {
                      publicationYear {
                        display
                      }
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
                              ...creatorsFragment
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            } 
            ${creatorsFragment}`,
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
 * @returns {Object} a query object
 */
export function series({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 4000, // for debugging
    query: `query Series($workId: String!) {
      work(id: $workId) {
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
            }
            numberInSeries
            readThisFirst
            readThisWhenever
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

/**
 * Works in Series
 *
 * @param {Object} variables
 * @param {string} variables.workIds
 *
 * @returns {Object} a query object
 */
export function worksInSeries({ workIds }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 4000, // for debugging
    query: `query worksInSeries($workIds: [String!]!) {
      works(id: $workIds) {
        ...workSliderFragment
        creators {
          ...creatorsFragment
        }
        universe {
          ...universeFragment
        }
        series {
          ...seriesFragment
        }
      }
    }
    ${workSliderFragment}
    ${creatorsFragment}
    ${seriesFragment}
    ${universeFragment}
  `,
    variables: { workIds },
    slowThreshold: 3000,
  };
}

/**
 * Infomedia
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @returns {Object} a query object
 */
export function infomediaArticlePublicInfo({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,

    // delay: 4000, // for debugging
    query: `query InfomediaPublic($workId: String!) {
      work(id: $workId) {
        abstract
        workTypes
        titles {
          main
        }
        creators {
          ...creatorsFragment
        }
        subjects {
          dbcVerified {
            display
            type
            ... on SubjectText {
              language {
                isoCode
              }
            }
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
  ${creatorsFragment}
  `,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Subject work info that is fast to fetch
 *
 * @param {Object} params
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
          selectedSubjects: dbcVerified {
            type
            display
            ... on SubjectText {
              language {
                isoCode
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
 * Description work info that is fast to fetch
 *
 * @param {Object} params
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
        creators {
          ...creatorsFragment
        }
        manifestations {
          bestRepresentation {
            notes {
              type
              heading
              display
            }
          }
        }
      }      
      monitor(name: "bibdknext_work_basic")
    }
    ${creatorsFragment}`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Description work info that is fast to fetch
 *
 * @param {Object} params
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
          ...materialTypesFragment
        }
        manifestations {
          all {
            pid
          }
          mostRelevant {
            pid
            materialTypes {
              ...materialTypesFragment
            }
          }
        }
        workTypes
      }
      monitor(name: "bibdknext_work_basic")
    }
    ${materialTypesFragment}`,
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
            ...creatorsFragment
          }
          materialTypes {
            ...materialTypesFragment
          }
          titles {
            full
          }                                  
          manifestations {
            mostRelevant {
              ...manifestationDetailsForAccessFactory
              ...manifestationAccess
              cover {
                detail
                origin
              }    
              audience {
                generalAudience
                childrenOrAdults {
                  display
                }
                schoolUse {
                  display
                }                
                ages {
                  display
                }                
                lix
                let
              }          
              genreAndForm
              languages {
                subtitles {
                  display
                }
                spoken {
                  display
                  isoCode
                }
                main {
                  display
                  isoCode
                }
                original {
                  display
                }                
              }
              creatorsFromDescription
              physicalDescriptions {
                summary
                accompanyingMaterial
                additionalDescription
                extent
                numberOfPages
                numberOfUnits
                playingTime
                requirements
                size
                technicalInformation
                textVsIllustrations
              }
              edition {
                publicationYear {
                  display
                }
              }
              notes {
                type
                heading
                display
              }
              workYear {
                display
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
      ${manifestationAccess}
      ${creatorsFragment}
      ${materialTypesFragment}`,
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
              titles {
                main
                full
              }
              creators {
                ...creatorsFragment
              }
              workTypes
              abstract
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
          ${manifestationDetailsForAccessFactory}
          ${creatorsFragment}`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

export function pidsToWorks({ pids }) {
  if (!pids) return;
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query pidsToWorks($pids: [String!]!) {
      manifestations(pid: $pids) {
        ownerWork {
          workId
        }
        access {
          __typename
          ... on DigitalArticleService {
            issn
          }
        }
        workTypes
        pid
        titles {
          main
          full
        }
        cover {
          detail
          origin
          thumbnail
        }
        creators {
          display
        }
        hostPublication {
          title
        }
        publisher
        edition {
          summary
          edition
          publicationYear {
            display
          }
        }
      }
    }
    `,
    variables: { pids },
    slowThreshold: 3000,
  };
}

export function idsToWorks({ ids }) {
  if (!ids) return;
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query idsToWorks($ids: [String!]!) {
      works(id: $ids) {
        workId
        titles {
          main
          full
        }
        creators {
          display
        }
        manifestations {
          mostRelevant {
            access{
              __typename
              ... on DigitalArticleService {
                issn
              }
            }
            workTypes
            cover {
              detail
              origin
              thumbnail
            }
            titles {
              full
            }
            publisher
            edition{
              publicationYear{
                display
              }
              edition
            }
            pid
            ownerWork {
              workId
              workTypes
              creators {
                display
              }
              titles{
                full
              }
              workYear {
                display
              }
            }
            materialTypes {
              ...materialTypesFragment
            }
          }
          bestRepresentation {
            cover {
              detail
              thumbnail
            }
            materialTypes {
              ...materialTypesFragment
            }
          }
        }
      }
    }
    ${materialTypesFragment}`,
    variables: { ids },
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
              identifyingAddition
            }
            hostPublication {
              title
            }
            materialTypes {
              ...materialTypesFragment
            }
            edition {
              publicationYear {
                display
                year
              }
              edition
            }
            creators {
              ...creatorsFragment
            }
            contributors{
              display
              roles{functionCode function{plural singular}}
            }
            publisher
          }
        }
      }
      monitor(name: "bibdknext_list_of_all_manifestations")
    }
    ${creatorsFragment}
    ${materialTypesFragment}`,
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
          ...materialTypesFragment
        }
        workTypes
        manifestations {
          mostRelevant {
            ...manifestationAccess
            ...manifestationDetailsForAccessFactory
          }
        }
      }
    }
    ${manifestationDetailsForAccessFactory}
    ${manifestationAccess}
    ${materialTypesFragment}`,
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
          parallel
          sort
        }
        creators {
          ...creatorsFragment
        }
        materialTypes {
          ...materialTypesFragment
        }
        mainLanguages {
          display
          isoCode
        }
        fictionNonfiction {
          code
        }
        workTypes
        manifestations {
          mostRelevant {
            ownerWork {
              workTypes
            }
            audience {
              childrenOrAdults {
                code
                display
              }
            }
            pid
            materialTypes {
              ...materialTypesFragment
            }
            cover {
              detail
              origin
            }
            hostPublication {
              title
            }
            publisher
            edition {
              summary
              edition
            }
            access {
              __typename
            }
          }
        }
        ...genreAndFormAndWorkTypesFragment
      }
      monitor(name: "bibdknext_overview_work")
    }
    ${genreAndFormAndWorkTypesFragment}
    ${creatorsFragment}
    ${materialTypesFragment}
    `,
    variables: { workId },
    slowThreshold: 3000,
  };
}

export function pidToWorkId({ pid }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query pidToWorkId($pid: String!) {
      work(pid: $pid) {
        titles {
          main
        }
        creators {
          ...creatorsFragment
        }
        workId
      }
      monitor(name: "bibdknext_pid_to_workid")
    }
    ${creatorsFragment}`,
    variables: { pid },
    slowThreshold: 3000,
  };
}

export function faustToWork({ faust }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query faustToWork($faust: String!) {
      work(faust: $faust) {
        titles {
          main
        }
        creators{
          display
        }
        workId
      }
    }`,
    variables: { faust },
    slowThreshold: 3000,
  };
}

export function oclcToWorkId({ oclc }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query pidToWorkId($oclc: String!) {
      work(oclc: $oclc) {
        titles {
          main
        }
        creators{
          display
        }
        workId
      }
      monitor(name: "bibdknext_oclc_to_workid")
    }`,
    variables: { oclc },
    slowThreshold: 3000,
  };
}

export function workIdToTitleCreator({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query workIdToTitleCreator($workId: String!) {
      work(id: $workId) {
        ...titleFragment
        creators {
          ...creatorsFragment
        }
        workId
      }
    }
    ${titleFragment}
    ${creatorsFragment}
    `,
    variables: { workId },
    slowThreshold: 3000,
  };
}

export function workForWorkRelationsWorkTypeFactory({ workId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query workForWorkRelationsWorkTypeFactory($workId: String!) {
      work(id: $workId) {
        ...workRelationsWorkTypeFactory
        relations {
          ...relationsForWorkRelations
        }
        creators {
          ...creatorsFragment
        }
      }
    }
    ${workRelationsWorkTypeFactory}
    ${relationsForWorkRelations}
    ${creatorsFragment}`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

const genreAndFormAndWorkTypesFragment = `fragment genreAndFormAndWorkTypesFragment on Work {
  genreAndForm
  workTypes
  fictionNonfiction {
    display
    code
  }
}`;

const titleFragment = `fragment titleFragment on Work {
  titles {
    main
    full
  }
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

const workRelationsWorkTypeFactory = `fragment workRelationsWorkTypeFactory on Work {
  manifestations {
    mostRelevant {
      cover {
        detail
        origin
      }
      hostPublication {
        title
        issue
      }
    }
  }
  titles {
    main
    full
  }
  materialTypes {
    materialTypeGeneral {
      code
      display
    }
    materialTypeSpecific {
      code
      display
    }
  }
  workId
  workTypes
}`;

const relationManifestation = `fragment relationManifestation on Manifestation {
  ...coverFragment
  ...manifestationDetailsForAccessFactory
  ownerWork {
    relations {
      continues {
        ...coverFragment
        ...manifestationDetailsForAccessFactory
      }
      continuedIn {
        ...coverFragment
        ...manifestationDetailsForAccessFactory
      }
      discusses {
        ...coverFragment
        ...manifestationDetailsForAccessFactory
      }
      discussedIn {
        ...coverFragment
        ...manifestationDetailsForAccessFactory
      }
    }
  }
}
${manifestationDetailsForAccessFactory}
${coverFragment}`;

const relationsForWorkRelations = `fragment relationsForWorkRelations on Relations {
  hasAdaptation {
    ...relationManifestation
  }
  isAdaptationOf {
    ...relationManifestation
  }
  continues {
    ...relationManifestation
  }
  continuedIn {
    ...relationManifestation
  }
  discusses {
    ...relationManifestation
  }
  discussedIn {
    ...relationManifestation
  }
}
${relationManifestation}`;
