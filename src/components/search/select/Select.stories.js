import { useState } from "react";

import { Desktop as Select } from "@/components/search/select/Select";

export default {
  title: "base/Select",
};

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
    <Select
      options={["all", ...options]}
      onSelect={(elem) => {
        setState(elem);
        // alert(elem);
      }}
      selected={state}
      count={3}
    />
  );
}
