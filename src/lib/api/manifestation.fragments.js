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
        materialTypes {
          specific
        }
        accessTypes {
          display
        }
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
    query orderButtonTextBelowManifestations($pid: [String!]!) {
      manifestations(pid: $pid) {
        pid
        titles {
          main
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

const accessFragment = `fragment accessFragment on Manifestation {
  access {
    __typename
    ... on AccessUrl {
      url
      origin
      loginRequired
    }
    ... on Ereol {
      url
      origin
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
