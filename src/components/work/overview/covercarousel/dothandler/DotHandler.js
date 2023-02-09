import styles from "@/components/work/overview/covercarousel/dothandler/DotHandler.module.css";
import React from "react";

export function DotHandler({ index, visibleElement, length, clickCallback }) {
  function modifiedCallback(thisIndex) {
    index === visibleElement && clickCallback(thisIndex);
  }

  return (
    <div className={styles.dots_container}>
      {[...Array(length).keys()].map((thisIndex) => (
        <button
          key={thisIndex}
          className={`${styles.dot} ${
            index === thisIndex && styles.active_dot
          }`}
          tabIndex={-1}
          onClick={() => modifiedCallback(thisIndex)}
        />
      ))}
    </div>
  );
}
