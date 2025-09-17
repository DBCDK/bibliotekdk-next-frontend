import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import Skeleton from "@/components/base/skeleton";
import cx from "classnames";
import styles from "./Checkbox.module.css";

/**
 * Hvis `checked`-prop er givet, kører komponenten som *kontrolleret*.
 * Ellers falder den tilbage til intern state (ukontrolleret).
 */
export function Checkbox({
  className,
  tabIndex = "0",
  id,
  checked, // gør komponenten kontrolleret, hvis ikke undefined
  defaultChecked = false, // fallback til ukontrolleret brug
  disabled = false,
  onChange,
  dataCy = "checkbox",
  ariaLabelledBy,
  ariaLabel = "",
  readOnly = false,
  required,
  onClick, // videregives til input hvis nødvendigt
}) {
  const isControlled = typeof checked === "boolean";

  // Kun brugt i ukontrolleret mode:
  const [internal, setInternal] = useState(!!defaultChecked);

  // Sync intern state hvis vi skifter fra ukontrolleret → kontrolleret (sjældent, men sikkert)
  useEffect(() => {
    if (!isControlled && typeof checked === "boolean") {
      setInternal(!!checked);
    }
  }, [checked, isControlled]);

  const inputChecked = isControlled ? !!checked : internal;

  const handleChange = (e) => {
    if (readOnly) return;
    const next = !!e.target.checked;

    if (!isControlled) {
      setInternal(next);
    }
    onChange && onChange(next); // Kald kun onChange direkte fra event
  };

  return (
    <label
      htmlFor={id}
      className={cx(styles.wrap, className, {
        [styles.readOnly]: readOnly,
        [styles.disabled]: disabled,
      })}
    >
      <input
        id={id}
        aria-labelledby={ariaLabelledBy}
        className={styles.input}
        checked={inputChecked}
        type="checkbox"
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        data-cy={dataCy}
        tabIndex={disabled ? "-1" : tabIndex}
        onChange={handleChange}
        // Fjern manuel toggle på Enter for at undgå dobbelt-events.
        // Browseren håndterer keyboard (mellemrum) korrekt for checkboxes.
        onClick={onClick}
      />
      <div className={styles.border}>
        <div className={styles.bg} />
      </div>
      <div className={styles.label}>{ariaLabel}</div>
    </label>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  checked: PropTypes.bool, // kontrolleret
  defaultChecked: PropTypes.bool, // ukontrolleret fallback
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  skeleton: PropTypes.bool,
  dataCy: PropTypes.string,
};

export function SkeletonCheckbox() {
  return (
    <div className={`${styles.input}`}>
      <Skeleton />
    </div>
  );
}

export default function Wrap(props) {
  if (props.skeleton) {
    return <SkeletonCheckbox />;
  }
  return <Checkbox {...props} />;
}
