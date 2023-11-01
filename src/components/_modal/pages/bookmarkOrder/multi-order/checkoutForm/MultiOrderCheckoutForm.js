import Title from "@/components/base/title";
import Text from "@/components/base/text";
import { IconLink } from "@/components/base/iconlink/IconLink";
import ChevronRight from "@/public/icons/chevron_right.svg";
import cx from "classnames";
import localizationStyles from "./Localization.module.css";
import styles from "./MultiOrderCheckoutForm.module.css";
import Translate from "@/components/base/translate";
import OrdererInformation from "../../../order/ordererinformation/OrdererInformation";
import { onMailChange } from "@/components/_modal/pages/order/utils/order.utils";
import { useMemo, useState } from "react";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";
import Button from "@/components/base/button";
import { useModal } from "@/components/_modal/Modal";
import { LOGIN_MODE } from "../../../login/utils";

const LocalizationInformation = ({
  pickupBranch,
  pickupBranchUser,
  accessTypeInfo,
  isLoadingBranches,
}) => {
  const modal = useModal();

  const onClick = () => {
    !isLoadingBranches &&
      modal.push("pickup", {
        initial: {
          agencies: pickupBranchUser?.agencies,
        },
        requireDigitalAccess: accessTypeInfo?.requireDigitalAccess,
        mode: LOGIN_MODE.ORDER_PHYSICAL,
      });
  };

  return (
    <div className={localizationStyles.pickup}>
      <div className={localizationStyles.title}>
        <Title type="title5" tag="h3">
          {Translate({
            context: "order",
            label: "pickup-title",
          })}
        </Title>
      </div>
      <div className={localizationStyles.library}>
        {(isLoadingBranches || pickupBranch) && (
          <Text type="text1" skeleton={!pickupBranch?.name} lines={1}>
            {pickupBranch?.name}
          </Text>
        )}
        <IconLink
          onClick={onClick}
          disabled={isLoadingBranches}
          tag="button"
          iconSrc={ChevronRight}
          iconPlacement={"right"}
          className={cx(localizationStyles.iconLink, {
            [localizationStyles.disabled]: isLoadingBranches,
          })}
          skeleton={isLoadingBranches}
        >
          <Text tag="span" type="text3" className={localizationStyles.fullLink}>
            {Translate({
              context: "order",
              label: "change-pickup-link",
            })}
          </Text>
          <Text
            tag="span"
            type="text3"
            className={localizationStyles.shortLink}
          >
            {Translate({
              context: "general",
              label: pickupBranch ? "change" : "select",
            })}
          </Text>
        </IconLink>
      </div>
      {(isLoadingBranches || pickupBranch) && (
        <div>
          <Text type="text3" skeleton={!pickupBranch?.postalAddress} lines={2}>
            {pickupBranch?.postalAddress}
          </Text>
          <Text
            type="text3"
            skeleton={!pickupBranch?.postalCode || !pickupBranch?.city}
            lines={0}
          >{`${pickupBranch?.postalCode} ${pickupBranch?.city}`}</Text>
        </div>
      )}
    </div>
  );
};

const CheckoutForm = ({ context, materialCounts }) => {
  const { digitalMaterials, materialsNotAllowed, materialsMissingAction } =
    materialCounts;
  const disabled = digitalMaterials > 0 || materialsNotAllowed.length > 0;
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

  const onSubmit = () => {
    // Create orders
  };

  return (
    <div className={styles.container}>
      <LocalizationInformation
        pickupBranch={pickupBranch}
        pickupBranchUser={pickupBranchUser}
        accessTypeInfo={accessTypeInfo}
        isLoadingBranches={isLoadingBranches}
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
            {materialsNotAllowed ? (
              <Translate
                context="bookmark-order"
                label="multiorder-cant-order-singular"
                vars={[materialsNotAllowed]}
              />
            ) : (
              <Translate
                context="bookmark-order"
                label="multiorder-cant-order"
                vars={[materialsNotAllowed]}
              />
            )}
          </Text>
        )}
        {materialsMissingAction > 0 && (
          <Text type="text3" className={styles.errorLabel}>
            {materialsMissingAction === 1 ? (
              <Translate
                context="bookmark-order"
                label="multiorder-missing-info-singular"
                vars={[materialsMissingAction]}
              />
            ) : (
              <Translate
                context="bookmark-order"
                label="multiorder-missing-info"
                vars={[materialsMissingAction]}
              />
            )}
          </Text>
        )}
        {digitalMaterials > 0 && (
          <Text type="text3" className={styles.formLabel}>
            {digitalMaterials === 1 ? (
              <Translate
                context="bookmark-order"
                label="multiorder-digital-copy-singular"
                vars={[digitalMaterials]}
              />
            ) : (
              <Translate
                context="bookmark-order"
                label="multiorder-digital-copy"
                vars={[digitalMaterials]}
              />
            )}
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
          onClick={onSubmit}
        >
          {Translate({ context: "general", label: "accept" })}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutForm;
