import { useEffect } from "react";

import Menu from ".";
import Modal, { useModal } from "@/components/_modal";

const exportedObject = {
  title: "Modal/Menu",
};

export default exportedObject;

export function Default() {
  const { setStack } = useModal();

  // dummy context for receipt
  const context = {};

  // simulate order submit and callback
  useEffect(() => {
    setStack([{ id: "menu", context, active: true }]);
  }, []);

  return (
    <Modal.Container
      mock={{
        clear: () => alert("Luk"),
      }}
    >
      <Modal.Page id="menu" component={Menu} />
    </Modal.Container>
  );
}
