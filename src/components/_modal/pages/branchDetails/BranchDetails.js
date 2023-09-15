import LocalizationsBase from "@/components/_modal/pages/base/localizationsBase/LocalizationsBase";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import uniq from "lodash/uniq";
import Text from "@/components/base/text/Text";
import Title from "@/components/base/title/Title";
import { IconLink } from "@/components/base/iconlink/IconLink";
import ExternalSvg from "@/public/icons/external_small.svg";
import animations from "css/animations";
import { templateForLocalizations } from "@/components/base/materialcard/templates/templates";
import styles from "./BranchDetails.module.css";
import cx from "classnames";
import ReservationButton from "@/components/work/reservationbutton";
import BranchStatus from "@/components/_modal/pages/branchDetails/branchstatus/BranchStatus";

import { useSingleBranch } from "@/components/hooks/useHandleAgencyAccessData";

function anyPickupAllowed(branch) {
  return branch?.branches
    ?.map((branch) => branch.pickupAllowed)
    .some((singlePickupAllowed) => singlePickupAllowed === true);
}

function BranchDetails({ context }) {
  const { pids: pids, branchId } = context;

  const { agenciesFlatSorted } = useSingleBranch({
    pids: pids,
    branchId: branchId,
  });

  const singleBranch = agenciesFlatSorted?.[0];

  // const localHoldingsIds = uniq(
  //   singleBranch?.holdingsItems.map((item) => item.localHoldingsId)
  // );
  //
  // const pids = pidsBeforeFilter.filter((pid) =>
  //   localHoldingsIds?.some((holdingsId) => pid.includes(holdingsId))
  // );

  const { data: manifestationsData } = useData(
    pids &&
      pids.length > 0 &&
      manifestationFragments.editionManifestations({
        pid: pids,
      })
  );
  const {
    flattenedGroupedSortedManifestations: manifestationsBeforeEnriching,
  } = manifestationMaterialTypeFactory(manifestationsData?.manifestations);

  const manifestations = manifestationsBeforeEnriching.map((manifestation) => {
    const itemsWithPid = singleBranch?.holdingsItems?.filter((item) =>
      manifestation?.pid?.includes(item?.localHoldingsId)
    );

    return {
      ...manifestation,
      locationInBranch: uniq(
        [
          itemsWithPid?.[0]?.department,
          itemsWithPid?.[0]?.location,
          itemsWithPid?.[0]?.subLocation,
        ].filter((e) => !!e)
      ).join(" > "),
      availability: singleBranch?.availability,
      availabilityById: singleBranch?.availabilityById?.find((ids) =>
        manifestation?.pid.includes(ids.localHoldingsId)
      ),
    };
  });

  const workIds = uniq(
    manifestations?.map((manifestation) => {
      return manifestation.ownerWork?.workId;
    })
  );

  if (workIds.length !== 1) {
    return <div>Der burde ikke være flere workIds</div>;
  }

  const workId = workIds?.[0];

  console.log("agenciesFlatSorted: ", agenciesFlatSorted?.[0]);

  return (
    <LocalizationsBase
      context={context}
      pids={pids}
      materialCardTemplate={templateForLocalizations}
    >
      <LocalizationsBase.Information>
        <Title type={"title6"} className={cx(styles.branch_status)}>
          Status
        </Title>
        <BranchStatus
          library={agenciesFlatSorted?.[0]}
          manifestations={manifestations}
        />
        {!anyPickupAllowed(singleBranch) ? (
          <div>NEJ IKKE ALLOWED</div>
        ) : (
          <div className={cx(styles.reservationButton_container)}>
            <ReservationButton
              workId={workId}
              selectedPids={pids}
              singleManifestation={false}
              size={"medium"}
              overrideButtonText={Translate({
                context: "localizations",
                label: "order_to_here",
              })}
            />
          </div>
        )}
        <Title type={"title6"} className={cx(styles.about_the_branch)}>
          {Translate({ context: "localizations", label: "about_the_branch" })}
        </Title>
        <div className={cx(styles.fit_content)}>
          <Text type="text1">Åbningstider</Text>
          <IconLink
            iconPlacement="right"
            iconSrc={ExternalSvg}
            iconAnimation={[animations["h-elastic"], animations["f-elastic"]]}
            textType="type2"
            href={`${singleBranch?.branchWebsiteUrl}/biblioteker`}
            target="_blank"
          >
            Klik her
          </IconLink>
        </div>
        <div className={cx(styles.fit_content)}>
          <Text type="text1">Adresse</Text>
          <Text type="text2">{singleBranch?.postalAddress}</Text>
          <Text type="text2">
            {singleBranch?.postalCode} {singleBranch?.city}
          </Text>
          <IconLink
            iconPlacement="right"
            iconSrc={ExternalSvg}
            iconAnimation={[animations["h-elastic"], animations["f-elastic"]]}
            textType="type2"
            href={`https://www.google.com/maps/place/${singleBranch?.postalAddress}+${singleBranch?.postalCode}+${singleBranch?.city}`}
            target="_blank"
          >
            Se i Google Maps
          </IconLink>
        </div>
        <div className={cx(styles.fit_content)}>
          <Text type="text1">Kontakt</Text>
          <Text type="text2">
            {"VipCore /1.0/api/findlibrary/{agencyId}/ -- branchPhone"}
          </Text>
          <Text type="text2">
            {"VipCore /1.0/api/findlibrary/{agencyId}/ -- branchEmail"}
          </Text>
          <Text type="text2">Svar på danbib-bestillinger hvor?????</Text>
        </div>
      </LocalizationsBase.Information>
    </LocalizationsBase>
  );
}

export default BranchDetails;
