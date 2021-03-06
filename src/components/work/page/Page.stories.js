import { withKnobs, text } from "@storybook/addon-knobs";
import { useState } from "react";

import WorkPage from "./Page";

export default {
  title: "work/Page",
  decorators: [withKnobs],
};

export function WorkPageRealData() {
  const workId = text("workId", "work-of:870970-basis:28384645");
  const [type, setType] = useState("Bog");
  return (
    <WorkPage
      workId={workId}
      onTypeChange={({ type }) => setType(type)}
      type={type}
    />
  );
}
