import Link from "@/components/base/link";

import styles from "./Info.module.css";

export default function Info({ className, onLayerSelect }) {
  return (
    <div className={`${styles.info} ${className}`}>
      <div className={styles.edition}>
        <Link onClick={() => onLayerSelect("edition")}>Vælg udgave</Link>
      </div>

      <div className={styles.pickup}>
        <Link onClick={() => onLayerSelect("pickup")}>Vælg afhentning</Link>
      </div>

      <div className={styles.user}>bruger ...</div>
    </div>
  );
}
