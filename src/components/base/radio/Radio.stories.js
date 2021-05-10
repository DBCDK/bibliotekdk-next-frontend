import { StoryTitle, StoryDescription } from "@/storybook";

import Radio from "@/components/base/radio";
import { useState } from "react";

export default {
  title: "base/Radio",
};

const rows = [
  { title: "First", description: "der" },
  { title: "Second", description: "der" },
  { title: "Third", description: "der" },
];

export function RadioGroup() {
  const [selected, setSelected] = useState(rows[1]);
  return (
    <div>
      <StoryTitle>Radio Button Group</StoryTitle>
      <StoryDescription>
        Tab will focus selected element. use keys up/left to focus prev button,
        and down/right to focus next button{" "}
      </StoryDescription>
      <Radio.Group>
        {rows.map((row) => (
          <Radio.Button
            key={row.title}
            selected={selected.title === row.title}
            onSelect={() => setSelected(row)}
            label={row.title}
          >
            <b>{row.title}</b>
            <p>{row.description}</p>
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
}
export function RadioGroupNoInitialSelection() {
  const [selected, setSelected] = useState({});
  return (
    <div>
      <StoryTitle>Radio Button Group</StoryTitle>
      <StoryDescription>
        Tab will focus selected element. use keys up/left to focus prev button,
        and down/right to focus next button{" "}
      </StoryDescription>
      <Radio.Group>
        {rows.map((row) => (
          <Radio.Button
            key={row.title}
            selected={selected.title === row.title}
            onSelect={() => setSelected(row)}
            label={row.title}
          >
            <b>{row.title}</b>
            <p>{row.description}</p>
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
}
