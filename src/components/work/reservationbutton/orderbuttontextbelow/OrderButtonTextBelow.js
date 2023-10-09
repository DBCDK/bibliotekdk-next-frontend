import { context, getBaseUrl } from "@/components/work/reservationbutton/utils";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Col from "react-bootstrap/Col";
import styles from "./OrderButtonTextBelow.module.css";
import isEmpty from "lodash/isEmpty";
import Skeleton from "@/components/base/skeleton";
import { useGetManifestationsForOrderButton } from "@/components/hooks/useWorkAndSelectedPids";
import {
  accessFactory,
  checkDigitalCopy,
  checkPhysicalCopy,
  getAreAccessesPeriodicaLike,
} from "@/lib/accessFactoryUtils";
import { AccessEnum } from "@/lib/enums";
import { useMemo } from "react";
import { useBranchUserAndHasDigitalAccess } from "@/components/work/utils";

/**
 * Set texts BELOW reservation button - also sets the text IN the button
 * For infomedia text is set ABOVE the button ( @see ReservationButton )
 * @param access list of access objects for all editions of same materialtype
 * @param skeleton
 * @returns {JSX.Element|null}
 */
function OrderButtonTextBelow({ access, skeleton }) {
  const physicalCopy = checkPhysicalCopy([access?.[0]])?.[0];
  const digitalCopy = checkDigitalCopy([access?.[0]])?.[0];
  const isPeriodicaLike = getAreAccessesPeriodicaLike([access?.[0]])?.[0];

  const caseScenarioMap = [
    Boolean(access?.[0]?.url),
    Boolean(isPeriodicaLike),
    Boolean(digitalCopy),
    Boolean(physicalCopy),
  ];

  const translationForButtonText = [
    () => {
      return [
        Translate({ ...context, label: "onlineAccessAt" }),
        access?.[0]?.origin || getBaseUrl(access?.[0]?.url),
      ].join(" ");
    },
    () =>
      Translate({
        context: "options",
        label: "periodica-link-description",
      }),
    () => Translate({ ...context, label: "addToCart-line2" }),
    () => Translate({ ...context, label: "addToCart-line1" }),
  ];

  const index = caseScenarioMap.findIndex((caseCheck) => caseCheck);

  return (
    index > -1 &&
    access?.[0]?.id !== null &&
    translationForButtonText?.[index] !== null && (
      <Col xs={12} className={styles.info}>
        <Text
          dataCy={"reservation-button-txt"}
          type="text3"
          skeleton={skeleton}
          lines={2}
        >
          {translationForButtonText?.[index]?.()}
        </Text>
      </Col>
    )
  );
}

export default function Wrap({ workId, selectedPids, skeleton }) {
  const { workResponse, manifestations, manifestationsResponse } =
    useGetManifestationsForOrderButton(workId, selectedPids);

  const { branchIsLoading, hasDigitalAccess } =
    useBranchUserAndHasDigitalAccess(selectedPids);

  const { getAllAllowedEnrichedAccessSorted } = useMemo(
    () => accessFactory(manifestations),
    [manifestations]
  );

  const access = useMemo(
    () => getAllAllowedEnrichedAccessSorted(hasDigitalAccess),
    [workResponse?.data?.work, manifestations, hasDigitalAccess]
  );

  if (
    isEmpty(access) ||
    access?.[0]?.__typename === AccessEnum.INFOMEDIA_SERVICE
  ) {
    return null;
  }

  if (manifestationsResponse?.isLoading || branchIsLoading) {
    return (
      <Skeleton
        lines={1}
        className={styles.skeletonstyle}
        isSlow={manifestationsResponse?.isSlow}
      />
    );
  }

  return <OrderButtonTextBelow access={access} skeleton={skeleton} />;
}
