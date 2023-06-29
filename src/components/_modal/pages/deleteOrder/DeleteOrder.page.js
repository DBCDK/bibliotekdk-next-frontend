import Top from "../base/top";
import styles from "./DeleteOrder.module.css";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import { handleCancelOrder } from "./utils";

function DeleteOrder({ context, modal }) {
  const { label, mobile, isReadyToPickup, orderId, agencyId, orderMutation } =
    context;

  function closeModal() {
    mobile ? modal.prev() : modal.clear();
  }

  async function onCancelOrder() {
    console.log("########### TO DELETE", orderId, agencyId);
    //const res = await handleCancelOrder(orderId, agencyId, orderMutation);
    //console.log("###########", res);
    console.log("mobile", mobile);
    mobile ? modal.prev() : modal.clear();
  }

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
            label: isReadyToPickup
              ? "no-longer-reserved"
              : "miss-spot-in-queue",
          })}
        </Text>

        <Button
          className={styles.button}
          type="primary"
          size="medium"
          onClick={onCancelOrder}
          onKeyPress={(e) => {
            if (e.key === "Enter") onCancelOrder();
          }}
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
          onClick={closeModal}
          onKeyPress={(e) => {
            if (e.key === "Enter") closeModal();
          }}
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
