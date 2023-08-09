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
  goToRedirectUrl,
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
    access[0]?.url &&
    access[0]?.loginRequired &&
    (access[0]?.url?.indexOf("ebookcentral") !== -1 ||
      access[0]?.url?.indexOf("ebscohost") !== -1);

  return goToLogin
    ? openLoginModal(modal, { originUrl: access[0]?.url })
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

  const noSelectedManifestations = Boolean(isEmpty(access));
  const onlineMaterialWithoutLoginOrLoginAtUrl = Boolean(
    access?.length > 0 && !digitalCopy && !physicalCopy
  );

  const noSelectedManifestationsProps = {
    dataCy: "button-order-overview-disabled",
    disabled: true,
  };
  const noSelectedManifestationsTxt = Translate({
    context: "overview",
    label: !physicalCopy ? "Order-online-disabled" : "Order-disabled",
  });

  const accessibleOnlineAndNoLoginProps = {
    skeleton: !access,
    dataCy: "button-order-overview",
    onClick: () => handleGoToLogin(access),
  };
  const accessibleOnlineAndNoLoginText =
    Translate({
      context: "overview",
      label: "goto",
    }) +
      " " +
      isOnlineTranslated || workTypeTranslated;

  const loginRequiredProps = {
    skeleton: !access,
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
  };
  const loginRequiredText = Translate({ context: "general", label: "bestil" });

  /**
   * get the props for the button based on the case scenario
   * @returns {object} props and text for button
   */
  const getProps = () => {
    if (noSelectedManifestations) {
      return {
        props: noSelectedManifestationsProps,
        text: noSelectedManifestationsTxt,
      };
    }

    //ACCESS_URL,INFOMEDIA,EREOL
    if (onlineMaterialWithoutLoginOrLoginAtUrl) {
      return {
        props: accessibleOnlineAndNoLoginProps,
        text: accessibleOnlineAndNoLoginText,
      };
    }

    //DIGITAL_ARTICLE_SERVICE, INTER_LIBRARY_LOAN
    return {
      props: loginRequiredProps,
      text: loginRequiredText,
    };
  };

  const { props, text } = getProps();
  return (
    <>
      <TextAboveButton access={access} user={user} />
      <Button type={buttonType} size={size} {...props}>
        {text}
      </Button>
    </>
  );
}

export default ReservationButton;
