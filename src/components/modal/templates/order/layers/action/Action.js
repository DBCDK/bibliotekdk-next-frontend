import { useState, useEffect } from "react";

import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import Loader from "@/components/base/loader";
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
  isOrdering,
  isOrdered,
  isFailed,
  data,
  onClose,
  callback,
}) {
  const context = { context: "order" };
  //   debug
  //   const [isOrdering, setIsOrdering] = useState(true);
  //   const [isOrdered, setIsOrdered] = useState(false);
  //   const [isFailed, setIsFailed] = useState(false);

  //   setTimeout(() => {
  //     setIsOrdering(false);
  //     setIsOrdered(false);
  //     setIsFailed(true);
  //   }, 3000);

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
  const orderedClass = isOrdered ? styles.ordered : "";
  const failedClass = isFailed ? styles.failed : "";

  //   const isValidated = validated?.status;
  const isValidated = true;

  const orsId = orderData?.submitOrder?.orsId;

  return (
    <div
      className={`${styles.action} ${orderingClass} ${orderedClass} ${failedClass} ${hiddenClass}`}
      aria-hidden={!isVisible}
    >
      <div className={styles.top}>
        <Button
          onClick={() => {
            onClick && isValidated && onClick();
            callback && callback();
          }}
        >
          {Translate({ context: "general", label: "accept" })}
        </Button>
      </div>

      <div className={styles.loaderWrap}>
        <Loader className={styles.loader} duration={2} delay={1} />
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

          <Button className={styles.close} onClick={onClose}>
            {Translate({ context: "general", label: "close" })}
          </Button>
        </div>
        <div className={styles.error}>Some error occured :(</div>
      </div>
    </div>
  );
}

export default Action;
