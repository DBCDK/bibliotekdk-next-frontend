import { StoryTitle, StoryDescription } from "@/storybook";

import Radio from "@/components/base/radio";
import animations from "@/components/base/animation/animations.module.css";
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

export function DisabledRadioGroup() {
  const [selected, setSelected] = useState(rows[1]);
  return (
    <div>
      <StoryTitle>Radio Button Group</StoryTitle>
      <StoryDescription>
        One can't tab into group, or check/uncheck radio buttons
      </StoryDescription>
      <Radio.Group enabled={false}>
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
      <div
        style={{ marginTop: 24, display: "inline-block" }}
        tabIndex="0"
        className={`${animations["on-focus"]} ${animations["f-outline"]}`}
      >
        I am tabbable
      </div>
    </div>
  );
}

export function DisabledPartialButtons() {
  const [selected, setSelected] = useState(rows[1]);
  return (
    <div>
      <StoryTitle>Radio Button Group</StoryTitle>
      <StoryDescription>The second radio button is disabled.</StoryDescription>
      <Radio.Group>
        {rows.map((row, index) => (
          <Radio.Button
            key={row.title}
            selected={selected.title === row.title}
            onSelect={() => setSelected(row)}
            label={row.title}
            disabled={index === 1}
          >
            <b>{row.title}</b>
            <p>{row.description}</p>
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
}
