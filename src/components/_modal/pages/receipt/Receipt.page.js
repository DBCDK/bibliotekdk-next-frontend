import { useState } from "react";

import merge from "lodash/merge";

import Top from "../base/top";

import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import Progress from "@/components/base/progress";
import Icon from "@/components/base/icon";
import Title from "@/components/base/title";
import Text from "@/components/base/text";

import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";

import styles from "./Receipt.module.css";

/**
 * Order Button
 */
export function Receipt({
  // modal props
  modal,
  context,
}) {
  // get props from context
  const { pickupBranch, order = {}, articleOrder = {} } = context;

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

  // Define order status'
  const isOrdering = orderIsLoading || articleOrderIsLoading || delay;
  const isOrdered =
    !!orderData?.submitOrder?.orderId ||
    articleOrderData?.elba?.placeCopyRequest?.status === "OK";
  const isFailed =
    !orderData?.submitOrder?.ok ||
    !!orderError ||
    !!articleOrderError ||
    (articleOrderData?.elba?.placeCopyRequest &&
      articleOrderData?.elba?.placeCopyRequest?.status !== "OK");

  let failedMessage = null;
  if (isFailed) {
    failedMessage = !!articleOrder
      ? "ORDER FAILED"
      : articleOrderData?.elba?.placeCopyRequest?.status;
  }

  // Define order status' class'
  const orderedClass = isOrdered && !delay ? styles.ordered : "";
  const failedClass = isFailed && !delay ? styles.failed : "";

  // Branch name
  const branchName = pickupBranch?.name;

  // Order ors id on order success
  const orderId = orderData?.submitOrder?.orderId;

  // Loading animation duration
  const duration = articleOrderIsLoading ? 10 : 1;

  return (
    <div className={`${styles.receipt} ${orderedClass} ${failedClass}`}>
      <div className={styles.container}>
        <Top className={{ top: styles.top }} back={false} />
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
          {!isFailed && (
            <div className={styles.success}>
              <div className={styles.check}>
                <Icon size={3} src="check.svg" />
              </div>

              <>
                <Title className={styles.title} type="title4" tag="h2">
                  {Translate({ context: "order", label: "order-success" })}
                </Title>

                <Icon
                  className={styles.ornament}
                  size={{ w: 6, h: "auto" }}
                  src={"ornament1.svg"}
                />
              </>

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

              {orderId && (
                <Text type="text2" className={styles.orderNumber}>
                  {Translate({
                    context: "order",
                    label: "order-success-id",
                    vars: [orderId],
                  })}
                </Text>
              )}

              <Button className={styles.close} onClick={() => modal.clear()}>
                {Translate({ context: "general", label: "close" })}
              </Button>
            </div>
          )}
          <div className={styles.error}>
            An error occured :(
            <div>{isFailed && failedMessage ? failedMessage : ""}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  // fetch props from context
  const { pid, pickupBranch } = props.context;

  // Fetch orderPolicy if it doesnt exist on pickupBranch
  const shouldFetchOrderPolicy =
    pid && pickupBranch?.branchId && !pickupBranch?.orderPolicy;

  const { data: policyData, isLoading: policyIsLoading } = useData(
    shouldFetchOrderPolicy &&
      branchesFragments.branchOrderPolicy({
        branchId: pickupBranch?.branchId,
        pid,
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
