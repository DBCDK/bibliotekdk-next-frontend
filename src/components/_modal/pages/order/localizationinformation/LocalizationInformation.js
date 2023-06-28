import styles from "./LocalizationInformation.module.css";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import * as PropTypes from "prop-types";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";
import { useModal } from "@/components/_modal";
import { LOGIN_MODE } from "@/components/_modal/pages/loanerform/LoanerForm";
import { IconLink } from "@/components/base/iconlink/IconLink";
import ChevronRight from "@/public/icons/chevron_right.svg";

function LocalizationInformation({
  availableAsDigitalCopy,
  isAuthenticated,
  isDigitalCopy,
  isLoadingBranches,
  pickupBranch,
  onClick,
  availableAsPhysicalCopy,
}) {
  return (
    <>
      <div className={styles.pickup}>
        <div className={styles.title}>
          <Title type="title5">
            {Translate({
              context: "order",
              label:
                availableAsDigitalCopy || (!isAuthenticated && isDigitalCopy)
                  ? "pickup-title-digital-copy"
                  : "pickup-title",
            })}
          </Title>
        </div>
        <div className={styles.library}>
          {(isLoadingBranches || pickupBranch) && (
            <Text type="text1" skeleton={!pickupBranch?.name} lines={1}>
              {pickupBranch?.name}
            </Text>
          )}
          <IconLink
            onClick={onClick}
            disabled={isLoadingBranches}
            tag={"button"}
            iconSrc={ChevronRight}
            iconPlacement={"right"}
          >
            <Text tag="span" type="text3" className={styles.fullLink}>
              {Translate({
                context: "order",
                label:
                  availableAsDigitalCopy || (!isAuthenticated && isDigitalCopy)
                    ? "change-pickup-digital-copy-link"
                    : pickupBranch
                    ? "change-pickup-link"
                    : "pickup-link",
              })}
            </Text>
            <Text tag="span" type="text3" className={styles.shortLink}>
              {Translate({
                context: "general",
                label: pickupBranch ? "change" : "select",
              })}
            </Text>
          </IconLink>
        </div>
        {(isLoadingBranches || pickupBranch) && (
          <div>
            <Text
              type="text3"
              skeleton={!pickupBranch?.postalAddress}
              lines={2}
            >
              {pickupBranch?.postalAddress}
            </Text>
            <Text
              type="text3"
              skeleton={!pickupBranch?.postalCode || !pickupBranch?.city}
              lines={0}
            >{`${pickupBranch?.postalCode} ${pickupBranch?.city}`}</Text>
          </div>
        )}
        {!isLoadingBranches &&
          pickupBranch &&
          !availableAsPhysicalCopy &&
          !availableAsDigitalCopy && (
            <div className={`${styles["invalid-pickup"]} ${styles.invalid}`}>
              <Text type="text3">
                {Translate({
                  context: "order",
                  label: "check-policy-fail",
                })}
              </Text>
            </div>
          )}
      </div>
    </>
  );
}
LocalizationInformation.propTypes = {
  isDigitalCopy: PropTypes.bool,
  availableAsDigitalCopy: PropTypes.bool,
  availableAsPhysicalCopy: PropTypes.bool,
  isLoadingBranches: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  pickupBranch: PropTypes.any,
  onClick: PropTypes.func,
};

export default function Wrap({ context }) {
  const modal = useModal();
  const { workId, pid, periodicaForm } = context;

  const { pickupBranchInfo, accessTypeInfo } = useOrderPageInformation(
    workId,
    pid,
    periodicaForm
  );

  const {
    pickupBranch,
    isLoadingBranches,
    isAuthenticatedForPickupBranch: isAuthenticated,
    pickupBranchUser,
  } = pickupBranchInfo;

  const {
    isDigitalCopy,
    availableAsDigitalCopy,
    availableAsPhysicalCopy,
    requireDigitalAccess,
  } = accessTypeInfo;

  return (
    <LocalizationInformation
      isDigitalCopy={isDigitalCopy}
      availableAsDigitalCopy={availableAsDigitalCopy}
      availableAsPhysicalCopy={availableAsPhysicalCopy}
      pickupBranch={pickupBranch}
      isAuthenticated={isAuthenticated}
      isLoadingBranches={isLoadingBranches}
      onClick={() => {
        !isLoadingBranches &&
          modal.push("pickup", {
            pid,
            initial: { agency: pickupBranchUser?.agency },
            requireDigitalAccess,
            mode: isDigitalCopy
              ? LOGIN_MODE.SUBSCRIPTION
              : LOGIN_MODE.ORDER_PHYSICAL,
          });
      }}
    />
  );
}
