import { useEffect, useMemo, useState } from "react";
import { useMutate } from "@/lib/api/api";
import Top from "../base/top";
import data from "./dummy.data";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./Order.module.css";
import Edition from "@/components/_modal/pages/edition/Edition";
import {
  handleSubmitOrder,
  handleSubmitPeriodicaArticleOrder,
} from "@/components/_modal/utils";
import LocalizationInformation from "@/components/_modal/pages/order/localizationinformation/LocalizationInformation";
import OrdererInformation from "@/components/_modal/pages/order/ordererinformation/OrdererInformation";
import OrderConfirmationButton from "@/components/_modal/pages/order/orderconfirmationbutton/OrderConfirmationButton";
import BlockedUserInformation from "@/components/_modal/pages/order/blockeduserinformation/BlockedUserInformation";
import * as PropTypes from "prop-types";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";
import {
  onMailChange,
  workHasAlreadyBeenOrdered,
} from "@/components/_modal/pages/order/utils/order.utils";
import { useRelevantAccessesForOrderPage } from "@/components/work/utils";
import { validateEmail } from "@/utils/validateEmail";
import NoAgenciesError from "./noAgencies/NoAgenciesError";
import useUser from "@/components/hooks/useUser";
import * as branchesFragments from "@/lib/api/branches.fragments";
import { useData } from "@/lib/api/api";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import { stringify } from "@/components/_modal/utils";
import isEmpty from "lodash/isEmpty";

