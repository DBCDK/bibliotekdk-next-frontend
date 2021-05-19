import PropTypes from "prop-types";

import Link from "@/components/base/link";
import Radio from "@/components/base/radio";
import Text from "@/components/base/text";
import Title from "@/components/base/title";

import Arrow from "@/components/base/animation/arrow";

import styles from "./Pickup.module.css";
import animations from "@/components/base/animation/animations.module.css";

/**
 * Make pickup branches selectable with Radio buttons
 *
 * @param {object} props
 * @param {object} props.agency
 * @param {className} props.string
 * @param {function} props.onClose
 * @param {function} props.onSelect
 * @param {object} props.selected The selected branch object
 * @param {function} props._ref
 */
export default function Pickup({
  agency,
  className,
  onClose,
  onSelect,
  selected,
  isVisible,
}) {
  if (!agency) {
    return null;
  }

  // tabIndex
  const tabIndex = isVisible ? "0" : "-1";

  return (
    <div className={`${styles.pickup} ${className}`}>
      <Link
        border={false}
        onClick={onClose}
        tabIndex={tabIndex}
        className={`${styles.link} ${animations["on-hover"]} ${animations["on-focus"]}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.keyCode === 13) {
            onClose();
          }
        }}
      >
        <Arrow
          flip
          className={`${styles.arrow} ${animations["h-bounce-left"]} ${animations["f-bounce-left"]} ${animations["f-outline"]}`}
        />
      </Link>

      <Title type="title4" tag="h2">
        {agency.name || "Afhentningssted"}
      </Title>

      <Radio.Group enabled={isVisible}>
        {agency.branches.map((branch) => (
          <Radio.Button
            key={branch.branchId}
            selected={selected.branchId === branch.branchId}
            onSelect={() => {
              onSelect(branch);
            }}
            label={branch.name}
            className={[styles.radiobutton, animations["on-hover"]].join(" ")}
          >
            <Text
              type="text2"
              className={[
                styles.library,
                animations["h-border-bottom"],
                animations["h-color-blue"],
              ].join(" ")}
            >
              {branch.name}
            </Text>
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
}

Pickup.propTypes = {
  agency: PropTypes.object,
  className: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  selected: PropTypes.object,
};
