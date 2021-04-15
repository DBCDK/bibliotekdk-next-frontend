import { StoryTitle, StoryDescription } from "@/storybook";

import Anchor from "./";

export default {
  title: "Base/Anchor",
};

/**
 * Anchor - anchor one-page menu
 *
 */

export function Default() {
  const styles = {
    height: "400px;",
  };

  return (
    <div>
      <StoryTitle>Accordion</StoryTitle>
      <StoryDescription>
        Sections can be expanded to show more information. Typically used for
        FAQ on websites.
      </StoryDescription>
      <Anchor.Wrap>
        <section anchor-label="Section1" style={styles}>
          <span>Section one 1</span>
        </section>
        <Anchor.Menu />
        <section anchor-label="Section2">
          <span>Section one 2</span>
        </section>
        <section anchor-label="Section3">
          <span>Section one 3</span>
        </section>
        <section anchor-label="Section4">
          <span>Section one 4</span>
        </section>
      </Anchor.Wrap>
    </div>
  );
}
