import Button from "@/components/base/button";
import Text from "@/components/base/text/Text";

import styles from "./Button.module.css";

export default function SampleButton({
  className = "",
  onClick = () => {},
  isLoading = false,
}) {
  return (
    <Button
      className={`${styles.button} ${className}`}
      variant="primary"
      skeleton={isLoading}
      onClick={onClick}
    >
      <Text type="text2">▶</Text>
    </Button>
  );
}
