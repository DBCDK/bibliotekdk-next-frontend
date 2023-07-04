import { StoryTitle, StoryDescription } from "@/storybook";

import List from "@/components/base/forms/list";
import animations from "css/animations";
import { useState } from "react";

const exportedObject = {
  title: "base/Forms/List",
};

export default exportedObject;

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
      <List.Group>
        {rows.map((row) => (
          <List.Radio
            key={row.title}
            selected={selected.title === row.title}
            onSelect={() => setSelected(row)}
            label={row.title}
          >
            <b>{row.title}</b>
            <p>{row.description}</p>
          </List.Radio>
        ))}
      </List.Group>
    </div>
  );
}
export function SelectGroup() {
  return (
    <div>
      <StoryTitle>Select Button Group</StoryTitle>
      <StoryDescription>
        Tab will focus selected element. use keys up/left to focus prev button,
        and down/right to focus next button{" "}
      </StoryDescription>
      <List.Group>
        {rows.map((row) => (
          <List.Select
            key={row.title}
            onSelect={() => alert(`${row.title} selected`)}
            label={row.title}
          >
            <b>{row.title}</b>
          </List.Select>
        ))}
      </List.Group>
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
      <List.Group>
        {rows.map((row) => (
          <List.Radio
            key={row.title}
            selected={selected.title === row.title}
            onSelect={() => setSelected(row)}
            label={row.title}
          >
            <b>{row.title}</b>
            <p>{row.description}</p>
          </List.Radio>
        ))}
      </List.Group>
    </div>
  );
}

export function DisabledRadioGroup() {
  const [selected, setSelected] = useState(rows[1]);
  return (
    <div>
      <StoryTitle>Radio Button Group</StoryTitle>
      <StoryDescription>
        {`One can\'t tab into group, or check/uncheck radio buttons`}
      </StoryDescription>
      <List.Group enabled={false}>
        {rows.map((row) => (
          <List.Radio
            key={row.title}
            selected={selected.title === row.title}
            onSelect={() => setSelected(row)}
            label={row.title}
          >
            <b>{row.title}</b>
            <p>{row.description}</p>
          </List.Radio>
        ))}
      </List.Group>
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
      <List.Group>
        {rows.map((row, index) => (
          <List.Radio
            key={row.title}
            selected={selected.title === row.title}
            onSelect={() => setSelected(row)}
            label={row.title}
            disabled={index === 1}
          >
            <b>{row.title}</b>
            <p>{row.description}</p>
          </List.Radio>
        ))}
      </List.Group>
    </div>
  );
}
