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
 * translateButtonTxt iterates through the transtextAboveButtonlationsForButtonText,
 *  which consists of the translations used for rendering in JSX
 *  returns null if the translationMap is only false
 * @param {Array<Boolean>} translationMap
 * @param {Array<Object>} access
 * @returns {string|*|null}
 */
function translateButtonTxt(translationMap, access) {
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

  const index = translationMap.findIndex((caseCheck) => caseCheck);

  return index !== -1 ? translationForButtonText[index]() : null;
}

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

  const translationMap = [
    Boolean(access?.[0]?.url),
    isPeriodicaLike,
    access?.[0]?.loanIsPossible ||
      checkRequestButtonIsTrue({ manifestations: selectedMaterial }),
  ];

  return (
    access?.[0]?.id !== null &&
    translateButtonTxt(translationMap, access) !== null && (
      <Text
        dataCy={"reservation-button-txt"}
        type="text3"
        skeleton={skeleton}
        lines={2}
      >
        {translateButtonTxt(translationMap, access)}
      </Text>
    )
  );
}
