// eslint-disable-next-line css-modules/no-unused-class
import styles from "./OrderConfirmationButton.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Button from "@/components/base/button";
import * as PropTypes from "prop-types";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";
import { getStylingAndErrorMessage } from "@/components/_modal/pages/order/utils/order.utils";
import { validateEmail } from "@/utils/validateEmail";
import useAuthentication from "@/components/hooks/user/useAuthentication";

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
export default function Wrap({
  email,
  context,
  validated,
  hasValidationErrors,
  onClick,
  blockedForBranch,
  isLoadingUser = false,
}) {
  const { hasCulrUniqueId } = useAuthentication();
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

  const isLoading = isWorkLoading || isPickupBranchLoading || isLoadingUser;

  // TODO: save this check for now
  // has pincode if required
  // const hasPincode = !validated?.details?.hasPincode?.status;

  const firstOrder = validated?.details?.firstOrder?.status;

  return (
    <OrderConfirmationButton
      invalidClass={invalidClass}
      actionMessage={actionMessage}
      isLoading={isLoading}
      onClick={onClick}
      showOrderDigitalCopy={isDigitalCopy && availableAsDigitalCopy}
      showOrderHistory={hasCulrUniqueId && !firstOrder}
      disabled={
        (!availableAsDigitalCopy && !availableAsPhysicalCopy) ||
        isLoading ||
        blockedForBranch ||
        !validateEmail(email?.value)
      }
    />
  );
}
