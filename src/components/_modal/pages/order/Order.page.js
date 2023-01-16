import { useEffect, useMemo, useState } from "react";
import { useMutate } from "@/lib/api/api";
import Top from "../base/top";
import data from "./dummy.data";
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
import { onMailChange } from "@/components/_modal/pages/order/utils";

/**
 *  Order component function
 *
 * @param {*} param0
 * @returns JSX.Element
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

  // Sets if user has unsuccessfully tried to submit the order
  const [failedSubmission, setFailedSubmission] = useState(false);

  const [mail, setMail] = useState(null);
  // Update email from user account
  useEffect(() => {
    const userMail = user?.userParameters?.userMail;
    if (userMail) {
      const message = null;
      setMail({
        value: userMail,
        valid: { status: true, message },
      });
    }
  }, [user?.userParameters]);

  function updateModal() {
    if (modal && modal.isVisible) {
      // call update if data or isLoading is changed
      if (articleOrderMutation?.isLoading || articleOrderMutation?.data) {
        modal.update(modal.index(), { articleOrder: articleOrderMutation });
      } else if (orderMutation.isLoading || orderMutation.data) {
        modal.update(modal.index(), { order: orderMutation });
      }
    }
  }

  // An order has successfully been submitted
  useEffect(() => {
    updateModal();
  }, [
    orderMutation?.data,
    orderMutation?.isLoading,
    articleOrderMutation?.data,
    articleOrderMutation?.isLoading,
  ]);

  const { isPeriodicaLike, availableAsDigitalCopy } = useMemo(() => {
    return accessTypeInfo;
  }, [accessTypeInfo]);

  const validated = useMemo(() => {
    const hasMail = !!mail?.valid?.status;
    const hasBranchId = !!pickupBranch?.branchId;
    const hasPid = !!pid;
    const requireYear = !!isPeriodicaLike;
    const hasYear = !!context?.periodicaForm?.publicationDateOfComponent;

    const status =
      hasMail && hasBranchId && hasPid && (requireYear ? hasYear : true);

    const details = {
      hasMail: {
        status: hasMail,
        value: mail?.value,
        message: mail?.valid?.message,
      },
      hasBranchId: { status: hasBranchId },
      hasPid: { status: hasPid },
      requireYear: {
        status: hasYear,
        message: requireYear && !hasYear && { label: "require-year" },
      },
    };

    return { status, hasTry: failedSubmission, details };
  }, [
    mail,
    pid,
    pickupBranch,
    failedSubmission,
    context?.periodicaForm?.publicationDateOfComponent,
  ]);

  const contextWithOrderPids = { ...context, orderPids };

  return (
    <div
      className={`${styles.order} ${isLoadingBranches ? styles.skeleton : ""}`}
    >
      <Top
        title={context?.title}
        className={{
          top: styles.top,
        }}
      />
      <Edition
        context={contextWithOrderPids}
        singleManifestation={singleManifestation}
      />
      <LocalizationInformation context={context} />
      {user && <BlockedUserInformation />}
      <OrdererInformation
        context={context}
        validated={validated}
        failedSubmission={failedSubmission}
        onSetMailDirectly={(e, valid) =>
          setMail({ value: e?.target?.value, valid })
        }
        onMailChange={(e, valid) =>
          onMailChange(e?.target?.value, valid, updateLoanerInfo, setMail)
        }
      />
      <OrderConfirmationButton
        context={context}
        validated={validated}
        failedSubmission={failedSubmission}
        onClick={() => {
          if (validated.status) {
            modal.push("receipt", {
              pid,
              order: {
                data: orderMutation.data,
                error: orderMutation.error,
                isLoading: orderMutation.isLoading,
              },
              articleOrder: {
                data: articleOrderMutation?.data,
                error: articleOrderMutation?.error,
                isLoading: articleOrderMutation?.isLoading,
              },
              pickupBranch,
            });
            if (availableAsDigitalCopy) {
              onArticleSubmit(
                pid,

                context?.periodicaForm
              );
            } else {
              onSubmit &&
                onSubmit(orderPids, pickupBranch, context?.periodicaForm);
            }
          } else {
            setFailedSubmission(true);
          }
        }}
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
 * @returns {JSX.Element}
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

  useEffect(() => {
    if (context?.pid?.length > 0) {
      // When order modal opens, we reset previous order status
      // making it possible to order a manifestation multiple times
      orderMutation.reset();
      articleOrderMutation.reset();
      setPid(context.pid);
    }
  }, [context.pid]);

  const { userInfo, pickupBranchInfo, accessTypeInfo, workResponse } =
    useOrderPageInformation(
      context?.workId,
      context?.pid?.[0],
      context?.periodicaForm
    );

  const { loanerInfo, updateLoanerInfo } = userInfo;

  const {
    data: workData,
    isLoading: isWorkLoading,
    isSlow,
    error,
  } = workResponse;

  const singleManifestation =
    context.orderType && context.orderType === "singleManifestation";

  const orderPids = context?.pids;

  if (isWorkLoading) {
    return <OrderSkeleton isSlow={isSlow} />;
  }

  if (error || !workData?.work) {
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
      onArticleSubmit={(pid, pickUpBranch, periodicaForm = {}) =>
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
