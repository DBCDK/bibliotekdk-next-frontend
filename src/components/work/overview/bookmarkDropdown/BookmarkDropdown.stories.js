import { StoryDescription, StoryTitle } from "@/storybook";
import { BookMarkMaterialSelector } from "@/components/work/overview/bookmarkDropdown/BookmarkDropdown";

const exportedObject = {
  title: "work/overview/Bookmark",
};

export default exportedObject;

export function BookmarkWithDropdown() {
  const materialtypes = ["bog", "e-bog", "fisk"];

  return (
    <div>
      <StoryTitle>BookMarkDropdown</StoryTitle>
      <StoryDescription>
        show materialtypes for work in dropdown
      </StoryDescription>
      <div style={{ width: "10%" }}>
        <BookMarkMaterialSelector
          workId="some-work-id"
          materialTypes={materialtypes}
        />
      </div>
    </div>
  );
}

export function BookmarkWithDropdownOneMaterial() {
  const materialtypes = ["bog"];

  return (
    <div>
      <StoryTitle>BookMarkDropdown</StoryTitle>
      <StoryDescription>
        show materialtypes for work in dropdown
      </StoryDescription>
      <div style={{ width: "10%" }}>
        <BookMarkMaterialSelector
          workId="some-work-id"
          materialTypes={materialtypes}
        />
      </div>
    </div>
  );
}
