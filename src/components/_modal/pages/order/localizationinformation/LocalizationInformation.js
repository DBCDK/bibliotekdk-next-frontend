import styles from "./LocalizationInformation.module.css";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import * as PropTypes from "prop-types";
import { useModal } from "@/components/_modal";
import { LOGIN_MODE } from "@/components/_modal/pages/login/utils";
import { IconLink } from "@/components/base/iconlink/IconLink";
import ChevronRight from "@/public/icons/chevron_right.svg";
import cx from "classnames";
import {
  useMobileLibraryLocations,
  useMultiOrderValidation,
  usePickupBranchId,
} from "@/components/hooks/order";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import { useBranchInfo } from "@/components/hooks/useBranchInfo";
import SimpleDropdown from "@/components/base/simpledropdown/SimpleDropdown";

export function LocalizationInformation({
  availableAsDigitalCopy = false,
  isAuthenticated,
  isDigitalCopy,
  isLoadingBranches,
  isLoadingPolicy,
  pickupBranch,
  onClick,
  availableAsPhysicalCopy,
  mobileLibraryLocations,
  mobileLibrary,
  setMobileLibrary,
  libraryClosed,
}) {
  if (availableAsDigitalCopy) {
    return null;
  }

  return (
    <>
      <div className={styles.pickup}>
        <div className={styles.title}>
          <Title type="title5" tag="h3">
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
            className={cx(styles.iconLink, {
              [styles.disabled]: isLoadingBranches,
            })}
            skeleton={isLoadingBranches}
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
        {/* maybe move warning together with warning in order-modal. see bibdk2021-1927 */}
        {!availableAsPhysicalCopy &&
          !availableAsDigitalCopy &&
          !libraryClosed && (
            <div className={`${styles["invalid-pickup"]} ${styles.invalid}`}>
              <Text
                type="text3"
                skeleton={isLoadingPolicy || !pickupBranch?.name}
                lines={1}
              >
                {Translate({
                  context: "order",
                  label: "check-policy-fail",
                })}
              </Text>
            </div>
          )}
        {mobileLibraryLocations?.length > 0 && (
          <SimpleDropdown
            placeholder={Translate({
              context: "bookmark-order",
              label: "placeholder-select-mobile-library",
            })}
            options={pickupBranch?.mobileLibraryLocations}
            selected={mobileLibrary}
            onSelect={setMobileLibrary}
            className={styles.mobilelocations}
          />
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

export default function Wrap({ orders, libraryClosed }) {
  const modal = useModal();

  const {
    digitalMaterialsCount,
    physicalMaterialsCount,
    isLoading: isLoadingValidation,
  } = useMultiOrderValidation({ orders });

  const { isAuthenticated } = useAuthentication();
  const { loanerInfo } = useLoanerInfo();

  const { branchId } = usePickupBranchId();
  const pickupBranch = useBranchInfo({ branchId });

  const { mobileLibraryLocations, setMobileLibrary, mobileLibrary } =
    useMobileLibraryLocations();

  return (
    <>
      <LocalizationInformation
        branchId={branchId}
        isDigitalCopy={digitalMaterialsCount > 0}
        availableAsDigitalCopy={
          !physicalMaterialsCount && digitalMaterialsCount > 0
        }
        availableAsPhysicalCopy={physicalMaterialsCount > 0}
        pickupBranch={pickupBranch}
        isAuthenticated={isAuthenticated}
        isLoadingPolicy={isLoadingValidation}
        isLoadingBranches={pickupBranch?.isLoading}
        libraryClosed={libraryClosed}
        mobileLibraryLocations={mobileLibraryLocations}
        setMobileLibrary={setMobileLibrary}
        mobileLibrary={mobileLibrary}
        onClick={() => {
          !pickupBranch?.isLoading &&
            modal.push("pickup", {
              initial: {
                agencies: loanerInfo?.agencies,
              },
              requireDigitalAccess: false,
              mode: LOGIN_MODE.ORDER_PHYSICAL,
              showAllBranches: true,
              //   @TODO -- pass orders if any
              orders: orders,
            });
        }}
      />
    </>
  );
}
