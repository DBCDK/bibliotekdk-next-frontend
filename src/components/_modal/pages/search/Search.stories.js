import { useEffect } from "react";
import { Search } from "./Search.page";

import Modal, { useModal } from "@/components/_modal";

import useQ from "@/components/hooks/useQ";

export default {
  title: "Modal/Search",
};

export function Default() {
  const { setStack } = useModal();

  const { q, setQ, clearQ, setQuery } = useQ();

  useEffect(() => {
    setStack([{ id: "search", context: {}, active: true }]);
  }, []);

  return (
    <Modal.Container
      mock={{
        clear: () => alert("Luk"),
      }}
    >
      <Modal.Page
        id="search"
        component={Search}
        // custom props
        q={q}
        data={{ hitcount: 0 }}
        workType={null}
        isLoading={false}
        onChange={(selected) => setQ({ ...q, ...selected })}
        onSubmit={() => setQuery({ exclude: ["modal"] })}
        onClear={() => clearQ({ exclude: ["all"] })}
      />
    </Modal.Container>
  );
}
