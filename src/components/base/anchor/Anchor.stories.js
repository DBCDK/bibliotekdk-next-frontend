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
    height: "100vh",
    backgroundImage: "linear-gradient(var(--concrete), white)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  };

  return (
    <div>
      <StoryTitle>Anchor menu (Default)</StoryTitle>
      <StoryDescription>
        Onepage anchor menu with smooth scrollTo actions, will default stick to
        the top of the window.
      </StoryDescription>
      <Anchor.Wrap>
        <Anchor.Menu />
        <section anchor-label="Section1" style={styles}>
          <span>Section one 1</span>
        </section>
        <section anchor-label="Section2" style={styles}>
          <span>Section one 2</span>
        </section>
        <section anchor-label="Section3" style={styles}>
          <span>Section one 3</span>
        </section>
        <section anchor-label="Section4" style={styles}>
          <span>Section one 4</span>
        </section>
        <section anchor-label="Section5" style={styles}>
          <span>Section one 5</span>
        </section>
      </Anchor.Wrap>
    </div>
  );
}

/**
 * Anchor - anchor one-page menu
 *
 */

export function MissingAnchorLabel() {
  const styles = {
    height: "100vh",
    backgroundImage: "linear-gradient(var(--concrete), white)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  };

  return (
    <div>
      <StoryTitle>Anchor Menu - No section 2</StoryTitle>
      <StoryDescription>
        Section 2 has no "anchor-label" and is therefor not rendered.
      </StoryDescription>
      <Anchor.Wrap>
        <Anchor.Menu />
        <section anchor-label="Section1" style={styles}>
          <span>Section one 1</span>
        </section>
        <section style={styles}>
          <span>Section one 2</span>
        </section>
        <section anchor-label="Section3" style={styles}>
          <span>Section one 3</span>
        </section>
        <section anchor-label="Section4" style={styles}>
          <span>Section one 4</span>
        </section>
        <section anchor-label="Section5" style={styles}>
          <span>Section one 5</span>
        </section>
      </Anchor.Wrap>
    </div>
  );
}

/**
 * Anchor - anchor one-page menu
 *
 */

export function SectionsAboveMenu() {
  const styles = {
    height: "100vh",
    backgroundImage: "linear-gradient(var(--concrete), white)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  };

  return (
    <div>
      <StoryTitle>Anchor Menu</StoryTitle>
      <StoryDescription>
        Menu can be placed between sections, and will auto-stick to the top.
      </StoryDescription>
      <Anchor.Wrap>
        <section anchor-label="Section1" style={styles}>
          <span>Section one 1</span>
        </section>
        <Anchor.Menu />
        <section anchor-label="Section2" style={styles}>
          <span>Section one 2</span>
        </section>
        <section anchor-label="Section3" style={styles}>
          <span>Section one 3</span>
        </section>
        <section anchor-label="Section4" style={styles}>
          <span>Section one 4</span>
        </section>
        <section anchor-label="Section5" style={styles}>
          <span>Section one 5</span>
        </section>
      </Anchor.Wrap>
    </div>
  );
}

/**
 * Anchor - anchor one-page menu
 *
 */

export function StickyTopAndBottom() {
  const styles = {
    height: "100vh",
    backgroundImage: "linear-gradient(var(--concrete), white)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  };

  return (
    <div>
      <StoryTitle>Anchor Menu</StoryTitle>
      <StoryDescription>
        Menu can be placed between sections, and will auto-stick to the top.
      </StoryDescription>
      <Anchor.Wrap>
        <section anchor-label="Section1" style={styles}>
          <span>Section one 1</span>
        </section>
        <section anchor-label="Section2" style={styles}>
          <span>Section one 2</span>
        </section>
        <Anchor.Menu stickyTop={true} stickyBottom={true} />
        <section anchor-label="Section3" style={styles}>
          <span>Section one 3</span>
        </section>
        <section anchor-label="Section4" style={styles}>
          <span>Section one 4</span>
        </section>
        <section anchor-label="Section5" style={styles}>
          <span>Section one 5</span>
        </section>
      </Anchor.Wrap>
    </div>
  );
}
