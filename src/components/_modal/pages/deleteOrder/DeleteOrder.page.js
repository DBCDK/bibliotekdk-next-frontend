import Top from "../base/top";
import styles from "./DeleteOrder.module.css";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import { handleDeleteOrder } from "./utils";

function DeleteOrder({ context, modal }) {
  const {
    label,
    mobile,
    isReadyToPickup,
    orderId,
    agencyId,
    orderMutation,
    title,
  } = context;

  function closeModal() {
    mobile ? modal.prev() : modal.clear();
  }

  function onDeleteOrder() {
    handleDeleteOrder(orderId, agencyId, orderMutation);
    modal.clear();
  }

  return (
    <article className={styles.deleteOrder}>
      <Top title={label} titleTag="h4" dataCy="modal-header" />
      <>
        <Text
          type="text2"
          tag="p"
          className={styles.confirmationText}
          dataCy="delete-order-confirmation-1"
        >
          {Translate({
            context: "profile",
            label: "delete-order-confirmation",
          })}
        </Text>
        <Text
          type="text1"
          tag="p"
          className={styles.confirmationText}
          dataCy="material-title"
        >
          &quot;{title}&quot;
        </Text>
        <Text
          type="text2"
          tag="p"
          className={styles.bottomConfirmationText}
          dataCy="delete-order-confirmation-2"
        >
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
          size="large"
          onClick={onDeleteOrder}
          onKeyPress={(e) => {
            e.key === "Enter" && onDeleteOrder();
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
          size="large"
          onClick={closeModal}
          onKeyPress={(e) => {
            e.key === "Enter" && closeModal();
          }}
        >
          {Translate({
            context: "general",
            label: "cancel",
          })}
        </Button>
      </>
    </article>
  );
}

export default DeleteOrder;
