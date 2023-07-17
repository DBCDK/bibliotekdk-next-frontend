import DeleteOrder from ".";
import { useEffect } from "react";
import Modal, { useModal } from "@/components/_modal";
import Translate from "@/components/base/translate/Translate";

const exportedObject = {
  title: "Modal/DeleteOrder",
};

export default exportedObject;

export function DeleteOrderInQueue() {
  const { setStack } = useModal();

  // dummy context for receipt
  const context = {
    label: Translate({
      context: "profile",
      label: "delete-order-questionmark",
    }),
    isReadyToPickup: false,
    title: "Citronbjerget",
    onDeleteOrder: () => alert("Reservering slettet"),
  };

  // simulate order submit and callback
  useEffect(() => {
    setStack([{ id: "deleteOrder", context, active: true }]);
  }, []);

  return (
    <Modal.Container
      mock={{
        clear: () => alert("Luk"),
      }}
    >
      <Modal.Page id="deleteOrder" component={DeleteOrder} />
    </Modal.Container>
  );
}

export function DeleteOrderReadyToPickUp() {
  const { setStack } = useModal();

  // dummy context for receipt
  const context = {
    label: Translate({
      context: "profile",
      label: "delete-order-questionmark",
    }),
    isReadyToPickup: true,
    title: "Citronbjerget",
    onDeleteOrder: () => alert("Reservering slettet"),
  };

  // simulate order submit and callback
  useEffect(() => {
    setStack([{ id: "deleteOrder", context, active: true }]);
  }, []);

  return (
    <Modal.Container
      mock={{
        clear: () => alert("Luk"),
      }}
    >
      <Modal.Page id="deleteOrder" component={DeleteOrder} />
    </Modal.Container>
  );
}
