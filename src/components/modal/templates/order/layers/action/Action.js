import { useState, useEffect } from "react";

import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import Progress from "@/components/base/progress";
import Icon from "@/components/base/icon";
import Title from "@/components/base/title";
import Text from "@/components/base/text";

import styles from "./Action.module.css";

/**
 * Order Button
 */
function Action({
  onClick = null,
  validated,
  isVisible,
  isOrdering: _isOrdering,
  isOrdered: _isOrdered,
  isFailed: _isFailed,
  isLoading,
  data,
  onClose,
  callback,
}) {
  const context = { context: "order" };

  // Internal orderstatus
  const [isOrdering, setIsOrdering] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  // Loader callback status (set to true when loadingbar has finished loading)
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (_isOrdering) {
      setIsOrdering(true);
    }

    if (hasLoaded) {
      if (_isOrdered) {
        setIsOrdering(false);
        setIsOrdered(true);
      } else if (_isFailed) {
        setIsOrdering(false);
        setIsOrdered(false);
        setIsFailed(true);
      }
    }
  }, [_isOrdering, _isOrdered, _isFailed, hasLoaded]);

  // order data
  const {
    data: orderData,
    error: orderError,
    isLoading: orderIsLoading,
  } = data.order;

  // branch data
  const branchName = data.pickupBranch?.name;

  const hiddenClass = !isVisible ? styles.hidden : "";
  const orderingClass = isOrdering ? styles.ordering : "";
  const orderedClass = isOrdered && hasLoaded ? styles.ordered : "";
  const failedClass = isFailed && hasLoaded ? styles.failed : "";

  // Order ors id on order success
  const orsId = orderData?.submitOrder?.orsId;

  // check if user has already tried to submit order (but validation failed)
  const hasTry = validated?.hasTry;

  // Check for email validation and email error messages
  const hasEmail = validated?.details?.hasMail?.status;
  const message = hasTry && !hasEmail && validated?.details?.hasMail?.message;

  return (
    <div
      className={`${styles.action} ${orderingClass} ${orderedClass} ${failedClass} ${hiddenClass}`}
      aria-hidden={!isVisible}
    >
      <div className={styles.top}>
        {message && (
          <div className={styles.validationFail}>
            <Text type="text3">
              {Translate({
                context: "order",
                label: `action-${message.label}`,
              })}
            </Text>
          </div>
        )}
        <div className={styles.message}>
          <Text type="text3">
            {Translate({
              ...context,
              label: "order-message-library",
            })}
          </Text>
        </div>
        <Button
          tabIndex={isVisible ? "0" : "-1"}
          skeleton={isLoading}
          onClick={() => {
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
          callback={() => setHasLoaded(true)}
          start={isOrdering}
          duration={2}
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

          {orsId && (
            <Text type="text2" className={styles.orderNumber}>
              {Translate({
                ...context,
                label: "order-success-id",
                vars: [orsId],
              })}
            </Text>
          )}

          <Button
            tabIndex={isVisible && orsId ? "0" : "-1"}
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

export default Action;
