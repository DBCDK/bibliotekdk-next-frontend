import Tooltip from "@/components/base/tooltip/Tooltip";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import styles from "./MaterialRowTooltip.module.css";

export default function MaterialRowTooltip({ labelToTranslate }) {
  return (
    <Tooltip
      placement="bottom"
      labelToTranslate={labelToTranslate}
      trigger={["hover", "focus"]}
      customClass={styles.tooltip}
    >
      <div className={styles.wrapper}>
        <Text type="text3">
          {Translate({
            context: "profile",
            label: "error-renew-loan",
          })}
        </Text>
        <Text type="text4" className={styles.exclamationMark}>
          !
        </Text>
      </div>
    </Tooltip>
  );
}
