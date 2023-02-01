import { StoryTitle, StoryDescription } from "@/storybook";
import { useState } from "react";
import Pagination from "../pagination/Pagination";

const exportedObject = {
  title: "search/Pagination",
};

export default exportedObject;

export function Default() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <StoryTitle>Pagination</StoryTitle>
      <StoryDescription>
        Pagination for results at the search page
      </StoryDescription>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Pagination
          currentPage={currentPage}
          numPages={15}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
export function SevenPages() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <StoryTitle>Pagination</StoryTitle>
      <StoryDescription>
        Pagination for results at the search page
      </StoryDescription>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Pagination
          currentPage={currentPage}
          numPages={7}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
export function EightPages() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <StoryTitle>Pagination</StoryTitle>
      <StoryDescription>
        Pagination for results at the search page
      </StoryDescription>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Pagination
          currentPage={currentPage}
          numPages={8}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <StoryTitle>Pagination</StoryTitle>
      <StoryDescription>Loading version of the pagination</StoryDescription>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Pagination isLoading={true} />
      </div>
    </div>
  );
}
