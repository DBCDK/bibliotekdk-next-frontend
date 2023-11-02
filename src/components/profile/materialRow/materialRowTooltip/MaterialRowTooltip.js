import Tooltip from "@/components/base/tooltip/Tooltip";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import styles from "./MaterialRowTooltip.module.css";
import cx from "classnames";

/**
 * shows
 * @param {boolean} isColumn: true if text and icon should be displayed in a column
 * @returns
 */
export function RenewError({ isColumn, customClass }) {
  return (
    <div
      className={cx({
        [styles.wrapper]: true,
        [styles.wrapper_column]: isColumn,
        [customClass]: customClass,
      })}
    >
      <Text type={isColumn ? "text3" : "text2"}>
        {Translate({
          context: "profile",
          label: "error-renew-loan",
        })}
      </Text>
      <Text
        tag="div"
        type={isColumn ? "text3" : "text2"}
        className={styles.exclamationMark}
      >
        !
      </Text>
    </div>
  );
}

export default function MaterialRowTooltip({ labelToTranslate }) {
  return (
    <Tooltip
      placement="bottom"
      labelToTranslate={labelToTranslate}
      trigger={["hover", "focus"]}
    >
      <RenewError isColumn={true} />
    </Tooltip>
  );
}
