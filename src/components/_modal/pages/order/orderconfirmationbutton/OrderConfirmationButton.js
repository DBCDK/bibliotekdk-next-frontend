// eslint-disable-next-line css-modules/no-unused-class
import orderStyles from "@/components/_modal/pages/order/Order.module.css";

import styles from "./OrderConfirmationButton.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Button from "@/components/base/button";
import * as PropTypes from "prop-types";

import {
  useConfirmButtonClicked,
  useOrderService,
  useOrderValidation,
  useShowAlreadyOrdered,
} from "@/components/hooks/order";

function OrderConfirmationButton({
  invalidClass,
  actionMessage,
  isLoading,
  onClick,
  showOrderDigitalCopy,
  showOrderHistory,
  disabled,
}) {
  return (
    <>
      <div className={styles.action}>
        <div className={`${styles.message} ${invalidClass}`}>
          {actionMessage && (
            <Text type="text3">
              {Translate({
                context: "order",
                label: `action-${actionMessage.label}`,
              })}
            </Text>
          )}
          {!actionMessage && showOrderDigitalCopy && (
            <Link
              target="_blank"
              disabled={false}
              href={"/hjaelp/digital-artikelservice/84"}
              border={{ top: false, bottom: { keepVisible: true } }}
            >
              <Text type="text3">
                {Translate({
                  context: "order",
                  label: "will-order-digital-copy-delivered-by",
                })}
              </Text>
            </Link>
          )}
          {!actionMessage && !showOrderDigitalCopy && (
            <Text type="text3">
              {Translate({
                context: "order",
                label: "order-message-library",
              })}
            </Text>
          )}
        </div>
        <Button disabled={disabled} skeleton={isLoading} onClick={onClick}>
          {Translate({ context: "general", label: "accept" })}
        </Button>
        {showOrderHistory && (
          <Text type="text2" className={styles.goToOrderHistory}>
            {Translate({
              context: "order",
              label: "get-overview",
            })}{" "}
            <Link
              href={"/profil/bestillingshistorik"}
              border={{ top: false, bottom: { keepVisible: true } }}
              dataCy="open-order-history"
              ariaLabel="open order history"
            >
              {Translate({ context: "profile", label: "orderHistory" })}
            </Link>{" "}
            {Translate({
              context: "order",
              label: "get-overview-2",
            })}
          </Text>
        )}
      </div>
    </>
  );
}

OrderConfirmationButton.propTypes = {
  invalidClass: PropTypes.any,
  actionMessage: PropTypes.any,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  showOrderDigitalCopy: PropTypes.bool,
  disabled: PropTypes.bool,
};
export default function Wrap({ pids, onClick }) {
  const { setConfirmButtonClicked } = useConfirmButtonClicked();

  const { showAlreadyOrderedWarning } = useShowAlreadyOrdered({ pids });

  const {
    confirmButtonDisabled,
    actionMessages,
    isLoading: isLoadingValidation,
  } = useOrderValidation({ pids });

  const { service, isLoading: isLoadingOrderService } = useOrderService({
    pids,
  });

  const actionMessage = actionMessages?.[0];

  return (
    <OrderConfirmationButton
      invalidClass={actionMessage && orderStyles.invalid}
      actionMessage={actionMessage}
      isLoading={isLoadingValidation || isLoadingOrderService}
      onClick={(...args) => {
        setConfirmButtonClicked(true);
        onClick(...args);
      }}
      showOrderDigitalCopy={service === "DIGITAL_ARTICLE"}
      showOrderHistory={showAlreadyOrderedWarning}
      disabled={confirmButtonDisabled}
    />
  );
}
