import cx from "classnames";
import styles from "./LocalizationItemBase.module.css";
import Link from "@/components/base/link/Link";
import ArrowSvg from "@/public/icons/arrowright.svg";
import Icon from "@/components/base/icon";
import animations from "css/animations";
import Translate from "@/components/base/translate";
import { AvailabilityEnum } from "@/components/hooks/useAgencyAccessFactory";
import * as PropTypes from "prop-types";

/**
 * Availability light has the color of the status of the manifestation on the library (agency or branch)
 * @param accumulatedAvailability
 * @param style
 * @returns {JSX.Element}
 * @constructor
 */
export function AvailabilityLight({ accumulatedAvailability, style }) {
  return (
    <div
      style={style}
      className={cx({
        [styles.green]: accumulatedAvailability === AvailabilityEnum.NOW,
        [styles.yellow]: accumulatedAvailability === AvailabilityEnum.LATER,
        [styles.red]: accumulatedAvailability === "red",
        [styles.none]: accumulatedAvailability === AvailabilityEnum.UNKNOWN,
      })}
      title={Translate({
        context: "localizations",
        label: `AvailabilityEnum_${accumulatedAvailability}`,
      })}
    />
  );
}

AvailabilityLight.propTypes = { accumulatedAvailability: PropTypes.string };

export default function LocalizationItemBase({
  children,
  library,
  query,
  modalPush,
  possibleAvailabilities = [
    AvailabilityEnum.NOW,
    AvailabilityEnum.LATER,
    AvailabilityEnum.UNKNOWN,
  ],
}) {
  const accumulatedAvailability = library.availabilityAccumulated;

  return (
    <div className={cx(styles.container)}>
      <Link
        a={true}
        border={{ top: { keepVisible: true }, bottom: { keepVisible: true } }}
        className={cx(styles.wrapper)}
        onClick={modalPush}
      >
        <div className={cx(styles.row_wrapper)}>
          {possibleAvailabilities.includes(accumulatedAvailability) && (
            <AvailabilityLight
              accumulatedAvailability={accumulatedAvailability}
              style={{ marginTop: "var(--pt1)" }}
            />
          )}
          <div className={styles.result}>{children}</div>
          <Icon
            size={{ w: "auto", h: 2 }}
            alt=""
            className={`${styles.arrow} ${animations["h-bounce-right"]} ${animations["f-bounce-right"]}`}
          >
            <ArrowSvg />
          </Icon>
        </div>
      </Link>
    </div>
  );
}
