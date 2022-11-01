import * as workFragments from "@/lib/api/work.fragments";
import {
  checkRequestButtonIsTrue,
  context,
  getBaseUrl,
  selectMaterial,
} from "@/components/work/reservationbutton/utils";
import { getIsPeriodicaLike } from "@/lib/utils";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { useWorkFromSelectedPids } from "@/components/hooks/useWorkAndSelectedPids";
import { Col } from "react-bootstrap";
import styles from "./OrderButtonTextBelow.module.css";

/**
 * Set texts BELOW reservation button - also sets the text IN the button
 * For infomedia text is set ABOVE the button ( @see ReservationButton )
 * @param work
 * @param skeleton
 *
 * @return {JSX.Element|null}
 * @constructor
 */
export function OrderButtonTextBelow({ work, skeleton }) {
  const selectedMaterial = work?.manifestations?.all;

  if (!selectedMaterial) {
    return null;
  }

  const isPeriodicaLike = getIsPeriodicaLike(
    work?.workTypes,
    work?.materialTypes
  );

  const selectedManifestations = selectMaterial(selectedMaterial);

  const access = selectedManifestations?.access;

  const caseScenarioMap = [
    Boolean(access?.[0]?.url),
    Boolean(isPeriodicaLike),
    Boolean(
      access?.[0]?.loanIsPossible ||
        checkRequestButtonIsTrue({ manifestations: selectedMaterial })
    ),
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
    index !== -1 &&
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
  const workFragment = workId && workFragments.buttonTxt({ workId });

  const work = useWorkFromSelectedPids(workFragment, selectedPids);

  return <OrderButtonTextBelow work={work} skeleton={skeleton} />;
}
