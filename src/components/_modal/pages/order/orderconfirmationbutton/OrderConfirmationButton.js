// eslint-disable-next-line css-modules/no-unused-class
import styles from "./OrderConfirmationButton.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Button from "@/components/base/button";
import * as PropTypes from "prop-types";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";
import { extractClassNameAndMessage } from "@/components/_modal/pages/order/utils/order.utils";
import { AccessEnum } from "@/lib/enums";

function OrderConfirmationButton({
  invalidClass,
  actionMessage,
  availableAsDigitalCopy,
  availableAsPhysicalCopy,
  isDigitalCopy,
  isLoading,
  onClick,
  context,
  blockedForBranch,
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
          ) : isDigitalCopy &&
            availableAsDigitalCopy &&
            context?.selectedAccesses?.[0]?.__typename !==
              AccessEnum.INTER_LIBRARY_LOAN ? (
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
          disabled={
            (!availableAsDigitalCopy && !availableAsPhysicalCopy) ||
            isLoading ||
            blockedForBranch
          }
          skeleton={isLoading}
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
  blockedForBranch: PropTypes.bool,
};
export default function Wrap({
  context,
  validated,
  failedSubmission,
  onClick,
  blockedForBranch,
}) {
  const { workId, pid, periodicaForm } = context;
  const { invalidClass, actionMessage } = extractClassNameAndMessage(
    validated,
    failedSubmission
  );

  const { accessTypeInfo, pickupBranchInfo, workResponse } =
    useOrderPageInformation(workId, pid, periodicaForm);

  const { isLoading: isWorkLoading } = workResponse;
  const { isLoading: isPickupBranchLoading } = pickupBranchInfo;
  const { isDigitalCopy, availableAsDigitalCopy, availableAsPhysicalCopy } =
    accessTypeInfo;

  return (
    <OrderConfirmationButton
      invalidClass={invalidClass}
      actionMessage={actionMessage}
      availableAsDigitalCopy={availableAsDigitalCopy}
      availableAsPhysicalCopy={availableAsPhysicalCopy}
      isDigitalCopy={isDigitalCopy}
      isLoading={isWorkLoading || isPickupBranchLoading}
      onClick={onClick}
      context={context}
      blockedForBranch={blockedForBranch}
    />
  );
}
