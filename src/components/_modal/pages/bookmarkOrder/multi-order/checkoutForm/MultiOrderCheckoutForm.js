import Text from "@/components/base/text";
import styles from "./MultiOrderCheckoutForm.module.css";
import Translate from "@/components/base/translate";
import OrdererInformation from "../../../order/ordererinformation/OrdererInformation";
import { onMailChange } from "@/components/_modal/pages/order/utils/order.utils";
import { useMemo, useState } from "react";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";
import Button from "@/components/base/button";
import { useModal } from "@/components/_modal/Modal";
import { LOGIN_MODE } from "../../../login/utils";
import { LocalizationInformation } from "@/components/_modal/pages/order/localizationinformation/LocalizationInformation"; // Import without wrapper

const CheckoutForm = ({ context, materialCounts, onSubmit }) => {
  const { digitalMaterials, materialsNotAllowed, materialsMissingAction } =
    materialCounts;
  const modal = useModal();
  const disabled = materialsMissingAction > 0 || materialsNotAllowed > 0;
  const [mail, setMail] = useState(null);
  const { userInfo, pickupBranchInfo, accessTypeInfo } =
    useOrderPageInformation({
      workId: "",
      periodicaForm: context?.periodicaForm,
      pids: [],
    });
  const { pickupBranch, pickupBranchUser, isLoadingBranches } =
    pickupBranchInfo;

  const { updateLoanerInfo } = userInfo;

  const validated = useMemo(() => {
    const hasMail = !!mail?.valid?.status;
    const hasBranchId = !!pickupBranch?.branchId;
    const status = hasMail && hasBranchId;

    const details = {
      hasMail: {
        status: hasMail,
        value: mail?.value,
        message: mail?.valid?.message,
      },
      hasBranchId: { status: hasBranchId },
    };

    return { status, hasTry: false, details };
  }, [mail, pickupBranch, context?.periodicaForm?.publicationDateOfComponent]);

  const onSubmitForm = () => {
    if (onSubmit) onSubmit(pickupBranch.name);
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
        availableAsPhysicalCopy
        onClick={() => {
          !isLoadingBranches &&
            modal.push("pickup", {
              initial: {
                agencies: pickupBranchUser?.agencies,
              },
              requireDigitalAccess: accessTypeInfo?.requireDigitalAccess,
              mode: LOGIN_MODE.ORDER_PHYSICAL,
            });
        }}
      />
      <OrdererInformation
        context={context}
        validated={validated}
        failedSubmission={false}
        onMailChange={(e, valid) => {
          onMailChange(e?.target?.value, valid, updateLoanerInfo, setMail);
        }}
      />

      <div>
        {/* Errors and messages */}
        {materialsNotAllowed > 0 && (
          <Text type="text3" className={styles.errorLabel}>
            <Translate
              context="bookmark-order"
              label={
                materialsNotAllowed === 1
                  ? "multiorder-cant-order-singular"
                  : "multiorder-cant-order"
              }
              vars={[materialsNotAllowed]}
            />
          </Text>
        )}
        {materialsMissingAction > 0 && (
          <Text type="text3" className={styles.errorLabel}>
            <Translate
              context="bookmark-order"
              label={
                materialsMissingAction === 1
                  ? "multiorder-missing-info-singular"
                  : "multiorder-missing-info"
              }
              vars={[materialsMissingAction]}
            />
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
        <Text type="text3" className={styles.formLabel}>
          <Translate context="order" label="order-message-library" />
        </Text>

        <Button
          type="primary"
          size="large"
          className={styles.formSubmit}
          disabled={disabled}
          onClick={onSubmitForm}
        >
          {Translate({ context: "general", label: "accept" })}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutForm;
