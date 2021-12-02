export function localizationsQuery({ pids }) {
  return {
    query: `query($pids: [String!]!) {
        localizations(pids:$pids){
        count
        agencies{agencyId holdingItems {
          localizationPid
          codes
          localIdentifier
        }}
      }
     monitor(name: "localizations")
  }`,
    variables: { pids },
    slowThreshold: 3000,
  };
}
