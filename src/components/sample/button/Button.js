import Button from "@/components/base/button";
import Text from "@/components/base/text/Text";

import Translate from "@/components/base/translate";

import styles from "./Button.module.css";

export default function SampleButton({
  className = "",
  format,
  onClick = () => {},
  isLoading = false,
}) {
  // access sample format
  const isEpub = format === "epub";

  return (
    <Button
      className={`${styles.button} ${className}`}
      variant="primary"
      skeleton={isLoading}
      onClick={onClick}
    >
      <i className={styles.icon}>▶</i>
      <div className={`${styles.text}`}>
        <Text type="text3">
          {Translate({
            context: "sample",
            label: isEpub ? "test-read-btn-lbl" : "test-listen-btn-lbl",
          })}
        </Text>
      </div>
    </Button>
  );
}
