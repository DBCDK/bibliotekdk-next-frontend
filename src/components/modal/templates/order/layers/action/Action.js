import { useState } from "react";

import { useRouter } from "next/router";
import merge from "lodash/merge";

import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import Progress from "@/components/base/progress";
import Icon from "@/components/base/icon";
import Title from "@/components/base/title";
import Text from "@/components/base/text";

import { useData } from "@/lib/api/api";
import { branchOrderPolicy } from "@/lib/api/branches.fragments";

import styles from "./Action.module.css";

/**
 * Order Button
 */
export function Action({
  onClick = null,
  validated,
  isVisible,
  isOrdering,
  isOrdered,
  isFailed,
  isLoading,
  data,
  onClose,
  callback,
}) {
  const context = { context: "order" };

  // Loader callback status (set to true when loadingbar has finished loading)
  const [showProgress, setShowProgress] = useState(false);

  // order data
  const { data: orderData, isStory } = data.order;

  // branch data
  const branchName = data.pickupBranch?.name;

  const hiddenClass = !isVisible && !isOrdered ? styles.hidden : "";
  const orderingClass = isOrdering || showProgress ? styles.ordering : "";
  const orderedClass = isOrdered && !showProgress ? styles.ordered : "";
  const failedClass = isFailed && !showProgress ? styles.failed : "";

  // Order ors id on order success
  const orderId = orderData?.submitOrder?.orderId;

  // check if user has already tried to submit order (but validation failed)
  const hasTry = validated?.hasTry;

  // Validation status
  const isValid = validated?.status;

  // Check for email validation and email error messages
  const hasEmail = validated?.details?.hasMail?.status;
  const message = hasTry && !hasEmail && validated?.details?.hasMail?.message;

  const invalidClass = message ? styles.invalid : "";

  return (
    <div
      className={`${styles.action} ${orderingClass} ${orderedClass} ${failedClass} ${hiddenClass}`}
      aria-hidden={!isVisible}
    >
      <div className={styles.top}>
        <div className={`${styles.message} ${invalidClass}`}>
          <Text type="text3">
            {Translate({
              ...context,
              label: message
                ? `action-${message.label}`
                : "order-message-library",
            })}
          </Text>
        </div>

        <Button
          disabled={data?.pickupBranch?.orderPolicy?.orderPossible !== true}
          tabIndex={isVisible ? "0" : "-1"}
          skeleton={isLoading}
          onClick={() => {
            isValid && !isStory && setShowProgress(true);
            onClick && onClick();
            callback && callback();
          }}
        >
          {Translate({ context: "general", label: "accept" })}
        </Button>
      </div>

      <div className={styles.loaderWrap}>
        <Progress
          className={styles.loader}
          callback={() => setShowProgress(false)}
          start={isOrdering}
          duration={1}
          delay={1}
        />
      </div>

      <div className={styles.result}>
        <div className={styles.success}>
          <div className={styles.check}>
            <Icon size={3} src="check.svg" />
          </div>

          <Title className={styles.title} type="title4">
            {Translate({ ...context, label: "order-success" })}
          </Title>

          <Icon
            className={styles.ornament}
            size={{ w: 6, h: "auto" }}
            src={"ornament1.svg"}
          />

          <Text type="text2" className={styles.message}>
            {Translate({
              ...context,
              label: "order-success-message",
              vars: [branchName],
            })}
          </Text>

          {orderId && (
            <Text type="text2" className={styles.orderNumber}>
              {Translate({
                ...context,
                label: "order-success-id",
                vars: [orderId],
              })}
            </Text>
          )}

          <Button
            tabIndex={isVisible && orderId ? "0" : "-1"}
            className={styles.close}
            skeleton={isLoading}
            onClick={onClose}
          >
            {Translate({ context: "general", label: "close" })}
          </Button>
        </div>
        <div className={styles.error}>Some error occured :(</div>
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
  // Get query from props - fallback to url query
  const query = props.query || useRouter()?.query;

  // If not given in probs, component will try to fetch them
  const pid = query?.order;

  const { pickupBranch } = props.data;

  // fetch orderPolicy if it doesnt exist
  const shouldFetchOrderPolicy = pid && !pickupBranch?.orderPolicy;

  // PolicyCheck in own request (sometimes slow)
  const { data: policyData, isLoading: policyIsLoading } = useData(
    shouldFetchOrderPolicy &&
      branchOrderPolicy({ branchId: pickupBranch?.branchId, pid })
  );

  // If found, merge orderPolicy into pickupBranch
  const orderPolicy = policyData?.branches?.result[0];
  const mergedData = orderPolicy && merge({}, pickupBranch, orderPolicy);

  return (
    <Action
      {...props}
      isLoading={props.isLoading || policyIsLoading}
      data={{ ...props.data, pickupBranch: mergedData || pickupBranch }}
    />
  );
}
