import { useState } from "react";

import { Desktop as Select } from "@/components/search/simple/select/Select";
import { Mobile as SelectMobile } from "@/components/search/simple/select/Select";

const exportedObject = {
  title: "search/Select",
};

export default exportedObject;

export function AList() {
  const [state, setState] = useState("all");

  const options = [
    "literature",
    "article",
    "movie",
    "game",
    "music",
    "sheetmusic",
  ];

  return (
    <div style={{ height: "500px", width: "500px" }}>
      <Select
        options={["all", ...options]}
        onSelect={(elem) => {
          setState(elem);
          // alert(elem);
        }}
        selected={state}
        count={3}
      />
    </div>
  );
}

export function AMobileList() {
  const [state, setState] = useState("all");

  const options = [
    "literature",
    "article",
    "movie",
    "game",
    "music",
    "sheetmusic",
  ];

  return (
    <div style={{ height: "500px", width: "500px" }}>
      <SelectMobile
        options={["all", ...options]}
        onSelect={(elem) => {
          setState(elem);
          // alert(elem);
        }}
        selected={state}
        count={3}
      />
    </div>
  );
}
