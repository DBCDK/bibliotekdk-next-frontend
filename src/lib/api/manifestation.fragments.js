/**
 * @file Contains GraphQL queries all taking a pid (manifestion) as variable
 *
 */
import { ApiEnums } from "@/lib/api/api";

import {
  creatorsFragment,
  manifestationDetailsForAccessFactory,
} from "@/lib/api/fragments.utils";

export function refWorks(pid) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 250,
    query: `
    query ($pid: String!) {
      refWorks(pid:$pid)
      monitor(name: "bibdknext_manifestation_refworks")
    }`,
    variables: { pid },
    slowThreshold: 3000,
  };
}

export function ris(pid) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 250,
    query: `query ($pid: String!) {
      ris(pid:$pid)
      monitor(name: "bibdknext_manifestation_ris")
    }`,
    variables: { pid },
    slowThreshold: 3000,
  };
}

export function manifestationFullManifestation({ pid }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query manifestation($pid: String!) {
      manifestation(pid: $pid) {
        ...manifestationCoverFragment
        ...manifestationFragment
        creators {
          ...creatorsFragment
        }
        ...accessFragment
      }
      monitor(name: "bibdknext_manifestation_manifestation")
    }
    ${manifestationFragment}
    ${manifestationCoverFragment}
    ${accessFragment}
    ${creatorsFragment}
    `,
    variables: { pid },
    slowThreshold: 3000,
  };
}

export function editionManifestations({ pid }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query editionManifestations($pid: [String!]!) {
      manifestations(pid: $pid) {
        pid
        ownerWork {
          workId
        }
        materialTypes {
          specific
        }
        edition {
          publicationYear {
            display
          }
          edition
        }
        publisher
        titles {
          full
        }
        creators {
          ...creatorsFragment
        }
        workTypes
        ...manifestationCoverFragment
        ...accessFragment
      }
      monitor(name: "bibdknext_manifestation_manifestations")
    }
    ${manifestationCoverFragment}
    ${accessFragment}
    ${creatorsFragment}
    `,
    variables: { pid },
    slowThreshold: 3000,
  };
}

export function alternativesManifestations({ pid }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query alternativesManifestations($pid: [String!]!) {
      manifestations(pid: $pid) {
        pid
        titles {
          main
        }
        creators {
          ...creatorsFragment
        }
        materialTypes {
          specific
        }
        accessTypes {
          display
        }
        workTypes
        ...accessFragment
      }
      monitor(name: "bibdknext_manifestation_manifestations")
    }
    ${accessFragment}
    ${creatorsFragment}
    `,
    variables: { pid },
    slowThreshold: 3000,
  };
}

export function reservationButtonManifestations({ pid }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query reservationButtonManifestations($pid: [String!]!) {
      manifestations(pid: $pid) {
        pid
        titles {
          main
        }
        materialTypes {
          specific
        }
        workTypes
        ...accessFragment
      }
      monitor(name: "bibdknext_manifestation_manifestations")
    }
    ${accessFragment}
    `,
    variables: { pid },
    slowThreshold: 3000,
  };
}

export function manifestationParts({ pid }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query manifestationParts($pid: String!) {
      manifestation(pid: $pid) {
        manifestationParts {
          parts {
            title
            classifications {
              display
            }
            creators {
              ...creatorsFragment
            }
            contributorsFromDescription
            creatorsFromDescription            
            subjects {
              display
            }
            playingTime
          }
        }
      }
    }
    ${creatorsFragment}`,
    variables: { pid },
    slowThreshold: 3000,
  };
}

export function manifestationsForAccessFactory({ pid }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query orderPageManifestations($pid: [String!]!) {
      manifestations(pid: $pid) {
        ...manifestationDetailsForAccessFactory
        ...accessFragment
      }
      monitor(name: "bibdknext_manifestation_manifestations")
    }
    ${manifestationDetailsForAccessFactory}
    ${accessFragment}
    `,
    variables: { pid },
    slowThreshold: 3000,
  };
}

export function manifestationForLectorReview({ pid }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query manifestationForLectorReview($pid: String!) {
      manifestation(pid: $pid) {
        ...manifestationDetailsForAccessFactory
        ...lectorReviewFragment
        ...reviewOfFragment
      }
    }
    ${manifestationDetailsForAccessFactory}
    ${lectorReviewFragment}
    ${reviewOfFragment}
    `,
    variables: { pid },
    slowThreshold: 3000,
  };
}

const accessFragment = `fragment accessFragment on Manifestation {
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

const lectorReviewFragment = `fragment lectorReviewFragment on Manifestation {
   abstract
   review {
     reviewByLibrarians {
       content
       contentSubstitute
       heading
       manifestations {
         cover {
           detail
         }
         pid
         titles {
           full
           identifyingAddition
           standard
           titlePlusLanguage
         }
         creators {
           ...creatorsFragment
         }
         materialTypes {
           specific
         }
         ownerWork {
           workId
         }
       }
       type
     }
   }
   pid
   creators {
     ...creatorsFragment
   }
   recordCreationDate
}
${creatorsFragment}`;

// NOTE Creators Fragment is not added, because it is implemented from ManifestationDetailsForAccessFactory
const reviewOfFragment = `fragment reviewOfFragment on Manifestation {
   relations {
     isReviewOf {
       pid
       creators {
         ...creatorsFragment
       }
       materialTypes {
         specific
       }
       titles {
         full
       }
       ownerWork {
         workId
       }
       cover {
         detail
         origin
       }
       edition {
         edition
         publicationYear {
           display
         }
       }
       workTypes
     }
   }
}`;

const manifestationCoverFragment = `fragment manifestationCoverFragment on Manifestation {
  cover {
    detail
    thumbnail
    origin
  }
}`;

const manifestationFragment = `fragment manifestationFragment on Manifestation {
  pid
  titles {
    main
    full
    original
    alternative
    parallel
  }
  contributors {
    display
    roles {
      function {
        singular
      }
    }
  }
  publisher
  edition {
    publicationYear {
      display
    }
    edition
  }
  hostPublication {
    summary
  }
  physicalDescriptions {
    summary
    extent
    requirements
  }
  classifications {
    system
    display
  }
  subjects {
    dbcVerified {
     display
      type
    }
  }  
  languages {
    original {
      display
    }
    main {
      display
    }
    spoken {
      display
    }
    subtitles {
      display
    }
    notes
  }
  workYear {
    display
  }
  identifiers {
    type
    value
  }
  notes {
    display
  }
  materialTypes {
    specific
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
  shelfmark {
    shelfmark
    postfix
  }
  manifestationParts {
     parts {
        title
     }
  }  
}`;
