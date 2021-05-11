import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import Loader from "@/components/base/loader";

import styles from "./Action.module.css";

/**
 * Order Button
 */
function Action({
  onClick = null,
  isValidated,
  isVisible,
  isOrdering,
  isOrdered,
  isFailed,
  callback,
}) {
  setTimeout(() => {
    isOrdering, isOrdered, isFailed;
  }, 3000);

  const hiddenClass = !isVisible ? styles.hidden : "";
  const orderingClass = isOrdering ? styles.ordering : "";
  const orderedClass = isOrdered ? styles.ordered : "";
  const isFailedClass = isFailed ? styles.failed : "";

  return (
    <div
      className={`${styles.action} ${orderingClass} ${orderedClass} ${hiddenClass}`}
      aria-hidden={!isVisible}
    >
      <Button
        onClick={() => {
          onClick && onClick();
          callback && callback();
        }}
      >
        {Translate({ context: "general", label: "accept" })}
      </Button>

      <div className={styles.receipt}>
        <Loader className={styles.loader} duration={2} delay={1} />
        <div className={styles.success}>Gennemført</div>
      </div>
    </div>
  );
}

export default Action;
