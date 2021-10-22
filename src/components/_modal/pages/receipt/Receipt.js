import { useEffect, useState } from "react";

import merge from "lodash/merge";

import Top from "../base/top";

import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import Progress from "@/components/base/progress";
import Icon from "@/components/base/icon";
import Title from "@/components/base/title";
import Text from "@/components/base/text";

import { useData } from "@/lib/api/api";
import { branchOrderPolicy } from "@/lib/api/branches.fragments";

import styles from "./Receipt.module.css";

/**
 * Order Button
 */
export function Receipt({
  callback,
  // modal props
  modal,
  context,
}) {
  // get props from context
  const { pickupBranch, order } = context;

  // Loader callback status (set to true when loadingbar has finished loading)
  const [showProgress, setShowProgress] = useState(true);

  // order
  const {
    data: orderData,
    error: orderError,
    isLoading: orderIsLoading,
  } = order;

  // Define order status'
  const isOrdering = orderIsLoading;
  const isOrdered = !!orderData?.submitOrder?.orderId;
  const isFailed = !!orderError;

  // Define order status' class'
  const orderingClass = isOrdering || showProgress ? styles.ordering : "";
  const orderedClass = isOrdered && !showProgress ? styles.ordered : "";
  const failedClass = isFailed && !showProgress ? styles.failed : "";

  // Branch name
  const branchName = pickupBranch?.name;

  // Order ors id on order success
  const orderId = orderData?.submitOrder?.orderId;

  return (
    <div
      className={`${styles.receipt} ${orderingClass} ${orderedClass} ${failedClass}`}
    >
      <div className={styles.container}>
        <Top.Default className={{ top: styles.top }} back={false} />
        <div className={`${styles.wrap} ${styles.progress}`}>
          <Progress
            className={styles.loader}
            callback={() => setShowProgress(false)}
            start={isOrdering}
            duration={1}
            delay={1}
          />
        </div>

        <div className={`${styles.wrap} ${styles.result}`}>
          <div className={styles.success}>
            <div className={styles.check}>
              <Icon size={3} src="check.svg" />
            </div>

            <Title className={styles.title} type="title4">
              {Translate({ context: "order", label: "order-success" })}
            </Title>

            <Icon
              className={styles.ornament}
              size={{ w: 6, h: "auto" }}
              src={"ornament1.svg"}
            />

            <Text type="text2" className={styles.message}>
              {Translate({
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
          <div className={styles.error}>Some error occured :(</div>
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
      branchOrderPolicy({ branchId: pickupBranch?.branchId, pid })
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
