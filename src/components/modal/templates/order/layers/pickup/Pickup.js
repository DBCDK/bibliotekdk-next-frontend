import Link from "@/components/base/link";

import styles from "./Pickup.module.css";

export default function Pickup({ className, onClose }) {
  return (
    <div className={`${styles.pickup} ${className}`}>
      <Link onClick={onClose}>Tilbage</Link>
    </div>
  );
}
