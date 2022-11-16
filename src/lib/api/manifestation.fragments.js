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

export function manifestation({ pid }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query manifestation($pid: String!) {
      manifestation(pid: $pid) {
        ...manifestationCoverFragment
        ...manifestationFragment
      }
      monitor(name: "bibdknext_manifestation_manifestation")
    }
    ${manifestationFragment}
    ${manifestationCoverFragment}
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
        ...manifestationCoverFragment
      }
      monitor(name: "bibdknext_manifestation_manifestations")
    }
    ${manifestationCoverFragment}
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
        materialTypes {
          specific
        }
        accessTypes {
          display
        }
        access {
          __typename
          ... on DigitalArticleService {
            issn
          }
          ... on AccessUrl {
            url
            origin
          }
          ... on Ereol {
            url
            origin
          }
          ... on InterLibraryLoan {
            loanIsPossible
          }
        }
      }
      monitor(name: "bibdknext_manifestation_manifestations")
    }
    `,
    variables: { pid },
    slowThreshold: 3000,
  };
}

const manifestationCoverFragment = `fragment manifestationCoverFragment on Manifestation {
  cover {
    detail
    thumbnail
  }
}`;

const manifestationFragment = `fragment manifestationFragment on Manifestation {
  pid
  titles {
    main
    full
    original
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
  }
  workYear
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
  access {
	  ...on DigitalArticleService {
      issn
    }
  }
}`;
