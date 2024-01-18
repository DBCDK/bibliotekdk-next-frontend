import { useEffect, useState } from "react";

import merge from "lodash/merge";

import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import Progress from "@/components/base/progress";
import Icon from "@/components/base/icon";
import Title from "@/components/base/title";
import Text from "@/components/base/text";

import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";

import styles from "./Receipt.module.css";
import { useRouter } from "next/router";
import cx from "classnames";
import isEmpty from "lodash/isEmpty";
import Link from "@/components/base/link";
import {
  workHasAlreadyBeenOrdered,
  setAlreadyOrdered,
} from "@/components/_modal/pages/order/utils/order.utils";
import useAuthentication from "@/components/hooks/user/useAuthentication";

/**
 * Order Button
 */
export function Receipt({
  // modal props
  modal,
  context,
}) {
  // get props from context
  const { pickupBranch, order = {}, articleOrder = {}, workId } = context;
  const router = useRouter();
  const { hasCulrUniqueId } = useAuthentication();

  // Always show a 1s loader animation before receipt is visible.
  const [delay, setDelay] = useState(true);

  // order
  const {
    data: orderData,
    error: orderError,
    isLoading: orderIsLoading,
  } = order;

  const {
    data: articleOrderData,
    error: articleOrderError,
    isLoading: articleOrderIsLoading,
  } = articleOrder;

  // Define order status
  const isOrdering = orderIsLoading || articleOrderIsLoading || delay;
  const isOrdered =
    !!orderData?.submitOrder?.orderId ||
    articleOrderData?.elba?.placeCopyRequest?.status === "OK";

  // Define if order has failed
  let hasFailed = false,
    failedMessage = undefined;
  if (
    (orderData?.submitOrder && !orderData?.submitOrder?.ok) ||
    orderData?.submitOrder?.status === "UNKNOWN_ERROR" // answer can have ok === true, but still have status with "UNKNOWN_ERROR"
  ) {
    hasFailed = true;
    failedMessage = Translate({
      context: "receipt",
      label: orderData?.submitOrder?.status,
    });
  } else if (!!orderError || !!articleOrderError) {
    hasFailed = true;
    //error message doesnt help user, therefore, we dont show it
    //occurs f. ex, when invalid userParams are given to submitOrder
  } else if (
    articleOrderData?.elba?.placeCopyRequest &&
    articleOrderData?.elba?.placeCopyRequest?.status !== "OK"
  ) {
    hasFailed = true;
    failedMessage = Translate({
      context: "receipt",
      label: articleOrderData?.elba?.placeCopyRequest?.status,
    });
  }

  useEffect(() => {
    if (
      orderData?.submitOrder?.orderId &&
      workId &&
      !workHasAlreadyBeenOrdered(workId)
    ) {
      setAlreadyOrdered(workId);
    }
  }, [orderData?.submitOrder?.orderId]);

  // Branch name
  const branchName = pickupBranch?.name;

  // Loading animation duration
  const duration = articleOrderIsLoading ? 10 : 1;

  return (
    <div
      className={cx(styles.receipt, {
        [styles.ordered]: isOrdered && !delay,
        [styles.failed]: hasFailed && !delay,
      })}
    >
      <div className={styles.container}>
        <div className={`${styles.wrap} ${styles.progress}`}>
          <Progress
            className={styles.loader}
            start={isOrdering}
            callback={() => setDelay(false)}
            duration={duration}
            delay={1}
          />
        </div>

        <div className={`${styles.wrap} ${styles.result}`}>
          {!hasFailed && (
            <div className={styles.success}>
              <div className={styles.check}>
                <Icon size={3} src="check.svg" />
              </div>

              <Title className={styles.title} type="title4" tag="h2">
                {Translate({ context: "order", label: "order-success" })}
              </Title>

              <Icon
                className={styles.ornament}
                size={{ w: 6, h: "auto" }}
                src={"ornament1.svg"}
              />

              <Text type="text2" className={styles.message}>
                {articleOrderData
                  ? Translate({
                      context: "order",
                      label: "order-success-message-digital-copy",
                    })
                  : Translate({
                      context: "order",
                      label: "order-success-message",
                      vars: [branchName],
                    })}
              </Text>

              {hasCulrUniqueId && (
                <Button
                  className={styles.redirect}
                  onClick={() => router.push("/profil/bestillingshistorik")}
                  type="secondary"
                >
                  {Translate({
                    context: "receipt",
                    label: "go-to-your-orders",
                  })}
                </Button>
              )}

              <Button
                className={styles.close}
                onClick={() => modal.clear()}
                data-cy="button-close-receipt"
              >
                {Translate({ context: "general", label: "close" })}
              </Button>
            </div>
          )}
          <div className={styles.error}>
            <Title
              className={styles.title}
              type="title5"
              tag="h2"
              dataCy="error-occured-title"
            >
              {Translate({ context: "receipt", label: "errorOccured" })}
            </Title>
            {hasFailed && (
              <>
                {failedMessage && (
                  <Text tag="div" type="text2" dataCy="order-failed-message">
                    {failedMessage}
                  </Text>
                )}
                <Text tag="span" type="text2" dataCy="try-again">
                  {Translate({
                    context: "receipt",
                    label: "tryAgain",
                  })}
                  <Link
                    href={Translate({
                      context: "general",
                      label: "kundeserviceBibdk",
                    })}
                    target="_blank"
                    border={{ top: false, bottom: { keepVisible: true } }}
                    dataCy="feedbacklink-to-kundeservice"
                  >
                    {Translate({
                      context: "general",
                      label: "kundeserviceBibdk",
                    })}
                  </Link>
                </Text>
              </>
            )}
            <Button className={styles.redirect} onClick={() => modal.clear()}>
              {Translate({ context: "general", label: "close" })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 *  Default export function of the Component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap(props) {
  // fetch props from context
  const { pickupBranch, pids } = props.context;

  // Fetch orderPolicy if it doesnt exist on pickupBranch
  const shouldFetchOrderPolicy =
    pids &&
    !isEmpty(pids) &&
    pickupBranch?.branchId &&
    !pickupBranch?.orderPolicy;

  const { data: policyData, isLoading: policyIsLoading } = useData(
    shouldFetchOrderPolicy &&
      branchesFragments.branchOrderPolicy({
        branchId: pickupBranch?.branchId,
        pids: pids,
      })
  );

  // If found, merge orderPolicy into pickupBranch
  const orderPolicy = policyData?.branches?.result[0];
  const mergedData = orderPolicy && merge({}, pickupBranch, orderPolicy);

  return (
    <Receipt
      {...props}
      isLoading={policyIsLoading}
      context={{ ...props.context, pickupBranch: mergedData || pickupBranch }}
    />
  );
}
