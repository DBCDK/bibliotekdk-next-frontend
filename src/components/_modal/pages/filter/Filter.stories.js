import { useEffect } from "react";

import { Filter } from "./Filter.page";
import Modal, { useModal } from "@/components/_modal";

import response from "./dummy.data";

export default {
  title: "Modal/Filter",
};

export function Default() {
  const { setStack } = useModal();

  // data
  const data = response.data;

  // dummy context for filter
  const context = {};

  // submit function
  function onSubmit(selected) {
    console.log("onSubmit", { selected });
  }

  // simulate order submit and callback
  useEffect(() => {
    setStack([{ id: "filter", context, active: true }]);
  }, []);

  return (
    <Modal.Container
      mock={{
        clear: () => alert("Luk"),
      }}
    >
      <Modal.Page
        data={data}
        onSubmit={onSubmit}
        id="filter"
        component={Filter}
      />
    </Modal.Container>
  );
}
