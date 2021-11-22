import { useEffect } from "react";

import { Filter } from "./Filter.page";
import Modal, { useModal } from "@/components/_modal";

import useFilters from "@/components/hooks/useFilters";

import response from "./dummy.data";

export default {
  title: "Modal/Filter",
};

export function Default() {
  const { setStack } = useModal();

  const { filters, setFilters, setQuery } = useFilters();

  // data
  const data = response.data;

  // dummy context for filter
  const context = {};

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
        id="filter"
        component={Filter}
        // custom props
        data={data}
        selected={filters}
        onSelect={(selected) => setFilters({ ...filters, ...selected })}
        onSubmit={() => setQuery(undefined, ["modal"])}
        onClear={() => setFilters({})}
      />
    </Modal.Container>
  );
}
