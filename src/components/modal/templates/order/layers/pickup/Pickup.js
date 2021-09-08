import PropTypes from "prop-types";
import { useInView } from "react-intersection-observer";

import Link from "@/components/base/link";
import Radio from "@/components/base/radio";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";

import { Back } from "@/components/modal";

import Arrow from "@/components/base/animation/arrow";

import styles from "./Pickup.module.css";
import animations from "@/components/base/animation/animations.module.css";
import { useMemo } from "react";

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

  const allowedBranches =
    useMemo(
      () =>
        agency?.result?.filter(
          (branch) =>
            branch?.pickupAllowed && branch?.orderPolicy?.orderPossible
        ),
      [agency]
    ) || [];

  // Observe when bottom of list i visible
  const [ref, inView] = useInView({
    /* Optional options */
    threshold: 0,
  });

  // tabIndex
  const tabIndex = isVisible ? "0" : "-1";

  // Add shadow to bottom of scroll area, if last element is not visible
  const shadowClass = inView ? "" : styles.shadow;

  return (
    <>
      <Back isVisible={isVisible} handleClose={onClose} />
      <div className={`${styles.pickup} ${className}`}>
        <div className={`${styles.scrollArea} ${shadowClass}`}>
          {allowedBranches.length > 0 && (
            <Radio.Group enabled={isVisible} data-cy="allowed-branches">
              {allowedBranches.map((branch, idx) => {
                return (
                  <Radio.Button
                    key={`${branch.branchId}-${idx}`}
                    selected={selected?.branchId === branch.branchId}
                    onSelect={() => onSelect(branch)}
                    label={branch.name}
                    className={[
                      styles.radiobutton,
                      animations["on-hover"],
                    ].join(" ")}
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
                );
              })}
            </Radio.Group>
          )}
          <div ref={ref} />
        </div>
      </div>
    </>
  );
}

Pickup.propTypes = {
  agency: PropTypes.array,
  className: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  selected: PropTypes.object,
};
