import styles from "./DotHandler.module.css";
import React from "react";
import Text from "@/components/base/text";

export function DotHandler({
  index,
  length,
  clickCallback,
  maxLength = 10,
  dotClass = "",
}) {
  const numDots = maxLength && maxLength < length ? maxLength - 1 : length;

  return (
    <div className={`${styles.dots_container} ${dotClass}`}>
      {[...Array(numDots).keys()].map((thisIndex) => (
        <button
          key={thisIndex}
          className={`${styles.dot} ${
            index === thisIndex && styles.active_dot
          }`}
          tabIndex={-1}
          onClick={() => clickCallback(thisIndex)}
          data-cy={`dot_handler_dot_index_${thisIndex}`}
        />
      ))}
      {maxLength && maxLength < length && (
        <Text
          type={index >= numDots ? "text6" : "text5"}
          className={`${styles.plus_covers}`}
        >
          +{length - numDots}
        </Text>
      )}
    </div>
  );
}
