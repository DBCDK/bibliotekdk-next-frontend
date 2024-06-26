import Translate from "@/components/base/translate";
import { useAgencyIdsConformingToQuery } from "@/components/hooks/useHandleAgencyAccessData";
import { useData } from "@/lib/api/api";
import * as localizationsFragments from "@/lib/api/localizations.fragments";
import LocalizationsBase from "@/components/_modal/pages/base/localizationsBase/LocalizationsBase";
import AgencyLocalizationItem from "./agencyLocalizationItem/AgencyLocalizationItem";
import { useState } from "react";
import isEmpty from "lodash/isEmpty";
import styles from "./AgencyLocalizations.module.css";
import Text from "@/components/base/text/Text";
import Pagination from "@/components/search/pagination/Pagination";
import { AvailabilityLight } from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/AvailabilityLight";
import cx from "classnames";
import { HoldingStatusEnum } from "@/components/hooks/useHoldings";

const PAGE_SIZE = 25;

function NoMaterialsHomeAtLocalizations({
  labelBase,
  availabilityLight = true,
}) {
  return (
    <LocalizationsBase.Information
      className={cx(styles.no_match_for_library_search, styles.row_wrapper)}
    >
      {availabilityLight && (
        <AvailabilityLight
          branch={{
            holdings: {
              holdingsLamp: {
                src: "status__red.svg",
                alt: Translate({
                  context: "holdings",
                  label: `lamp_alt_${HoldingStatusEnum.NOT_ON_SHELF}`,
                }),
              },
            },
          }}
        />
      )}
      <div className={styles.result}>
        <Text type="text2">
          {Translate({
            context: "localizations",
            label: `${labelBase}_1`,
          })}
        </Text>
        <Text type="text2" className={styles.hint_for_no_search_results}>
          {Translate({
            context: "localizations",
            label: `${labelBase}_2`,
          })}
        </Text>
      </div>
    </LocalizationsBase.Information>
  );
}

/**
 * {@link AgencyLocalizations} presents the possible agencies with holdings or conforming to query
 *   (or message when query yields not results). It uses {@link LocalizationsBase} and its compounded components
 *
 * @param {Object} props
 * @param {Object.<string, any>} props.context
 * @param {Object.<string, any>} props.modal
 * @returns {React.ReactElement | null}
 */
export default function AgencyLocalizations({ context, modal }) {
  const { pids } = context;
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const {
    agencyIds: agencyIdsFromQuery,
    isLoading: agencyIdsFromQueryIsLoading,
  } = useAgencyIdsConformingToQuery(
    !isEmpty(pids) &&
      !isEmpty(query) && {
        pids: pids,
        q: query,
        limit: 100,
      }
  );

  const {
    data: agenciesWithHoldings,
    isLoading: agenciesWithHoldingsIsLoading,
  } = useData(
    pids &&
      localizationsFragments.localizationsQuery({
        pids: pids,
      })
  );

  const agencyIds = !isEmpty(query)
    ? agencyIdsFromQuery
    : agenciesWithHoldings?.localizations?.agencies?.map(
        (agency) => agency?.agencyId
      );

  const localizationsIsLoading =
    agenciesWithHoldingsIsLoading || agencyIdsFromQueryIsLoading;

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
      setQuery={(value) => {
        value === "" && setLimit(PAGE_SIZE);
        setQuery(value);
      }}
    >
      {!isEmpty(query) && isEmpty(agencyIds) && !localizationsIsLoading ? (
        <NoMaterialsHomeAtLocalizations
          availabilityLight={false}
          labelBase={"no_match_for_library_search"}
        />
      ) : isEmpty(query) && isEmpty(agencyIds) && !localizationsIsLoading ? (
        <NoMaterialsHomeAtLocalizations
          labelBase={"no_libraries_with_material_home"}
        />
      ) : (
        <>
          <LocalizationsBase.List>
            {(agencyIds?.slice(0, limit) ?? Array(limit).fill(""))?.map(
              (agencyId, index) => (
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
              )
            )}
          </LocalizationsBase.List>
          <Pagination
            className={styles.pagination}
            numPages={limit <= agencyIds?.length ? 2 : 1}
            forceMobileView={true}
            disableScrollMobileView={true}
            onChange={() => setLimit((prev) => prev + PAGE_SIZE)}
          />
        </>
      )}
    </LocalizationsBase>
  );
}
