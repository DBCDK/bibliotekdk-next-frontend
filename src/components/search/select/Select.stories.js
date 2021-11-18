import { StoryTitle, StoryDescription } from "@/storybook";

import Select from "@/components/search/select";

export default {
  title: "base/Select",
};

export function AList() {
  const options = [
    { value: "all", label: "all_materials" },
    { value: "books", label: "books" },
    { value: "articles", label: "articles" },
    { value: "film", label: "film" },
    { value: "games", label: "games" },
    { value: "music", label: "music" },
    { value: "nodes", label: "nodes" },
  ];

  const selectedMaterial = { value: "film", label: "film" };
  const optionsclicked = (idx) => {
    alert(options[idx].label);
  };

  return (
    <Select
      options={options}
      selectedMaterial={selectedMaterial}
      onOptionClicked={optionsclicked}
    />
  );
}
