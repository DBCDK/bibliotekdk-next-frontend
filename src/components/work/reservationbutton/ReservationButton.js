import Button from "@/components/base/button/Button";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import styles from "./ReservationButton.module.css";
import { useModal } from "@/components/_modal";
import { LOGIN_MODE } from "@/components/_modal/pages/login/utils";
import {
  constructButtonText,
  context,
  handleGoToLogin,
} from "@/components/work/reservationbutton/utils";
import { useMemo } from "react";
import { openOrderModal } from "@/components/work/utils";
import { useGetManifestationsForOrderButton } from "@/components/hooks/useWorkAndSelectedPids";
import {
  accessFactory,
  checkDigitalCopy,
  checkPhysicalCopy,
} from "@/lib/accessFactoryUtils";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";
import { openLoginModal } from "@/components/_modal/pages/login/utils";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import useBookmarks, {
  usePopulateBookmarks,
} from "@/components/hooks/useBookmarks";
import { getBookmarkKey } from "@/components/work/overview/bookmarkDropdown/BookmarkDropdown";
import {
  formatMaterialTypesToCode,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";

function TextAboveButton({ access, isAuthenticated }) {
  return (
    (access?.[0]?.loginRequired ||
      access?.[0]?.__typename === "InfomediaService") &&
    !isAuthenticated && (
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

/**
 *
 * @param {string} workId
 * @param {Array.<string>} selectedPids
 * @param {boolean} singleManifestation
 * @param {string} buttonType
 * @param {string} size
 * @param {string} shortText
 * @param {string|null} overrideButtonText
 * @param {string} className
 * @param {any} handleOrderFinished
 * @returns {JSX.Element}
 * @constructor
 */
function ReservationButtonWrapper({
  workId,
  selectedPids,
  singleManifestation = false,
  buttonType = "primary",
  size = "large",
  shortText,
  overrideButtonText = null,
  className,
  handleOrderFinished = undefined,
  useMultiOrder = false,
}) {
  const { isAuthenticated } = useAuthentication();
  const { loanerInfo, isLoading } = useLoanerInfo();
  const modal = useModal();

  const hasDigitalAccess = loanerInfo?.rights?.digitalArticleService;

  const { workResponse, manifestations, manifestationsResponse } =
    useGetManifestationsForOrderButton(workId, selectedPids);

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

  /** FAKE A MULTIORDER **/

  const { uniqueMaterialTypes } = useMemo(() => {
    return manifestationMaterialTypeFactory(manifestations);
  }, [manifestations]);

  const { getABookMark } = useBookmarks();
  const fakeBookmark = getABookMark({
    materialId: workId,
    materialType: formatMaterialTypesToCode(uniqueMaterialTypes[0]),
    workId: workId,
    title: "",
  });

  fakeBookmark.key = getBookmarkKey({
    materialId: workId,
    materialTypes: uniqueMaterialTypes[0],
  });

  // @TODO when ordering works we need a way to tell bookmarks to set a status (handleOrderFinished)
  const bookmarks = usePopulateBookmarks([fakeBookmark]);
  const multiordercontext = () => {
    return {
      sortType: "createdAt",
      bookmarksToOrder: bookmarks?.data,
      handleOrderFinished: handleOrderFinished,
    };
  };
  /** END FAKE MULTIORDER **/

  if (
    !workId ||
    !selectedPids ||
    !workResponse?.data ||
    !manifestationsResponse?.data ||
    manifestationsResponse?.isLoading ||
    workResponse?.isLoading ||
    isLoading
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
      isAuthenticated={isAuthenticated}
      buttonType={buttonType}
      size={size}
      pids={pids}
      shortText={shortText}
      singleManifestation={singleManifestation}
      allEnrichedAccesses={allEnrichedAccesses}
      workId={workId}
      overrideButtonText={overrideButtonText}
      modal={modal}
      handleOrderFinished={handleOrderFinished}
      multiorderContext={useMultiOrder ? multiordercontext() : null}
    />
  );
}

export default ReservationButtonWrapper;

/**
 * For testing purpose we separate the rendered button from the skeleton
 * to be able to give mocked access obj to button
 * @param {Object} access
 * @param {Object} user
 * @param {string} buttonType
 * @param {string} size
 * @param {Array.<string>} pids
 * @param {boolean} singleManifestation
 * @param {Array.<Object.<string, any>>} allEnrichedAccesses
 * @param {string} workId
 * @param {string|null} overrideButtonText
 * @returns {React.JSX.Element}
 */
export const ReservationButton = ({
  access, //TODO same as allEnrichedAccesses?
  isAuthenticated,
  isGuestUser,
  buttonType,
  size,
  pids,
  singleManifestation,
  shortText = false, // Shorten material text
  allEnrichedAccesses, //TODO same as access?
  workId,
  overrideButtonText = null,
  modal,
  handleOrderFinished = undefined,
  multiorderContext = undefined,
}) => {
  const physicalCopy = checkPhysicalCopy([access?.[0]])?.[0]; //TODO why do we check all accesses if only one is used in the end?
  const digitalCopy = checkDigitalCopy([access?.[0]])?.[0]; //TODO why do we check all accesses if only one is used in the end?

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
    onClick: () => handleGoToLogin(modal, access, isAuthenticated),
  };

  async function handleOpenLoginAndAddOrderModalToStore() {
    //add order modal to store, to be able to access when coming back from adgangsplatform/mitid
    const orderModalProps = {
      pids: pids,
      selectedAccesses: allEnrichedAccesses,
      workId: workId,
      singleManifestation: singleManifestation,
      handleOrderFinished: handleOrderFinished,
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
    skeleton: isEmpty(access),
    dataCy: `button-order-overview-enabled`,
    onClick: () => {
      isAuthenticated || isGuestUser
        ? openOrderModal({
            modal: modal,
            pids: pids,
            selectedAccesses: allEnrichedAccesses,
            workId: workId,
            singleManifestation: singleManifestation,
            storeLoanerInfo: true, // user is already logged in, we want to keep that
            handleOrderFinished: handleOrderFinished,
            multiOrderContext: multiorderContext,
          })
        : handleOpenLoginAndAddOrderModalToStore();
    },
  };

  const loginRequiredText = Translate({
    context: "general",
    label: "bestil",
  });

  /**
   * Get props for the button based on the case scenario
   * @returns {Object} props and text for button
   */
  const getProps = () => {
    if (noSelectedManifestations) {
      return {
        props: noSelectedManifestationsProps,
        text: noSelectedManifestationsTxt,
        preferSecondary: false,
      };
    }

    //ACCESS_URL,INFOMEDIA,EREOL
    if (onlineMaterialWithoutLoginOrLoginAtUrl) {
      return {
        props: accessibleOnlineAndNoLoginProps,
        text: constructButtonText(
          access?.[0]?.workTypes,
          access?.[0]?.materialTypesArray,
          shortText
        ),
        preferSecondary: shortText, // Becomes secondary button if button links to material (not ordering)
      };
    }

    //DIGITAL_ARTICLE_SERVICE, INTER_LIBRARY_LOAN
    return {
      props: loginRequiredProps,
      text: loginRequiredText,
      preferSecondary: false,
    };
  };

  const { props, text, preferSecondary } = getProps();

  return (
    <>
      <TextAboveButton access={access} isAuthenticated={isAuthenticated} />

      <div className={styles.wrapper}>
        <Button
          type={preferSecondary ? "secondary" : buttonType}
          size={size}
          {...props}
        >
          {overrideButtonText ?? text}
        </Button>
      </div>
    </>
  );
};
