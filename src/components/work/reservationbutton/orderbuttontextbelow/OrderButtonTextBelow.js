import { context, getBaseUrl } from "@/components/work/reservationbutton/utils";
import { getIsPeriodicaLike } from "@/lib/utils";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Col from "react-bootstrap/Col";
import styles from "./OrderButtonTextBelow.module.css";
import { uniq } from "lodash";
import Skeleton from "@/components/base/skeleton";
import { useGetManifestationsForOrderButton } from "@/components/hooks/useWorkAndSelectedPids";
import { accessUtils } from "@/lib/accessFactory";
import { AccessEnum } from "@/lib/enums";
import { useMemo } from "react";

/**
 * Set texts BELOW reservation button - also sets the text IN the button
 * For infomedia text is set ABOVE the button ( @see ReservationButton )
 * @param work
 * @param skeleton
 *
 * @return {JSX.Element|null}
 * @constructor
 */
export function OrderButtonTextBelow({ manifestations, skeleton }) {
  const { allEnrichedAccesses: access } = useMemo(() => {
    return accessUtils(manifestations);
  }, [manifestations]);

  const workTypes = uniq(
    manifestations?.flatMap((manifestation) => manifestation?.workTypes)
  );

  const materialTypes = uniq(
    manifestations?.flatMap((manifestation) =>
      manifestation?.materialTypes?.map((materialType) => materialType.specific)
    )
  );

  const isPeriodicaLike = getIsPeriodicaLike(workTypes, materialTypes);

  if (access?.[0]?.__typename === AccessEnum.INFOMEDIA_SERVICE) {
    return null;
  }

  // @TODO infomedia
  const caseScenarioMap = [
    Boolean(access?.[0]?.url),
    Boolean(isPeriodicaLike),
    Boolean(access?.[0]?.loanIsPossible),
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
  const { manifestations, manifestationsResponse } =
    useGetManifestationsForOrderButton(workId, selectedPids);

  if (manifestationsResponse?.isLoading) {
    return (
      <Skeleton
        lines={1}
        className={styles.skeletonstyle}
        isSlow={manifestationsResponse?.isSlow}
      />
    );
  }

  return (
    <OrderButtonTextBelow manifestations={manifestations} skeleton={skeleton} />
  );
}
