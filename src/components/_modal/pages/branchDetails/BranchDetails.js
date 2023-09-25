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
import BranchDetailsStatus from "@/components/_modal/pages/branchDetails/branchDetailsStatus/BranchDetailsStatus";
import { useSingleBranch } from "@/components/hooks/useHandleAgencyAccessData";
import isEmpty from "lodash/isEmpty";
import * as PropTypes from "prop-types";

function OpeningHours({ singleBranch }) {
  return (
    <div className={cx(styles.fit_content, styles.path_blue)}>
      <Text type="text1">Åbningstider</Text>
      {!isEmpty(singleBranch?.branchWebsiteUrl) ? (
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
      ) : !isEmpty(singleBranch?.openingHours) ? (
        <Text type="text2">{singleBranch.openingHours}</Text>
      ) : (
        <Text type="text2">
          {Translate({
            context: "localizations",
            label: "no_information_about_opening_hours",
          })}
        </Text>
      )}
    </div>
  );
}

OpeningHours.propTypes = { singleBranch: PropTypes.any };

function Address({ singleBranch }) {
  return (
    <div className={cx(styles.fit_content, styles.path_blue)}>
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
  );
}

Address.propTypes = { singleBranch: PropTypes.any };

function ContactInformation({}) {
  return (
    <div className={cx(styles.fit_content, styles.path_blue)}>
      <Text type="text1">Kontakt</Text>
      <Text type="text2">
        {"VipCore /1.0/api/findlibrary/{agencyId}/ -- branchPhone"}
      </Text>
      <Text type="text2">
        {"VipCore /1.0/api/findlibrary/{agencyId}/ -- branchEmail"}
      </Text>
      <Text type="text2">Svar på danbib-bestillinger hvor?????</Text>
    </div>
  );
}

function BranchDetails({ context }) {
  const { pids: pids, branchId } = context;

  const { agenciesFlatSorted } = useSingleBranch({
    pids: pids,
    branchId: branchId,
  });

  const singleBranch = agenciesFlatSorted?.[0]?.branches?.[0];

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
    const itemsWithPid = singleBranch?.holdingItems?.filter((item) =>
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
  const workId = workIds?.[0];

  if (workIds.length !== 1) {
    return (
      <div>
        Error: Der burde være præcis 1 workId, men der er {workIds.length}
      </div>
    );
  }

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
        <div aria-hidden={true} className={styles.padding_element_pt_two} />
        <BranchDetailsStatus
          library={singleBranch}
          pickupAllowed={singleBranch?.pickupAllowed}
          manifestations={manifestations}
          pids={pids}
        />
      </LocalizationsBase.Information>
      {!singleBranch?.pickupAllowed ? (
        <LocalizationsBase.HighlightedArea>
          <Text type={"text2"}>
            {Translate({
              context: "localizations",
              label: "obs_not_orders_to_here",
            })}
          </Text>
        </LocalizationsBase.HighlightedArea>
      ) : (
        <LocalizationsBase.Information
          className={cx(styles.reservationButton_container)}
        >
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
        </LocalizationsBase.Information>
      )}
      <LocalizationsBase.Information>
        <Title type={"title6"} className={cx(styles.about_the_branch)}>
          {Translate({ context: "localizations", label: "about_the_branch" })}
        </Title>
        <OpeningHours singleBranch={singleBranch} />
        <Address singleBranch={singleBranch} />
        <ContactInformation />
      </LocalizationsBase.Information>
    </LocalizationsBase>
  );
}

export default BranchDetails;
