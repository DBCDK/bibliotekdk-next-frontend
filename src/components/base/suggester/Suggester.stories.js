import { useState, useEffect, useMemo } from "react";

import Suggester from "./";
import Input from "../forms/input/";

import { StoryTitle, StoryDescription } from "@/storybook";

export default {
  title: "Base/Suggester",
};

const dummy = [
  { value: "hest" },
  { value: "kat" },
  { value: "hund" },
  { value: "ko" },
  { value: "fisk" },
];

export function Default() {
  const [state, setState] = useState({ q: "", data: dummy });

  function updateState(q) {
    const data = dummy.filter((d) => {
      return d.value.includes(q.toLowerCase());
    });
    setState({ data, q });
  }

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Label </StoryTitle>
      <Suggester
        id="some-uniq-id"
        data={state.data}
        onSelect={(val) => updateState(val)}
        onClear={() => updateState("")}
      >
        <Input
          value={state.q}
          onChange={(e) => updateState(e.target.value)}
          placeholder='Prøv at skrive "hund"'
        />
      </Suggester>
    </div>
  );
}

export function DefaultValue() {
  const [state, setState] = useState({ q: "hest", data: dummy });

  function updateState(q) {
    const data = dummy.filter((d) => {
      return d.value.includes(q.toLowerCase());
    });

    setState({ data, q });
  }

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Label </StoryTitle>
      <Suggester
        id="some-uniq-id"
        data={state.data}
        onSelect={(val) => updateState(val)}
        onClear={() => updateState("")}
      >
        <Input
          value={state.q}
          onChange={(e) => updateState(e.target.value)}
          placeholder='Prøv at skrive "hund"'
        />
      </Suggester>
    </div>
  );
}
