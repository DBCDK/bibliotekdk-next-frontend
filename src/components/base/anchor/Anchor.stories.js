import { StoryTitle, StoryDescription } from "@/storybook";

import Anchor from "./";

const exportedObject = {
  title: "Base/Anchor",
};

export default exportedObject;

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
          <div>Section 1</div>
        </section>
        <section anchor-label="Section2" style={styles}>
          <div>Section 2</div>
        </section>
        <section anchor-label="Section3" style={styles}>
          <div>Section 3</div>
        </section>
        <section
          anchor-label="Section4"
          style={styles}
          data-cy={"Section4-section"}
        >
          <div>Section 4</div>
        </section>
        <section anchor-label="Section5" style={styles}>
          <div>Section 5</div>
        </section>
      </Anchor.Wrap>
    </div>
  );
}

/**
 * Anchor - anchor -page menu
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
      <StoryTitle>Anchor Menu - 2 Removed sections</StoryTitle>
      <StoryDescription>
        {`Section 2 has no \"anchor-label\" and is therefor not rendered. Section 3
        has no height, and is therefor also removed.`}
      </StoryDescription>
      <Anchor.Wrap>
        <Anchor.Menu />
        <section anchor-label="Section1" style={styles}>
          <span>Section 1</span>
        </section>
        <section style={styles}>
          <span>Section 2</span>
        </section>
        <section
          anchor-label="Section3"
          style={{ ...styles, height: 0 }}
        ></section>
        <section anchor-label="Section4" style={styles}>
          <span>Section 4</span>
        </section>
        <section anchor-label="Section5" style={styles}>
          <span>Section 5</span>
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
          <span>Section 1</span>
        </section>
        <Anchor.Menu />
        <section anchor-label="Section2" style={styles}>
          <span>Section 2</span>
        </section>
        <section anchor-label="Section3" style={styles}>
          <span>Section 3</span>
        </section>
        <section anchor-label="Section4" style={styles}>
          <span>Section 4</span>
        </section>
        <section anchor-label="Section5" style={styles}>
          <span>Section 5</span>
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
          <span>Section 1</span>
        </section>
        <section anchor-label="Section2" style={styles}>
          <span>Section 2</span>
        </section>
        <Anchor.Menu stickyTop={true} stickyBottom={true} />
        <section anchor-label="Section3" style={styles}>
          <span>Section 3</span>
        </section>
        <section anchor-label="Section4" style={styles}>
          <span>Section 4</span>
        </section>
        <section anchor-label="Section5" style={styles}>
          <span>Section 5</span>
        </section>
      </Anchor.Wrap>
    </div>
  );
}
