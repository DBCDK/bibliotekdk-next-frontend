import styles from "@/components/_modal/pages/order/Order.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Button from "@/components/base/button";
import * as PropTypes from "prop-types";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";
import { extractClassNameAndMessage } from "@/components/_modal/pages/order/utils";

export function OrderConfirmationButton({
  invalidClass,
  actionMessage,
  availableAsDigitalCopy,
  availableAsPhysicalCopy,
  isWorkLoading,
  isPickupBranchLoading,
  onClick,
}) {
  return (
    <>
      <div className={styles.action}>
        <div className={`${styles.message} ${invalidClass}`}>
          {actionMessage ? (
            <Text type="text3">
              {Translate({
                context: "order",
                label: `action-${actionMessage.label}`,
              })}
            </Text>
          ) : availableAsDigitalCopy ? (
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
          ) : (
            <Text type="text3">
              {Translate({
                context: "order",
                label: "order-message-library",
              })}
            </Text>
          )}
        </div>
        <Button
          disabled={!availableAsDigitalCopy && !availableAsPhysicalCopy}
          skeleton={isWorkLoading || isPickupBranchLoading}
          onClick={onClick}
        >
          {Translate({ context: "general", label: "accept" })}
        </Button>
      </div>
    </>
  );
}

OrderConfirmationButton.propTypes = {
  invalidClass: PropTypes.any,
  actionMessage: PropTypes.any,
  availableAsDigitalCopy: PropTypes.any,
  availableAsPhysicalCopy: PropTypes.any,
  skeleton: PropTypes.any,
  onClick: PropTypes.func,
};

export default function Wrap({
  context,
  validated,
  failedSubmission,
  onClick,
}) {
  const { workId, pid, periodicaForm } = context;
  const { invalidClass, actionMessage } = extractClassNameAndMessage(
    validated,
    failedSubmission
  );

  const { accessTypeInfo, pickupBranchInfo, workResponse } =
    useOrderPageInformation(workId, pid, periodicaForm);

  const { isWorkLoading } = workResponse;
  const { isPickupBranchLoading } = pickupBranchInfo;

  const { availableAsDigitalCopy, availableAsPhysicalCopy } = accessTypeInfo;

  return (
    <OrderConfirmationButton
      invalidClass={invalidClass}
      actionMessage={actionMessage}
      availableAsDigitalCopy={availableAsDigitalCopy}
      availableAsPhysicalCopy={availableAsPhysicalCopy}
      isWorkLoading={isWorkLoading}
      isPickupBranchLoading={isPickupBranchLoading}
      onClick={onClick}
    />
  );
}