/**
 *  Order component function
 *
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
function Order({
  pid,
  orderPids,
  accessTypeInfo = {},
  updateLoanerInfo,
  pickupBranchInfo = {},
  orderMutation,
  articleOrderMutation,
  onArticleSubmit,
  onSubmit,
  // new modal props
  context,
  modal,
  singleManifestation = false,
}) {
  const {
    pickupBranchUser: user,
    pickupBranch,
    isLoadingBranches = false,
  } = pickupBranchInfo;

  const { authUser } = useUser();
  const { isAuthenticated } = useAuthentication();
  const { loanerInfo } = useLoanerInfo();

  const pickUpAgencyInfo = useData(
    loanerInfo?.pickupBranch &&
      branchesFragments.checkBlockedUser({ branchId: loanerInfo.pickupBranch })
  );

  // Check if user is blocked from ordering
  const borrowerStatus = pickUpAgencyInfo?.data?.branches?.borrowerStatus;
  const userMayNotBorrow = borrowerStatus && !borrowerStatus.allowed;

  // Check if library has a borrower check
  const borrowerCheck =
    pickUpAgencyInfo?.data?.branches?.result[0].borrowerCheck;

  const branches = pickUpAgencyInfo?.data?.branches;
  const showBlockedUserInfo =
    borrowerCheck && (userMayNotBorrow || !authUser || !isAuthenticated);

  // Sets if user has unsuccessfully tried to submit the order
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [mail, setMail] = useState(null);
  const contextWithOrderPids = { ...context, orderPids };
  const workId = context?.workId;
  const hasAlreadyBeenOrdered = workHasAlreadyBeenOrdered(workId);
  //If user wants to order again, but closes modal before ordering, we want to show warning again
  const [showAlreadyOrdered, setShowAlreadyOrdered] = useState(
    hasAlreadyBeenOrdered
  );

  //always show acutal value of duplicate order warning again of hasAlreaydBeenOrdered, when we open modal.
  useEffect(() => {
    if (!modal || isEmpty(modal)) return;
    const orderModalIdx = modal?.index("order");
    if (modal?.index("order") > -1 && modal.stack[orderModalIdx].active) {
      setShowAlreadyOrdered(hasAlreadyBeenOrdered);
    }
  }, [stringify(modal?.stack)]);

  // Update email from user account
  useEffect(() => {
    const userMail = user?.userParameters?.userMail;
    const status = validateEmail(userMail);
    setMail({
      value: userMail,
      valid: {
        status: status,
        message: status
          ? null
          : {
              context: "form",
              label: "wrong-email-field",
            },
      },
    });
  }, [user?.userParameters]);

  function updateModal() {
    if (modal && modal.isVisible) {
      // call update if data or isLoading or error has changed
      if (
        articleOrderMutation?.isLoading ||
        articleOrderMutation?.data ||
        articleOrderMutation?.error
      ) {
        modal.update(modal.index(), { articleOrder: articleOrderMutation });
      } else if (
        orderMutation?.isLoading ||
        orderMutation?.data ||
        orderMutation?.error
      ) {
        modal.update(modal.index(), { order: orderMutation });
      }
    }
  }

  // An order has successfully been submitted
  useEffect(() => {
    updateModal();
  }, [orderMutation?.isLoading, articleOrderMutation?.isLoading]);

  const { isPeriodicaLike, availableAsDigitalCopy } = useMemo(() => {
    return accessTypeInfo;
  }, [accessTypeInfo]);

  const validated = useMemo(() => {
    const hasMail = !!mail?.valid?.status;
    const hasBranchId = !!pickupBranch?.branchId;
    const hasPid = !!pid;
    const requireYear = !!isPeriodicaLike;
    const hasYear = !!context?.periodicaForm?.publicationDateOfComponent;
    const firstOrder = !showAlreadyOrdered || isPeriodicaLike; //TODO currently we only check for non-periodica orders

    const status =
      hasMail &&
      hasBranchId &&
      hasPid &&
      (requireYear ? hasYear : true) &&
      firstOrder;

    const details = {
      hasMail: {
        status: hasMail,
        value: mail?.value,
        message: mail?.valid?.message,
      },
      firstOrder: {
        status: firstOrder,
        message: showAlreadyOrdered &&
          !isPeriodicaLike && { label: "alreadyOrderedText" }, //TODO currently we only check for non-periodica orders
      },
      hasBranchId: { status: hasBranchId },
      hasPid: { status: hasPid },
      requireYear: {
        status: hasYear,
        message: requireYear && !hasYear && { label: "require-year" },
      },
    };

    return { status, hasTry: hasValidationErrors, details };
  }, [
    mail,
    pid,
    pickupBranch,
    hasValidationErrors,
    context?.periodicaForm?.publicationDateOfComponent,
  ]);

  function onSubmitOrder() {
    if (validated.status) {
      modal.push("receipt", {
        pids: orderPids,
        workId: workId,
        order: {
          data: orderMutation?.data,
          error: orderMutation?.error,
          isLoading: orderMutation?.isLoading,
        },
        articleOrder: {
          data: articleOrderMutation?.data,
          error: articleOrderMutation?.error,
          isLoading: articleOrderMutation?.isLoading,
        },
        pickupBranch,
      });
      if (availableAsDigitalCopy) {
        onArticleSubmit(pid, context?.periodicaForm);
      } else {
        onSubmit && onSubmit(orderPids, pickupBranch, context?.periodicaForm);
      }
    } else {
      setHasValidationErrors(true);
    }
  }

  return (
    <div
      className={`${styles.order} ${isLoadingBranches ? styles.skeleton : ""}`}
    >
      <Top
        title={context?.title}
        back={context?.back}
        className={{
          top: styles.top,
        }}
      />
      <Edition
        context={contextWithOrderPids}
        singleManifestation={singleManifestation}
        isMaterialCard={true}
        showAlreadyOrdered={showAlreadyOrdered}
        setShowArealdyOrdered={setShowAlreadyOrdered}
      />
      <LocalizationInformation context={context} />
      {user && showBlockedUserInfo && (
        <BlockedUserInformation
          statusCode={borrowerStatus?.statusCode}
          branches={branches}
        />
      )}
      <OrdererInformation
        context={context}
        validated={validated}
        hasValidationErrors={hasValidationErrors}
        onMailChange={(e, valid) => {
          onMailChange(e?.target?.value, valid, updateLoanerInfo, setMail);
        }}
      />
      <OrderConfirmationButton
        context={context}
        validated={validated}
        hasValidationErrors={hasValidationErrors}
        onClick={onSubmitOrder}
        blockedForBranch={borrowerCheck && !borrowerStatus?.allowed}
        hasAlreadyBeenOrdered={showAlreadyOrdered && !isPeriodicaLike} //TODO currently we only check for non-periodica orders
      />
    </div>
  );
}

Order.propTypes = {
  pid: PropTypes.any,
  orderPids: PropTypes.arrayOf(PropTypes.string),
  accessTypeInfo: PropTypes.object,
  updateLoanerInfo: PropTypes.func,
  pickupBranchInfo: PropTypes.object,
  context: PropTypes.object,
  modal: PropTypes.any,
  singleManifestation: PropTypes.bool,
  orderMutation: PropTypes.any,
  articleOrderMutation: PropTypes.any,
  onArticleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
};

export function OrderSkeleton(props) {
  const { work, user, order } = data;

  return (
    <Order
      pid="some-pid"
      work={work}
      user={user}
      orderMutation={order}
      articleOrderMutation={order}
      context={{ label: "title-order" }}
      modal={{}}
      className={`${props.className} ${styles.skeleton}`}
      isLoading={true}
      singleManifestation={props.singleManifestation}
    />
  );
}

/**
 * Wrap is a react component responsible for loading
 * data and displaying the right variant of the component
 *
 * @param {Object} props Component props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap(props) {
  // context
  const { context, modal } = props;
  context.pids = context?.pids || [context?.pid];
  context.pid = context?.pid || context?.pids?.[0];

  // internal pid state -> used to reset modal
  const [pid, setPid] = useState(null);
  const orderMutation = useMutate();
  const articleOrderMutation = useMutate();
  const { loanerInfo, updateLoanerInfo } = useLoanerInfo();

  useEffect(() => {
    if (context?.pid?.length > 0) {
      // When order modal opens, we reset previous order status
      // making it possible to order a manifestation multiple times
      orderMutation.reset();
      articleOrderMutation.reset();
      setPid(context.pid);
    }
  }, [context.pid]);

  const { pickupBranchInfo, accessTypeInfo } = useOrderPageInformation({
    workId: context?.workId,
    periodicaForm: context?.periodicaForm,
    pids: context?.pids,
  });

  const { allowedAccessesByTypeName, manifestationResponse } =
    useRelevantAccessesForOrderPage(context?.pids);

  const digitalArticleServiceAccess =
    allowedAccessesByTypeName?.digitalArticleServiceAccesses;

  const interLibraryLoanAccess =
    digitalArticleServiceAccess?.length > 0
      ? []
      : allowedAccessesByTypeName?.interLibraryLoanAccesses;

  const orderPids = [
    ...digitalArticleServiceAccess,
    ...interLibraryLoanAccess,
  ]?.map((singleAccess) => singleAccess.pid);

  context.selectedAccesses = [
    ...digitalArticleServiceAccess,
    ...interLibraryLoanAccess,
  ];

  const singleManifestation =
    context.orderType && context.orderType === "singleManifestation";

  const {
    data: manifestationData,
    isLoading: isManifestationsLoading,
    isSlow: isManifestationsSlow,
    error: manifestationError,
  } = manifestationResponse;

  if (isManifestationsLoading || loanerInfo?.isLoading) {
    return <OrderSkeleton isSlow={isManifestationsSlow} />;
  }
  // check if user logged in via mitId - and has no connection to any libraries
  if (!loanerInfo?.pickupBranch && !loanerInfo?.agencies?.length) {
    return <NoAgenciesError />;
  }

  if (manifestationError || !manifestationData?.manifestations) {
    return <div>Error :( !!!!!</div>;
  }

  return (
    <Order
      pid={pid}
      orderPids={orderPids}
      accessTypeInfo={accessTypeInfo}
      updateLoanerInfo={updateLoanerInfo}
      pickupBranchInfo={pickupBranchInfo}
      context={context}
      modal={modal}
      singleManifestation={singleManifestation}
      orderMutation={orderMutation}
      articleOrderMutation={articleOrderMutation}
      onArticleSubmit={(pid, periodicaForm = {}) =>
        handleSubmitPeriodicaArticleOrder(
          pid,
          periodicaForm,
          loanerInfo,
          articleOrderMutation
        )
      }
      onSubmit={(pids, pickupBranch, periodicaForm = {}) =>
        handleSubmitOrder(
          pids,
          pickupBranch,
          periodicaForm,
          loanerInfo,
          orderMutation
        )
      }
    />
  );
}
