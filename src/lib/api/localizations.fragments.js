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
            localIdentifier
            codes
          }
        }
      }
      monitor(name: "localizations")
    }`,
    variables: { pids },
    slowThreshold: 3000,
  };
}

export function localizationsWithHoldings({
  pids,
  limit = 10000,
  offset = 0,
  availabilityTypes = ["NOW"],
}) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query LocalizationsWithHoldings($pids: [String!]!, $limit: Int, $offset: Int, $availabilityTypes: [AvailabilityEnum!]) {
      localizationsWithHoldings(pids: $pids, limit: $limit, offset: $offset, bibdkExcludeBranches: true, statuses: AKTIVE, availabilityTypes: $availabilityTypes) {
        count
        agencies {
          agencyId
        }
      }
    }`,
    variables: { pids, limit, offset, availabilityTypes },
    slowThreshold: 15000,
  };
}
