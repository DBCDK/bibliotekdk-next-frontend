import { StoryTitle, StoryDescription } from "@/storybook";
import { Words } from "./Related";

export default {
  title: "search/RelatedSubjects",
};

export function Default() {
  const data = [
    "heste",
    "børnebøger",
    "ridning",
    "hestesygdomme",
    "vokal",
    "sygdomme",
    "hestesport",
    "træning",
    "skolebøger",
    "hesteavl",
  ];

  return (
    <div>
      <StoryTitle>Related subjects</StoryTitle>
      <StoryDescription>
        Relted subjects for a given search query
      </StoryDescription>
      <div>
        <Words data={data} isLoading={false} />
      </div>
    </div>
  );
}
