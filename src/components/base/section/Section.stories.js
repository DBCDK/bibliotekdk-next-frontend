import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import Section from "./Section";

const exportedObject = {
  title: "base/Section",
};

export default exportedObject;

/**
 * Returns all primary buttons (Default button style)
 *
 */
export function Basic() {
  return (
    <div>
      <StoryTitle>Section</StoryTitle>
      <StoryDescription>
        Section component is used for consistent page layout. Details,
        Description and Content component is created with the Section component.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Section title="Some Title">Some section content</Section>
    </div>
  );
}
