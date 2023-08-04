import Translate from "@/components/base/translate";
import useAgencyAccessFactory from "@/components/hooks/useAgencyAccessFactory";
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import LocalizationsBase from "@/components/_modal/pages/base/localizationsBase/LocalizationsBase";
import AgencyLocalizationItem from "./agencyLocalizationItem/AgencyLocalizationItem";
import Top from "@/components/_modal/pages/base/top";

export default function Wrap({ context, modal }) {
  const { agency: agencyOfUser, pids } = context;

  console.log("context: ", context);

  const { data: manifestationsData, isLoading: isManifestationsLoading } =
    useData(
      pids &&
        pids.length > 0 &&
        manifestationFragments.editionManifestations({
          pid: pids,
        })
    );
  const { flattenedGroupedSortedManifestations: manifestations } =
    manifestationMaterialTypeFactory(manifestationsData?.manifestations);

  const { agenciesFlatSorted, setQuery, query } = useAgencyAccessFactory({
    pids,
  });

  return (
    <LocalizationsBase
      modal={modal}
      context={context}
      manifestations={[manifestations?.[0]]}
      subheader={Translate({
        context: "localizations",
        label: "reminder_can_be_ordered_from_anywhere",
      })}
      query={query}
      setQuery={setQuery}
      defaultLibraries={agencyOfUser}
      libraries={agenciesFlatSorted}
    >
      <LocalizationsBase.List>
        {agenciesFlatSorted.map((agency) => (
          <li key={JSON.stringify(agency)}>
            <AgencyLocalizationItem
              context={context}
              agency={agency}
              query={query}
              modal={modal}
            />
          </li>
        ))}
      </LocalizationsBase.List>
    </LocalizationsBase>
  );
}
