/**
 * @file component to confirm something. It has two buttons - one closes the
 * modal given in props (aborts) - the other hides the component.
 */

import { useState } from "react";
import styles from "./Confirmation.module.css";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Button from "@/components/base/button";

export function Confirmation({ modal }) {
  const [showMe, setShowMe] = useState(true);
  const cancelOrder = () => {
    modal.clear();
  };

  const continueOrder = () => {
    setShowMe(false);
  };

  return (
    <div className={showMe ? styles.showme : styles.hideme}>
      <div className={styles.centerme}>
        <Text type="text3">
          {Translate({
            context: "order",
            label: `already-ordered-message`,
          })}
        </Text>

        <div className={styles.buttons}>
          <Button onClick={cancelOrder}>
            <Text type="text3">
              {Translate({
                context: "order",
                label: `cancel-order`,
              })}
            </Text>
          </Button>
          <Button onClick={continueOrder}>
            <Text type="text3">
              {Translate({
                context: "order",
                label: `order-anyway`,
              })}
            </Text>
          </Button>
        </div>
      </div>
    </div>
  );
}
