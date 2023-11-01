import { StoryTitle, StoryDescription } from "@/storybook";
import { CqlTextArea } from "@/components/search/advancedSearch/cqlTextArea/CqlTextArea";

const exportedObject = {
  title: "search/avanceret/cqlTxtBox",
};

export default exportedObject;

export function Default() {
  return (
    <div>
      <StoryTitle>Cql text area</StoryTitle>
      <StoryDescription>
        Text area. input cql til avanceret søgning
      </StoryDescription>
      <CqlTextArea />
    </div>
  );
}

Default.story = {
  nextRouter: {
    showInfo: true,
    pathname: "/avanceret",
    query: { cql: "Harry potter" },
  },
};
