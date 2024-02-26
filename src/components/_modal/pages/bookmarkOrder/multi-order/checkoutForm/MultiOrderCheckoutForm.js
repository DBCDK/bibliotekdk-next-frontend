import Text from "@/components/base/text";
import styles from "./MultiOrderCheckoutForm.module.css";
import Translate from "@/components/base/translate";
import OrdererInformation from "../../../order/ordererinformation/OrdererInformation";
import Button from "@/components/base/button";
import LocalizationInformation from "@/components/_modal/pages/order/localizationinformation/LocalizationInformation"; // Import without wrapper
import Spinner from "react-bootstrap/Spinner";
import Link from "@/components/base/link";
import Pincode from "../../../order/pincode";
import useAuthentication from "@/components/hooks/user/useAuthentication";

import {
  useMultiOrderValidation,
  useOrderFlow,
  usePickupBranchId,
  useSubmitOrders,
} from "@/components/hooks/order";
import { useBranchInfo } from "@/components/hooks/useBranchInfo";
import { useModal } from "@/components/_modal/Modal";

const CheckoutForm = () => {
  const { orders } = useOrderFlow();

  const modal = useModal();
  const {
    renderMe,
    materialsMissingActionCount,
    materialsNotAllowedCount,
    materialsToOrderCount,
    digitalMaterialsCount,
    physicalMaterialsCount,
    isLoading: isLoadingValidation,
    isValid,
    missingPincode,
    missingMail,
    alreadyOrdered,
  } = useMultiOrderValidation({ orders });

  const { hasCulrUniqueId } = useAuthentication();
  const disabled = !isValid;
  const { branchId } = usePickupBranchId();
  const pickupBranch = useBranchInfo({ branchId });
  const {
    renderMe: renderMeSubmitOrders,
    submitOrders,
    isSubmitting,
  } = useSubmitOrders({
    orders,
  });

  const hasPhysicalOrders = physicalMaterialsCount > 0;

  const scrollToWorkId = () => {
    const elements = document.getElementsByClassName("has-been-ordered");
    const container = document.getElementById("modal_dialog");
    const scrollContainer = container.querySelectorAll(
      ".modal_page.page-current .page_content"
    )[0];

    if (elements?.[0]?.parentNode) {
      scrollContainer.scrollTo({
        top: elements?.[0]?.parentNode.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.container}>
      {renderMe}
      {renderMeSubmitOrders}
      <LocalizationInformation orders={orders} />
      <OrdererInformation />
      {physicalMaterialsCount > 0 && <Pincode />}

      <div>
        {/* Errors and messages */}

        {!isLoadingValidation && materialsNotAllowedCount > 0 && (
          <Text type="text3" className={styles.errorLabel}>
            <Translate
              context="bookmark-order"
              label={
                materialsNotAllowedCount === 1
                  ? "multiorder-cant-order-singular"
                  : "multiorder-cant-order"
              }
              vars={[materialsNotAllowedCount]}
            />
          </Text>
        )}

        {!isLoadingValidation && materialsMissingActionCount > 0 && (
          <Text type="text3" className={styles.errorLabel}>
            <Translate
              context="bookmark-order"
              label={
                materialsMissingActionCount === 1
                  ? "multiorder-missing-info-singular"
                  : "multiorder-missing-info"
              }
              vars={[materialsMissingActionCount]}
            />
          </Text>
        )}

        {!isLoadingValidation && missingMail && (
          <Text type="text3" className={styles.errorLabel}>
            <Translate context="order" label="action-empty-email-field" />
          </Text>
        )}

        {!isLoadingValidation && missingPincode && (
          <Text type="text3" className={styles.errorLabel}>
            <Translate context="order" label="action-missing-pincode" />
          </Text>
        )}

        {!isLoadingValidation && alreadyOrdered?.length > 0 && (
          <Text type="text3" className={styles.errorLabel}>
            <Translate
              context="bookmark-order"
              label={
                alreadyOrdered?.length === 1
                  ? "multiorder-duplicate-order-singular"
                  : "multiorder-duplicate-order"
              }
              vars={[alreadyOrdered?.length]}
            />{" "}
            <Link
              onClick={scrollToWorkId}
              scroll={true}
              className={styles.chooseOrderAgain}
              border={{ top: false, bottom: { keepVisible: true } }}
            >
              {" "}
              <Translate
                context="order"
                label={
                  alreadyOrdered?.length === 1
                    ? "choose-order-again"
                    : "choose-order-again-plural"
                }
              />
            </Link>
          </Text>
        )}

        {!isLoadingValidation && digitalMaterialsCount > 0 && (
          <Text type="text3" className={styles.formLabel}>
            <Translate
              context="bookmark-order"
              label={
                digitalMaterialsCount === 1
                  ? "multiorder-digital-copy-singular"
                  : "multiorder-digital-copy"
              }
              vars={[digitalMaterialsCount]}
            />
          </Text>
        )}

        {!isLoadingValidation && hasPhysicalOrders && (
          <Text type="text3" className={styles.formLabel}>
            <Translate
              context="order"
              label={
                materialsToOrderCount === 1
                  ? "order-message-library"
                  : "order-message-library-plural"
              }
            />
          </Text>
        )}

        <Button
          dataCy="submit-button"
          type="primary"
          size="large"
          className={styles.formSubmit}
          disabled={disabled || isSubmitting}
          onClick={async () => {
            const receipt = await submitOrders();
            modal.push("multireceipt", {
              failedMaterials: receipt?.failedAtCreation || [],
              successMaterials: receipt?.successfullyCreated || [],
              branchName: pickupBranch?.name,
              digitalMaterialsCount,
              physicalMaterialsCount,
            });
          }}
        >
          {isLoadingValidation || isSubmitting ? (
            <Spinner />
          ) : (
            Translate({ context: "general", label: "accept" })
          )}
        </Button>
        {hasCulrUniqueId && alreadyOrdered?.length > 0 && (
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
    </div>
  );
};

export default CheckoutForm;
