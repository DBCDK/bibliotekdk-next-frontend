import { ApiEnums } from "@/lib/api/api";

export function localizationsQuery({ pids }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query LocalizationsFragments($pids: [String!]!) {
      localizations(pids: $pids) {
        count
        agencies {
          agencyId
          holdingItems {
            localizationPid
            codes
            localIdentifier
          }
        }
      }
      monitor(name: "localizations")
    }`,
    variables: { pids },
    slowThreshold: 3000,
  };
}
