import Top from "../base/top";
import styles from "./DeleteOrder.module.css";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Button from "@/components/base/button";

function DeleteOrder({ context }) {
  const { label, firstInLine } = context;
  return (
    <article className={styles.deleteOrder}>
      <Top title={label} titleTag="h4" />
      <hr />
      <div className={styles.container}>
        <Text type="text2" tag="div">
          {Translate({
            context: "profile",
            label: "delete-order-confirmation",
          })}
        </Text>
        <Text type="text2" tag="div" className={styles.text}>
          {Translate({
            context: "profile",
            label: firstInLine ? "no-longer-reserved" : "miss-spot-in-queue",
          })}
        </Text>

        <Button
          className={styles.button}
          type="primary"
          size="medium"
          onClick={() => console.log("click it")}
        >
          {Translate({
            context: "profile",
            label: "delete",
          })}
        </Button>
        <Button
          className={styles.cancelButton}
          type="secondary"
          size="medium"
          onClick={() => console.log("click it")}
        >
          {Translate({
            context: "general",
            label: "cancel",
          })}
        </Button>
      </div>
    </article>
  );
}

export default DeleteOrder;
