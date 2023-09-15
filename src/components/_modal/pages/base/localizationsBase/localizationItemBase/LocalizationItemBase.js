import cx from "classnames";
import styles from "./LocalizationItemBase.module.css";
import Link from "@/components/base/link/Link";
import ArrowSvg from "@/public/icons/arrowright.svg";
import Icon from "@/components/base/icon";
import animations from "css/animations";
import { AvailabilityEnum } from "@/components/hooks/useHandleAgencyAccessData";
import { AvailabilityLight } from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/AvailabilityLight";
import Text from "@/components/base/text/Text";

export default function LocalizationItemBase({
  children,
  library,
  modalPush,
  possibleAvailabilities = [
    AvailabilityEnum.NOW,
    AvailabilityEnum.LATER,
    AvailabilityEnum.NEVER,
    AvailabilityEnum.UNKNOWN,
  ],
  itemLoading,
}) {
  const accumulatedAvailability = library?.availabilityAccumulated;

  // itemLoading = true;

  return (
    <div className={cx(styles.container)}>
      <Link
        a={true}
        border={{ top: { keepVisible: true }, bottom: { keepVisible: true } }}
        className={cx(styles.wrapper)}
        onClick={modalPush}
        disabled={itemLoading}
      >
        {itemLoading ? (
          <Text skeleton={true} clamp={true} lines={2} />
        ) : (
          <div className={cx(styles.row_wrapper)}>
            {possibleAvailabilities.includes(accumulatedAvailability) && (
              <AvailabilityLight
                accumulatedAvailability={accumulatedAvailability}
                style={{ marginTop: "var(--pt025)" }}
              />
            )}
            <div className={styles.result}>{children}</div>
            <Icon
              size={{ w: "auto", h: 3 }}
              alt=""
              className={`${styles.arrow} ${animations["h-bounce-right"]} ${animations["f-bounce-right"]}`}
            >
              <ArrowSvg />
            </Icon>
          </div>
        )}
      </Link>
    </div>
  );
}
