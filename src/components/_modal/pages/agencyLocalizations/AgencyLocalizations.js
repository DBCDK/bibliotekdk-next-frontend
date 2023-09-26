import Translate from "@/components/base/translate";
import { useAgenciesConformingToQuery } from "@/components/hooks/useHandleAgencyAccessData";
import { useData } from "@/lib/api/api";
import * as localizationsFragments from "@/lib/api/localizations.fragments";
import LocalizationsBase from "@/components/_modal/pages/base/localizationsBase/LocalizationsBase";
import AgencyLocalizationItem from "./agencyLocalizationItem/AgencyLocalizationItem";
import { useState } from "react";
import isEmpty from "lodash/isEmpty";
import styles from "./AgencyLocalizations.module.css";
import Text from "@/components/base/text/Text";

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

  const localizationsIsLoading =
    agenciesWithHoldingsIsLoading || agenciesIsLoading;

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
      {isEmpty(agencyIds) && !localizationsIsLoading ? (
        <LocalizationsBase.Information
          className={styles.no_match_for_library_search}
        >
          <Text type="text2">
            {Translate({
              context: "localizations",
              label: "no_match_for_library_search_1",
            })}
          </Text>
          <Text type="text2" className={styles.hint_for_no_search_results}>
            {Translate({
              context: "localizations",
              label: "no_match_for_library_search_2",
            })}
          </Text>
        </LocalizationsBase.Information>
      ) : (
        <LocalizationsBase.List>
          {(agencyIds ?? Array(10).fill(""))?.map((agencyId, index) => (
            <li key={JSON.stringify(agencyId + "-" + index)}>
              <AgencyLocalizationItem
                context={context}
                localizationsIsLoading={localizationsIsLoading}
                modal={modal}
                agencyId={agencyId}
                pids={pids}
                query={query}
              />
            </li>
          ))}
        </LocalizationsBase.List>
      )}
    </LocalizationsBase>
  );
}
