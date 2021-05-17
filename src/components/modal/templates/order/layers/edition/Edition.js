import Link from "@/components/base/link";

import styles from "./Edition.module.css";

export default function Edtion({ className, onChange, onClose, isVisible }) {
  // tabIndex
  const tabIndex = isVisible ? "0" : "-1";

  return (
    <div className={`${styles.edition} ${className}`}>
      <Link onClick={onClose} tabIndex={tabIndex}>
        Tilbage
      </Link>

      <br />
      <br />
      <br />
      <br />
      <Link tabIndex={"-1"} onClick={() => onChange("edition-1")}>
        Some edition 1
      </Link>
      <br />
      <Link tabIndex={"-1"} onClick={() => onChange("edition-2")}>
        Some edition 2
      </Link>
    </div>
  );
}
