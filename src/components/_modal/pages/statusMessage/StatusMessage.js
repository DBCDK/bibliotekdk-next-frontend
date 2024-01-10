/**
 * @file this file shows a universal status message modal page
 * This could be both confirmations and error messages
 */

import Top from "@/components/_modal/pages/base/top";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";

import styles from "./StatusMessage.module.css";

export default function StatusMessage({ context, modal }) {
  // handles if modal should have "back" functionality
  const hasBack = context.back ?? !!(modal.index?.() > 0);

  function handleOnClick() {
    // custom click event
    if (context.onClick) {
      context.onClick();
      return;
    }

    // default
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

      {context.button ?? (
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
          {context.buttonText ||
            Translate({
              context: "general",
              label: hasBack ? "back" : "close",
            })}
        </Button>
      )}
    </div>
  );
}
