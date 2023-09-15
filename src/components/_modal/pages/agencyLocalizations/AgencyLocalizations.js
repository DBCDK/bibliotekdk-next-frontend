import Translate from "@/components/base/translate";
import { useAgenciesConformingToQuery } from "@/components/hooks/useHandleAgencyAccessData";
import { useData } from "@/lib/api/api";
import * as localizationsFragments from "@/lib/api/localizations.fragments";
import LocalizationsBase from "@/components/_modal/pages/base/localizationsBase/LocalizationsBase";
import AgencyLocalizationItem from "./agencyLocalizationItem/AgencyLocalizationItem";
import { useState } from "react";
import isEmpty from "lodash/isEmpty";

export default function Wrap({ context, modal }) {
  const { pids } = context;
  const [query, setQuery] = useState("");

  const { agenciesFlatSorted, agenciesIsLoading } =
    useAgenciesConformingToQuery({
      pids: pids,
      q: query,
    });

  const {
    data: agenciesWithHoldings,
    isLoading: agenciesWithHoldingsIsLoading,
  } = useData(
    pids && localizationsFragments.localizationsWithHoldings({ pids: pids })
  );

  const agencyIds =
    query && !isEmpty(query)
      ? agenciesFlatSorted.map((singleAgency) => singleAgency.agencyId)
      : agenciesWithHoldings?.localizationsWithHoldings?.agencies?.map(
          (agency) => agency.agencyId
        );

  // const agencyIds = null;

  return (
    <LocalizationsBase
      modal={modal}
      context={context}
      pids={pids}
      subheader={Translate({
        context: "localizations",
        label: "reminder_can_be_ordered_from_anywhere",
      })}
      query={query}
      setQuery={setQuery}
    >
      <LocalizationsBase.List>
        {(agencyIds ?? Array(10).fill(""))?.map((agencyId, index) => (
          <li key={JSON.stringify(agencyId + "-" + index)}>
            <AgencyLocalizationItem
              context={context}
              localizationsIsLoading={
                agenciesWithHoldingsIsLoading || agenciesIsLoading
              }
              modal={modal}
              agencyId={agencyId}
              pids={pids}
              query={query}
            />
          </li>
        ))}
      </LocalizationsBase.List>
    </LocalizationsBase>
  );
}
