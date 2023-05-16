/**
 * @file Contains GraphQL queries all taking a pid (manifestion) as variable
 *
 */
import { ApiEnums } from "@/lib/api/api";

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
        ...accessFragment
      }
      monitor(name: "bibdknext_manifestation_manifestation")
    }
    ${manifestationFragment}
    ${manifestationCoverFragment}
    ${accessFragment}
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
          display
        }
        workTypes
        ...manifestationCoverFragment
        ...accessFragment
      }
      monitor(name: "bibdknext_manifestation_manifestations")
    }
    ${manifestationCoverFragment}
    ${accessFragment}
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
          display
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
              display
            }
            creatorsFromDescription            
            subjects {
              display
            }
            playingTime
          }
        }
      }
    }
    `,
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
           display
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
     display
   }
   recordCreationDate
}`;

const reviewOfFragment = `fragment reviewOfFragment on Manifestation {
   relations {
     isReviewOf {
       pid
       creators {
         display
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
  creators {
    display
    roles {
      function {
        singular
      }
    }
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
