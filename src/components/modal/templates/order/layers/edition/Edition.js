import Link from "@/components/base/link";

import styles from "./Edition.module.css";

export default function Edtion({ className, onClose }) {
  return (
    <div className={`${styles.edition} ${className}`}>
      <Link onClick={onClose}>Tilbage</Link>
    </div>
  );
}
