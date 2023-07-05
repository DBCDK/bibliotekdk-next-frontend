import styles from "./ErrorRow.module.css";
import Translate from "@/components/base/translate/Translate";

export default function ErrorRow() {
  return (
    <div className={styles.ErrorRow}>
      {Translate({ context: "profile", label: "error-deleting-order" })}
    </div>
  );
}
