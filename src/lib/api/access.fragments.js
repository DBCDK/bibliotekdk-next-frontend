import { ApiEnums } from "./api";

export function accessForManifestations({ pids }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query AccessForManifestations($pids: [String!]!) {
      manifestations(pid: $pids) {
        pid
        unit {
          manifestations {
            pid
            titles {
              main
            }
            creators {
              display
            }
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
          }
        }
      }
    }`,
    variables: { pids },
    delay: 400,
  };
}
