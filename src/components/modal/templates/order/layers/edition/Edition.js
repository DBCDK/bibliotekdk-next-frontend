import Link from "@/components/base/link";

import styles from "./Edition.module.css";

export default function Edtion({ className, onChange, onClose }) {
  return (
    <div className={`${styles.edition} ${className}`}>
      <Link onClick={onClose}>Tilbage</Link>

      <br />
      <br />
      <br />
      <br />
      <Link onClick={(e) => onChange(e, "edition-1")}>Some edition 1</Link>
      <br />
      <Link onClick={(e) => onChange(e, "edition-2")}>Some edition 2</Link>
    </div>
  );
}
