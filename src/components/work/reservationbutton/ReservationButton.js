import useUser from "@/components/hooks/useUser";
import Button from "@/components/base/button/Button";
import Translate, { hasTranslation } from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import styles from "./ReservationButton.module.css";
import { useModal } from "@/components/_modal";
import { LOGIN_MODE } from "@/components/_modal/pages/login/utils";
import { context } from "@/components/work/reservationbutton/utils";
import { useMemo } from "react";
import {
  onOnlineAccess as goToRedirectUrl,
  openOrderModal,
  useBranchUserAndHasDigitalAccess,
} from "@/components/work/utils";
import { MaterialTypeEnum } from "@/lib/enums_MaterialTypes";
import { useGetManifestationsForOrderButton } from "@/components/hooks/useWorkAndSelectedPids";
import {
  accessFactory,
  checkDigitalCopy,
  checkPhysicalCopy,
} from "@/lib/accessFactoryUtils";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";
import { openLoginModal } from "@/components/_modal/pages/login/utils";

function TextAboveButton({ access, user }) {
  return (
    (access?.[0]?.loginRequired ||
      access?.[0]?.__typename === "InfomediaService") &&
    !user.isAuthenticated && (
      <Text
        type="text3"
        className={styles.textAboveButton}
        dataCy={"text-above-order-button"}
      >
        {Translate({ ...context, label: "url_login_required" })}
      </Text>
    )
  );
}

function isOnlineTranslator(materialTypeArray) {
  const overrideWithIsOnline =
    materialTypeArray?.filter((specificMaterialType) =>
      [MaterialTypeEnum.EBOG, MaterialTypeEnum["LYDBOG (NET)"]].includes(
        specificMaterialType
      )
    ).length > 0;

  return overrideWithIsOnline
    ? Translate({
        context: "workTypeDistinctForm",
        label: "isOnline",
      })
    : "";
}

export function workTypeTranslator(workTypes) {
  const workType = workTypes?.[0] || "fallback";
  return hasTranslation({
    context: "workTypeDistinctForm",
    label: workType.toLowerCase(),
  })
    ? Translate({
        context: "workTypeDistinctForm",
        label: workType.toLowerCase(),
      })
    : Translate({
        context: "workTypeDistinctForm",
        label: "fallback",
      });
}

function handleGoToLogin(access, user, modal) {
  // if this is an infomedia article it should open in same window
  const urlTarget = access[0]?.id ? "_self" : "_blank";

  // check if we should open login modal on click
  const goToLogin =
    user &&
    !user.isAuthenticated &&
    access[0]?.url && //TODO do we have to have url to ope login modal?
    access[0]?.loginRequired &&
    (access[0]?.url?.indexOf("ebookcentral") !== -1 ||
      access[0]?.url?.indexOf("ebscohost") !== -1);

  return goToLogin
    ? openLoginModal(modal, access[0]?.url)
    : goToRedirectUrl(access[0]?.url, urlTarget);
}

function ReservationButton({
  workId,
  selectedPids,
  singleManifestation = false,
  buttonType = "primary",
  size = "large",
  className,
}) {
  const user = useUser();
  const modal = useModal();

  const { workResponse, manifestations, manifestationsResponse } =
    useGetManifestationsForOrderButton(workId, selectedPids);

  const { branchIsLoading, hasDigitalAccess } =
    useBranchUserAndHasDigitalAccess(selectedPids);

  const { getAllAllowedEnrichedAccessSorted, allEnrichedAccesses } = useMemo(
    () => accessFactory(manifestations),
    [manifestations]
  );

  const access = useMemo(
    () => getAllAllowedEnrichedAccessSorted(hasDigitalAccess) || [],
    [workResponse?.data?.work, manifestations, hasDigitalAccess]
  );

  const pids = uniq(
    allEnrichedAccesses?.map((singleAccess) => singleAccess?.pid)
  );

  if (
    !workId ||
    !selectedPids ||
    !workResponse ||
    !manifestationsResponse ||
    manifestationsResponse?.isLoading ||
    workResponse?.isLoading ||
    branchIsLoading
  ) {
    return (
      <Button
        skeleton={true}
        type={buttonType}
        size={size}
        dataCy={"button-order-overview-loading"}
        className={className}
      >
        {"loading"}
      </Button>
    );
  }

  const physicalCopy = checkPhysicalCopy([access?.[0]])?.[0]; //TODO why do we check all accesses if only one is used in the end?
  const digitalCopy = checkDigitalCopy([access?.[0]])?.[0]; //TODO why do we check all accesses if only one is used in the end?

  const isOnlineTranslated = singleManifestation
    ? isOnlineTranslator(access?.[0]?.materialTypesArray, singleManifestation)
    : "";
  const workTypeTranslated = workTypeTranslator(access?.[0]?.workTypes);

  /** order button acts on following scenarios: */
  const caseScenarioMap = [
    /** (0) selectedManifestations does not exist for some reason */
    Boolean(isEmpty(access)),
    /** (1) material is accessible online (no user login or login will prompt at destination) -> go to online url
     * --- a. ACCESS_URL
     * --- b. INFOMEDIA
     * --- c. EREOL
     * */
    Boolean(access?.length > 0 && !digitalCopy && !physicalCopy),
    /** (2) material is available as loan either:
     * --- d. DIGITAL_ARTICLE_SERVICE
     * --- e. INTER_LIBRARY_LOAN
     * */
    true,
  ];

  const buttonPropsMap = [
    /* (0) */
    {
      dataCy: "button-order-overview-disabled",
      disabled: true,
    },
    /* (1) */
    {
      dataCy: "button-order-overview",
      onClick: () => handleGoToLogin(access),
    },
    /* (2) */
    {
      dataCy: `button-order-overview-enabled`,
      onClick: () => {
        user?.isLoggedIn
          ? openOrderModal({
              modal: modal,
              pids: pids,
              selectedAccesses: allEnrichedAccesses,
              workId: workId,
              singleManifestation: singleManifestation,
            })
          : openLoginModal({ modal, mode: LOGIN_MODE.ORDER_PHYSICAL });
      },
    },
  ];

  const buttonTxtMap = [
    /* (0) */
    () =>
      Translate({
        context: "overview",
        label: !physicalCopy ? "Order-online-disabled" : "Order-disabled",
      }),
    /* (1) */
    () =>
      [
        Translate({
          context: "overview",
          label: "goto",
        }),
        isOnlineTranslated || workTypeTranslated,
      ].join(" "),
    /* (2) */
    () => Translate({ context: "general", label: "bestil" }),
  ];

  // Set the index, buttonProps, and buttonTxt
  const index = caseScenarioMap.findIndex((caseCheck) => caseCheck);
  console.log("index", index);
  const buttonProps = {
    skeleton: buttonPropsMap[index].disabled ? null : !access,
    type: buttonType,
    size: size,
    ...buttonPropsMap[index],
  };

  return (
    <>
      <TextAboveButton access={access} user={user} />
      <Button {...buttonProps}>{buttonTxtMap[index]()}</Button>
    </>
  );
}

export default ReservationButton;
