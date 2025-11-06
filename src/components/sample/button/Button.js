import Button from "@/components/base/button";
import Text from "@/components/base/text/Text";

import styles from "./Button.module.css";

export default function SampleButton({ className = "", onClick = () => {} }) {
  return (
    <Button
      className={`${styles.button} ${className}`}
      variant="primary"
      onClick={onClick}
    >
      <Text type="text2">▶</Text>
    </Button>
  );
}
