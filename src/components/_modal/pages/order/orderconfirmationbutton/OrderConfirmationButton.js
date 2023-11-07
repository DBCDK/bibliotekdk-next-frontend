// eslint-disable-next-line css-modules/no-unused-class
import styles from "./OrderConfirmationButton.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Button from "@/components/base/button";
import * as PropTypes from "prop-types";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";
import { getStylingAndErrorMessage } from "@/components/_modal/pages/order/utils/order.utils";
import { AccessEnum } from "@/lib/enums";

function OrderConfirmationButton({
  invalidClass,
  actionMessage,
  isLoading,
  onClick,
  showOrderDigitalCopy,
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
              }) + "BERND"}
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
export default function Wrap({
  context,
  validated,
  hasValidationErrors,
  onClick,
  blockedForBranch,
}) {
  const { workId, pid, periodicaForm, pids } = context;
  const { invalidClass, actionMessage } = getStylingAndErrorMessage(
    validated,
    hasValidationErrors
  );

  const { accessTypeInfo, pickupBranchInfo, workResponse } =
    useOrderPageInformation({
      workId: workId,
      periodicaForm: periodicaForm,
      pids: pids ?? [pid],
    });

  const { isLoading: isWorkLoading } = workResponse;
  const { isLoading: isPickupBranchLoading } = pickupBranchInfo;
  const { isDigitalCopy, availableAsDigitalCopy, availableAsPhysicalCopy } =
    accessTypeInfo;

  const isLoading = isWorkLoading || isPickupBranchLoading;

  return (
    <OrderConfirmationButton
      invalidClass={invalidClass}
      actionMessage={actionMessage}
      isLoading={isWorkLoading || isPickupBranchLoading}
      onClick={onClick}
      showOrderDigitalCopy={
        isDigitalCopy &&
        availableAsDigitalCopy &&
        context?.selectedAccesses?.[0]?.__typename !==
          AccessEnum.INTER_LIBRARY_LOAN
      }
      disabled={
        (!availableAsDigitalCopy && !availableAsPhysicalCopy) ||
        isLoading ||
        blockedForBranch
      }
    />
  );
}
