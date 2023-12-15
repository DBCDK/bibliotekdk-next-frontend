// eslint-disable-next-line css-modules/no-unused-class
import styles from "./OrdererInformation.module.css";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Tooltip from "@/components/base/tooltip";
import Email from "@/components/base/forms/email";
import * as PropTypes from "prop-types";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";
import { getStylingAndErrorMessage } from "@/components/_modal/pages/order/utils/order.utils";
import { useEffect } from "react";

export function OrdererInformation({
  isLoadingBranches,
  name,
  hasAuthMail,
  email,
  lockedMessage,
  invalidClass,
  isLoading,
  onMailChange,
  message,
  validClass,
  showMailMessage,
}) {
  return (
    <div className={styles.user}>
      {(isLoadingBranches || name) && (
        <div>
          <Title type="title5" tag="h3">
            {Translate({ context: "order", label: "ordered-by" })}
          </Title>
          <div className={styles.name}>
            <Text type="text2" className={styles.textinline}>
              {Translate({ context: "general", label: "name" })}
            </Text>
            <Text type="text1" skeleton={!name} lines={1}>
              {name}
            </Text>
          </div>
        </div>
      )}
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
          disabled={isLoading || hasAuthMail}
          value={email || ""}
          id="order-user-email"
          onChange={onMailChange}
          readOnly={isLoading || hasAuthMail}
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

export default function Wrap({
  context,
  validated,
  hasValidationErrors,
  onMailChange,
}) {
  const { workId, pid, periodicaForm, pids } = context;

  const { validClass, invalidClass, message } = getStylingAndErrorMessage(
    validated,
    hasValidationErrors
  );

  const { userInfo, pickupBranchInfo, workResponse } = useOrderPageInformation({
    workId: workId,
    periodicaForm: periodicaForm,
    pids: pids ?? [pid],
  });

  const { authUser } = userInfo;

  const {
    isLoadingBranches,
    pickupBranch,
    pickupBranchUser,
    isPickupBranchLoading,
  } = pickupBranchInfo;

  const isWorkLoading = workResponse.isLoading;
  const hasBorchk = pickupBranch?.borrowerCheck;

  // user props
  const { agency } = pickupBranchUser;
  const { userName, userMail, userId, cpr, barcode, cardno, customId } =
    pickupBranchUser?.userParameters || {};
  const actualUserName = hasBorchk
    ? authUser?.name
    : userName || customId || userId || cpr || cardno || barcode;

  const libraryFallback = Translate({
    context: "general",
    label: "your-library",
  });

  // If user profile has an email, email field will be locked and this message shown
  const lockedMessage = {
    context: "order",
    label: "info-email-message",
    vars: [agency?.result?.[0]?.agencyName || libraryFallback],
  };

  const isLoading = isWorkLoading || isPickupBranchLoading;

  // Email according to agency borrowerCheck (authUser.mail is from cicero and can not be changed)
  let email = hasBorchk ? authUser?.mail || userMail : userMail;

  const showMailMessage =
    isLoadingBranches || (authUser?.mail && lockedMessage && hasBorchk);

  useEffect(() => {
    onMailChange({ target: { value: email } });
  }, [email]);

  return (
    <OrdererInformation
      isLoadingBranches={isLoadingBranches}
      name={actualUserName}
      hasAuthMail={!!authUser?.mail}
      email={email}
      lockedMessage={lockedMessage}
      pickupBranch={pickupBranch}
      invalidClass={invalidClass}
      isLoading={isLoading}
      showMailMessage={showMailMessage}
      onMailChange={onMailChange}
      message={message}
      validClass={validClass}
    />
  );
}
