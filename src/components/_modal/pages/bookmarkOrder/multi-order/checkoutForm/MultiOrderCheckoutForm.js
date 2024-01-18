import Text from "@/components/base/text";
import styles from "./MultiOrderCheckoutForm.module.css";
import Translate from "@/components/base/translate";
import OrdererInformation from "../../../order/ordererinformation/OrdererInformation";
import {
  onMailChange,
  shouldRequirePincode,
} from "@/components/_modal/pages/order/utils/order.utils";
import { useEffect, useMemo, useState } from "react";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";
import Button from "@/components/base/button";
import { useModal } from "@/components/_modal/Modal";
import { LOGIN_MODE } from "../../../login/utils";
import { LocalizationInformation } from "@/components/_modal/pages/order/localizationinformation/LocalizationInformation"; // Import without wrapper
import Spinner from "react-bootstrap/Spinner";
import Link from "@/components/base/link";
import { validateEmail } from "@/utils/validateEmail";
import { getLabel } from "@/components/base/forms/email/Email";
import Pincode from "../../../order/pincode";
import useAuthentication from "@/components/hooks/user/useAuthentication";

const CheckoutForm = ({
  context,
  materialCounts,
  onSubmit,
  isLoading,
  duplicateBookmarkIds,
}) => {
  const {
    digitalMaterials,
    materialsNotAllowedCount,
    materialsMissingActionCount,
    isAnalyzed,
    materialsToOrderCount,
  } = materialCounts;
  const modal = useModal();
  const { hasCulrUniqueId } = useAuthentication();

  const [disabled, setDisabled] = useState(true);
  const [mail, setMail] = useState(null);
  const [pincode, setPincode] = useState(null);
  const { userInfo, pickupBranchInfo, accessTypeInfo } =
    useOrderPageInformation({
      workId: "",
      periodicaForm: context?.periodicaForm,
      pids: [],
    });
  const { pickupBranch, pickupBranchUser, isLoadingBranches } =
    pickupBranchInfo;

  const pincodeIsRequired = shouldRequirePincode(pickupBranch);

  useEffect(() => {
    const hasPincode = pincodeIsRequired ? !!pincode : true;

    setDisabled(
      !isAnalyzed ||
        materialsMissingActionCount > 0 ||
        materialsNotAllowedCount > 0 ||
        duplicateBookmarkIds?.length > 0 ||
        !mail?.valid?.status ||
        materialsToOrderCount < 1 ||
        !hasPincode
    );
  }, [
    isAnalyzed,
    materialsMissingActionCount,
    materialsNotAllowedCount,
    duplicateBookmarkIds?.length,
    mail?.valid?.status,
    materialsToOrderCount,
    pincode,
  ]);

  // materialsToOrderCount contains all orders: physical and digital orders,
  // if materialsToOrderCount is greater than digitalMaterials, we also have physical orders
  const hasPhysicalOrders = materialsToOrderCount > digitalMaterials;
  const { updateLoanerInfo } = userInfo;

  const validated = useMemo(() => {
    const hasMail = !!mail?.valid?.status;
    const hasBranchId = !!pickupBranch?.branchId;
    const hasPincode = pincodeIsRequired ? !!pincode : true;

    const status = hasMail && hasBranchId && hasPincode;

    const details = {
      hasMail: {
        status: hasMail,
        value: mail?.value,
        message: mail?.valid?.message,
      },
      hasPincode: {
        status: hasPincode,
        message: !hasPincode && { label: "missing-pincode" },
      },
      hasBranchId: { status: hasBranchId },
    };
    return { status, hasTry: false, details };
  }, [
    mail,
    pincode,
    pickupBranch,
    context?.periodicaForm?.publicationDateOfComponent,
  ]);

  const onSubmitForm = () => {
    if (onSubmit) onSubmit(pickupBranch, pincode);
  };

  const scrollToWorkId = () => {
    const container = document.getElementById("modal_dialog");

    const scrollContainer = container.querySelectorAll(
      ".modal_page.page-current .page_content"
    )[0];

    const scrollToId = context?.bookmarksToOrder?.find(
      (mat) => mat.bookmarkId === duplicateBookmarkIds?.[0]
    )?.materialId;
    const el = document.getElementById(scrollToId);

    scrollContainer.scrollTo({
      top: el?.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.container}>
      <LocalizationInformation
        pickupBranch={pickupBranch}
        pickupBranchUser={pickupBranchUser}
        accessTypeInfo={accessTypeInfo}
        isLoadingBranches={isLoadingBranches}
        isAuthenticated // always true here - we check before we enter this flow
        isDigitalCopy={false}
        availableAsPhysicalCopy={true}
        onClick={() => {
          !isLoadingBranches &&
            modal.push("pickup", {
              initial: {
                agencies: pickupBranchUser?.agencies,
              },
              requireDigitalAccess: false,
              mode: LOGIN_MODE.ORDER_PHYSICAL,
              pid: context?.materials?.[0].pid,
              showAllBranches: true,
            });
        }}
      />
      <OrdererInformation
        context={context}
        validated={validated}
        hasValidationErrors={false}
        onMailChange={(e) => {
          const value = e?.target?.value;
          onMailChange(
            value,
            {
              status: validateEmail(value),
              message: getLabel(value),
            },
            updateLoanerInfo,
            setMail
          );
        }}
        setMail={setMail}
        email={mail}
      />

      <Pincode validated={validated} onChange={(val) => setPincode(val)} />

      <div>
        {/* Errors and messages */}

        {materialsNotAllowedCount > 0 && (
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

        {materialsMissingActionCount > 0 && (
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

        {!mail?.valid?.status && (
          <Text type="text3" className={styles.errorLabel}>
            <Translate context="order" label="action-empty-email-field" />
          </Text>
        )}

        {!validated?.details?.hasPincode?.status && (
          <Text type="text3" className={styles.errorLabel}>
            <Translate context="order" label="action-missing-pincode" />
          </Text>
        )}

        {duplicateBookmarkIds?.length > 0 && (
          <Text type="text3" className={styles.errorLabel}>
            <Translate
              context="bookmark-order"
              label={
                duplicateBookmarkIds === 1
                  ? "multiorder-duplicate-order-singular"
                  : "multiorder-duplicate-order"
              }
              vars={[duplicateBookmarkIds?.length]}
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
                  duplicateBookmarkIds === 1
                    ? "choose-order-again"
                    : "choose-order-again-plural"
                }
              />
            </Link>
          </Text>
        )}

        {digitalMaterials > 0 && (
          <Text type="text3" className={styles.formLabel}>
            <Translate
              context="bookmark-order"
              label={
                digitalMaterials === 1
                  ? "multiorder-digital-copy-singular"
                  : "multiorder-digital-copy"
              }
              vars={[digitalMaterials]}
            />
          </Text>
        )}

        {hasPhysicalOrders && (
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
          type="primary"
          size="large"
          className={styles.formSubmit}
          disabled={disabled}
          onClick={onSubmitForm}
        >
          {isLoading ? (
            <Spinner />
          ) : (
            Translate({ context: "general", label: "accept" })
          )}
        </Button>
        {hasCulrUniqueId && duplicateBookmarkIds?.length > 0 && (
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
