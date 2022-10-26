import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import {
  checkRequestButtonIsTrue,
  context,
  getBaseUrl,
  selectMaterial,
  selectMaterialBasedOnType,
} from "@/components/work/reservationbutton/utils";
import { getIsPeriodicaLike } from "@/lib/utils";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

/**
 * Set texts BELOW reservation button - also sets the text IN the button
 * For infomedia text is set ABOVE the button ( @see ReservationButton )
 * @param skeleton
 * @param workId
 * @param type
 *
 * @return {JSX.Element|null}
 * @constructor
 */
export function OrderButtonTextBelow({ workId, type, skeleton }) {
  const { data } = useData(workId && workFragments.buttonTxt({ workId }));

  const selectedMaterial = selectMaterialBasedOnType(
    data?.work?.manifestations?.all,
    type
  );

  if (!selectedMaterial) {
    return null;
  }

  const isPeriodicaLike = getIsPeriodicaLike(
    data?.work?.workTypes,
    data?.work?.materialTypes
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
    access?.[0]?.id !== null &&
    translationForButtonText[index] !== null && (
      <Text
        dataCy={"reservation-button-txt"}
        type="text3"
        skeleton={skeleton}
        lines={2}
      >
        {translationForButtonText[index]()}
      </Text>
    )
  );
}
