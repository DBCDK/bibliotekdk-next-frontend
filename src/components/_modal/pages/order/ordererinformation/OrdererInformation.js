// eslint-disable-next-line css-modules/no-unused-class
import styles from "./OrdererInformation.module.css";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Tooltip from "@/components/base/tooltip";
import Email from "@/components/base/forms/email";
import * as PropTypes from "prop-types";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";
import { extractClassNameAndMessage } from "@/components/_modal/pages/order/utils/order.utils";
import debounce from "lodash/debounce";

export function OrdererInformation({
  isLoadingBranches,
  name,
  mail,
  lockedMessage,
  pickupBranch,
  invalidClass,
  isLoading,
  hasBorchk,
  email,
  onMailChange,
  message,
  validClass,
}) {
  return (
    <>
      {(isLoadingBranches || name) && (
        <div className={styles.user}>
          <Title type="title5" tag="h3">
            {Translate({ context: "order", label: "ordered-by" })}
          </Title>
          <div className={styles.name}>
            <Text type="text1" skeleton={!name} lines={1}>
              {name}
            </Text>
          </div>
          <div className={styles.email}>
            <label htmlFor="order-user-email">
              <Text type="text1" className={styles.textinline}>
                {Translate({ context: "general", label: "email" })}
              </Text>
              {(isLoadingBranches ||
                (mail && lockedMessage && pickupBranch?.borrowerCheck)) && (
                <Tooltip
                  placement="right"
                  labelToTranslate="tooltip_change_email"
                  customClass={styles.tooltip}
                />
              )}
            </label>

            <Email
              className={styles.input}
              placeholder={Translate({
                context: "form",
                label: "email-placeholder",
              })}
              invalidClass={invalidClass}
              disabled={isLoading || (mail && hasBorchk)}
              value={email || ""}
              id="order-user-email"
              onChange={debounce(onMailChange, 200)}
              readOnly={isLoading || (mail && hasBorchk)}
              skeleton={isLoadingBranches && !email}
            />

            {message && (
              <div className={`${styles.emailMessage} ${validClass}`}>
                <Text type="text3">{Translate(message)}</Text>
              </div>
            )}
            {(isLoadingBranches ||
              (mail && lockedMessage && pickupBranch?.borrowerCheck)) && (
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
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

OrdererInformation.propTypes = {
  isLoadingBranches: PropTypes.any,
  name: PropTypes.any,
  mail: PropTypes.any,
  lockedMessage: PropTypes.shape({
    context: PropTypes.string,
    label: PropTypes.string,
    vars: PropTypes.arrayOf(PropTypes.any),
  }),
  pickupBranch: PropTypes.any,
  invalidClass: PropTypes.any,
  isLoading: PropTypes.any,
  hasBorchk: PropTypes.any,
  email: PropTypes.any,
  onMailChange: PropTypes.func,
  message: PropTypes.any,
  validClass: PropTypes.any,
};

export default function Wrap({
  context,
  validated,
  failedSubmission,
  onMailChange,
}) {
  const { workId, pid, periodicaForm } = context;

  const { validClass, invalidClass, message } = extractClassNameAndMessage(
    validated,
    failedSubmission
  );

  const { userInfo, pickupBranchInfo, workResponse } = useOrderPageInformation(
    workId,
    pid,
    periodicaForm
  );

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
  let email = hasBorchk ? authUser.mail || userMail : userMail;

  return (
    <OrdererInformation
      isLoadingBranches={isLoadingBranches}
      name={actualUserName}
      mail={authUser?.mail}
      lockedMessage={lockedMessage}
      pickupBranch={pickupBranch}
      invalidClass={invalidClass}
      isLoading={isLoading}
      hasBorchk={hasBorchk}
      email={email}
      onMailChange={onMailChange}
      message={message}
      validClass={validClass}
    />
  );
}
