import Link from "@/components/base/link";

import styles from "./Pickup.module.css";

export default function Pickup({ className, onChange, onClose }) {
  return (
    <div className={`${styles.pickup} ${className}`}>
      <Link onClick={onClose}>Tilbage</Link>
      <br />
      <br />
      <br />
      <br />
      <Link onClick={(e) => onChange(e, "branch-1")}>Some branch 1</Link>
      <br />
      <Link onClick={(e) => onChange(e, "branch-2")}>Some branch 2</Link>
    </div>
  );
}
