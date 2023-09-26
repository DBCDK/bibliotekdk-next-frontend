import useUser from "@/components/hooks/useUser";
import Button from "@/components/base/button/Button";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import styles from "./ReservationButton.module.css";
import { useModal } from "@/components/_modal";
import { LOGIN_MODE } from "@/components/_modal/pages/login/utils";
import {
  context,
  handleGoToLogin,
  isOnlineTranslator,
  workTypeTranslator,
} from "@/components/work/reservationbutton/utils";
import { useMemo } from "react";
import {
  openOrderModal,
  useBranchUserAndHasDigitalAccess,
} from "@/components/work/utils";
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

function ReservationButtonWrapper({
  workId,
  selectedPids,
  singleManifestation = false,
  buttonType = "primary",
  size = "large",
  overrideButtonText = null,
  className,
}) {
  const user = useUser();

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

  return (
    <ReservationButton
      access={access}
      user={user}
      buttonType={buttonType}
      size={size}
      pids={pids}
      singleManifestation={singleManifestation}
      allEnrichedAccesses={allEnrichedAccesses}
      workId={workId}
      overrideButtonText={overrideButtonText}
    />
  );
}

export default ReservationButtonWrapper;

/**
 * For testing purpose we separate the rendered button from the skeleton
 * to be able to give mocked access obj to button
 * @param {obj} access
 * @param {obj} user
 * @param {string} buttonType
 * @param {string} size
 * @param {[string]} pids
 * @param singleManifestation
 * @param allEnrichedAccesses
 * @param workId
 * @param overrideButtonText
 * @returns {JSX.Element}
 */
export const ReservationButton = ({
  access, //TODO same as allEnrichedAccesses?
  user,
  buttonType,
  size,
  pids,
  singleManifestation,
  allEnrichedAccesses, //TODO same as access?
  workId,
  overrideButtonText= null,
}) => {
  const modal = useModal();

  const physicalCopy = checkPhysicalCopy([access?.[0]])?.[0]; //TODO why do we check all accesses if only one is used in the end?
  const digitalCopy = checkDigitalCopy([access?.[0]])?.[0]; //TODO why do we check all accesses if only one is used in the end?

  const isOnlineTranslated = singleManifestation
    ? isOnlineTranslator(access?.[0]?.materialTypesArray)
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
    onClick: () => handleGoToLogin(modal, access, user),
  };
  const accessibleOnlineAndNoLoginText =
    Translate({
      context: "overview",
      label: "goto",
    }) +
    " " +
    (isOnlineTranslated || workTypeTranslated);

  async function handleOpenLoginAndOrderModal() {
    //add order modal to store, to be able to access when coming back from adgangsplatform/mitid?
    const orderModalProps = {
      pids: pids,
      selectedAccesses: allEnrichedAccesses,
      workId: workId,
      singleManifestation: singleManifestation,
    };

    const uid = await modal.saveToStore("order", {
      ...orderModalProps,
      storeLoanerInfo: true,
    });
    //open actual loginmodal
    openLoginModal({
      modal,
      mode: LOGIN_MODE.ORDER_PHYSICAL,
      //data used for FFU without adgangsplatform to open order modal directly
      ...orderModalProps,
      //callback used for adgangsplatform/mitid login to open order modal on redirect
      callbackUID: uid,
    });
  }

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
            storeLoanerInfo: true, // user is already logged in, we want to keep that
          })
        : handleOpenLoginAndOrderModal();
    },
  };

  const loginRequiredText = Translate({
    context: "general",
    label: "bestil",
  });

  /**
   * Get props for the button based on the case scenario
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
    <div className={styles.wrapper}>
      <TextAboveButton access={access} user={user} />
      <Button type={buttonType} size={size} {...props}>
        {overrideButtonText ?? text}
      </Button>
    </div>
  );
};
