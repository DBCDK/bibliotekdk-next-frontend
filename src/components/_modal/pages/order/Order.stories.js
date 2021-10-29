import { useEffect } from "react";

import { Order } from "./Order.page";
import Modal, { useModal } from "@/components/_modal";

import data from "./dummy.data";

export default {
  title: "Modal/Order",
};

export function Default() {
  const { setStack } = useModal();

  // dummy context for receipt
  const context = {};

  // simulate order submit and callback
  useEffect(() => {
    setStack([{ id: "menu", context, active: true }]);
  }, []);

  const { work, user, order } = data;

  const modifiedUser = { ...user, mail: "some@mail.dk" };

  return (
    <Modal.Container
      mock={{
        clear: () => alert("Luk"),
      }}
    >
      <Modal.Page id="order" component={Order} />
    </Modal.Container>
  );
}
