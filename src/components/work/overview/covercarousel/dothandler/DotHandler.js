import styles from "@/components/work/overview/covercarousel/dothandler/DotHandler.module.css";
import React from "react";

export function DotHandler({
  index,
  visibleElement,
  length,
  clickCallback,
  dotClass = "",
}) {
  function modifiedCallback(thisIndex) {
    index === visibleElement && clickCallback(thisIndex);
  }

  return (
    <div className={`${styles.dots_container} ${dotClass}`}>
      {[...Array(length).keys()].map((thisIndex) => (
        <button
          key={thisIndex}
          className={`${styles.dot} ${
            index === thisIndex && styles.active_dot
          }`}
          tabIndex={-1}
          onClick={() => modifiedCallback(thisIndex)}
          data-cy={`dot_handler_dot_index_${thisIndex}`}
        />
      ))}
    </div>
  );
}
