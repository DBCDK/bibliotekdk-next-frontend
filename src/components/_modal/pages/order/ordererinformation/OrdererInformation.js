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
import { validateEmail } from "@/utils/validateEmail";

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
          value={email?.value || ""}
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

export default function Wrap({
  context,
  validated,
  hasValidationErrors,
  onMailChange,
  setMail,
  email,
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

  const { authUser, userIsLoading } = userInfo;

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

  const isLoading = isWorkLoading || isPickupBranchLoading || userIsLoading;

  // Email according to agency borrowerCheck (authUser.mail is from cicero and can not be changed)
  let initialmail = hasBorchk ? authUser?.mail || userMail : userMail;

  if (!email && initialmail) {
    const status = validateEmail(initialmail);
    setMail &&
      setMail({
        value: initialmail,
        valid: {
          status: status,
          message: status
            ? null
            : {
                context: "form",
                label: "wrong-email-field",
              },
        },
      });
  }

  const showMailMessage =
    isLoadingBranches || (authUser?.mail && lockedMessage && hasBorchk);

  return (
    <OrdererInformation
      isLoadingBranches={isLoadingBranches}
      name={actualUserName}
      hasAuthMail={!!authUser?.mail}
      email={email || initialmail}
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
