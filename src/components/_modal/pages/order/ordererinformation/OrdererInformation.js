// eslint-disable-next-line css-modules/no-unused-class
import styles from "./OrdererInformation.module.css";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Tooltip from "@/components/base/tooltip";
import Email from "@/components/base/forms/email";
import * as PropTypes from "prop-types";
import { getStylingAndErrorMessage } from "@/components/_modal/pages/order/utils/order.utils";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import { useMail, usePickupBranchId } from "@/components/hooks/order";
import { useBranchInfo } from "@/components/hooks/useBranchInfo";
import { onMailChange } from "@/components/_modal/pages/order/utils/order.utils";

export function OrdererInformation({
  isLoadingBranches,
  name,
  email,
  lockedMessage,
  invalidClass,
  onMailChange,
  message,
  validClass,
  showMailMessage,
}) {
  return (
    <div className={styles.user}>
      <div>
        <Title type="title5" tag="h3">
          {Translate({ context: "order", label: "ordered-by" })}
        </Title>
        {(isLoadingBranches || name) && (
          <div className={styles.name}>
            <Text type="text2" className={styles.textinline}>
              {Translate({ context: "general", label: "name" })}
            </Text>
            <div></div>
            <Text type="text1" skeleton={isLoadingBranches} lines={1}>
              {name}
            </Text>
          </div>
        )}
      </div>

      <div className={styles.email}>
        <label htmlFor="order-user-email">
          <Text type="text2" className={styles.textinline}>
            {Translate({ context: "general", label: "email" })}
          </Text>
        </label>

        <Email
          className={styles.input}
          placeholder={Translate({
            context: "form",
            label: "email-placeholder",
          })}
          invalidClass={invalidClass}
          value={email || ""}
          id="order-user-email"
          onChange={onMailChange}
          skeleton={isLoadingBranches && !email}
        />

        {message && (
          <div className={`${styles.emailMessage} ${validClass}`}>
            <Text type="text3">{Translate(message)}</Text>
          </div>
        )}
        {showMailMessage && (
          <div className={`${styles.emailMessage}`}>
            <Text
              type="text3"
              skeleton={!lockedMessage}
              lines={1}
              tag="span"
              className={styles.userStatusLink}
            >
              {Translate(lockedMessage)}
              &nbsp;
            </Text>
            <Tooltip
              placement="top"
              labelToTranslate="tooltip_change_email"
              customClass={styles.tooltip}
              trigger={["hover", "focus"]}
              iconSize="2_5"
            />
          </div>
        )}
      </div>
    </div>
  );
}

OrdererInformation.propTypes = {
  isLoadingBranches: PropTypes.any,
  name: PropTypes.any,
  lockedMessage: PropTypes.shape({
    context: PropTypes.string,
    label: PropTypes.string,
    vars: PropTypes.arrayOf(PropTypes.any),
  }),
  pickupBranch: PropTypes.any,
  invalidClass: PropTypes.any,
  isLoading: PropTypes.any,
  email: PropTypes.any,
  hasAuthMail: PropTypes.bool,
  onMailChange: PropTypes.func,
  message: PropTypes.any,
  validClass: PropTypes.any,
  showMailMessage: PropTypes.bool,
};

export default function Wrap() {
  const { validClass, invalidClass } = getStylingAndErrorMessage();
  const {
    loanerInfo,
    updateLoanerInfo,
    isLoading: isLoadingLoanerInfo,
  } = useLoanerInfo();

  const {
    mail,
    mailFromPickupAgency,
    setMail,
    message,
    isLoading: isLoadingMail,
  } = useMail();

  const { branchId } = usePickupBranchId();
  const pickupBranch = useBranchInfo({ branchId });

  // user props
  const { userName, userId, cpr, barcode, cardno, customId } =
    loanerInfo?.userParameters || {};

  const actualUserName =
    userName || customId || userId || cpr || cardno || barcode;

  const libraryFallback = Translate({
    context: "general",
    label: "your-library",
  });

  // If user profile has an email, email field will be locked and this message shown
  const lockedMessage = {
    context: "order",
    label: "info-email-message",
    vars: [pickupBranch?.agencyName || libraryFallback],
  };

  const isLoading =
    pickupBranch?.isLoading || isLoadingLoanerInfo || isLoadingMail;

  const showMailMessage =
    !isLoading && mailFromPickupAgency && mailFromPickupAgency === mail;

  return (
    <OrdererInformation
      isLoadingBranches={pickupBranch?.isLoading}
      name={actualUserName}
      hasAuthMail={!!mailFromPickupAgency}
      email={mail}
      lockedMessage={lockedMessage}
      pickupBranch={pickupBranch}
      invalidClass={invalidClass}
      isLoading={isLoading}
      showMailMessage={showMailMessage}
      onMailChange={(e, valid) => {
        onMailChange(e?.target?.value, valid, updateLoanerInfo, setMail);
      }}
      message={!isLoading && message}
      validClass={validClass}
    />
  );
}
