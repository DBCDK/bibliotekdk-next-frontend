import { StoryTitle, StoryDescription } from "@/storybook";
import { Related } from "./Related";

export default {
  title: "work/RelatedSubjects",
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
        <Related data={data} isLoading={false} />
      </div>
    </div>
  );
}
