import Top from "@/components/_modal/pages/base/top";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";

import styles from "./StatusMessage.module.css";

export default function StatusMessage({ context, modal }) {
  // handles if modal should have "back" functionality
  const hasBack = context.hasBack ?? !!(modal.index?.() > 0);

  function handleOnClick() {
    hasBack ? modal.prev() : modal.clear();
  }

  return (
    <div className={styles.container}>
      <Top back={hasBack} />
      <Title type="title4" tag="h2" className={styles.header}>
        {context.title}
      </Title>
      <Text type="text2" className={styles.text}>
        {context.text}
      </Text>

      <Button
        type="primary"
        className={styles.closeButton}
        onClick={() => handleOnClick()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleOnClick();
          }
        }}
      >
        {Translate({ context: "general", label: hasBack ? "back" : "close" })}
      </Button>
    </div>
  );
}
