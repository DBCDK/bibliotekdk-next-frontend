import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import Section from "./Section";
import useBreakpoint from "@/components/hooks/useBreakpoint";

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
        Section component is used for consistent page layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Section title="Some Title">Some section content</Section>
    </div>
  );
}

export function Subtitle() {
  return (
    <div>
      <StoryTitle>Section</StoryTitle>
      <StoryDescription>Section component with a subtitle.</StoryDescription>
      <StorySpace direction="v" space="8" />
      <Section title="Some Title" subtitle={<div>Some Subtitle</div>}>
        Some section content
      </Section>
    </div>
  );
}

export function backgroundColor() {
  return (
    <div>
      <StoryTitle>Section</StoryTitle>
      <StoryDescription>
        Section component is used for consistent page layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Section title="Some Title" backgroundColor="lightgrey">
        Some section content
      </Section>
    </div>
  );
}

export function NoSpace() {
  return (
    <div>
      <StoryTitle>Section</StoryTitle>
      <StoryDescription>
        Section component, no top and bottom space.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Section title="Some Title" space={false}>
        Some section content
      </Section>
    </div>
  );
}

export function ExtraSpace() {
  return (
    <div>
      <StoryTitle>Section</StoryTitle>
      <StoryDescription>
        Section component spaced with 100px in top and bottom, inspect to see
        the result
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Section title="Some Title" space={{ top: 100, bottom: 100 }}>
        Some section content
      </Section>
    </div>
  );
}

export function DividerFalse() {
  return (
    <div>
      <StoryTitle>Section</StoryTitle>
      <StoryDescription>
        Setting the divider prop to false, removes both title and content
        divider
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Section title="Some Title" divider={false}>
        Some section content
      </Section>
    </div>
  );
}

export function TitleDividerFalse() {
  return (
    <div>
      <StoryTitle>Section</StoryTitle>
      <StoryDescription>No title divider setting</StoryDescription>
      <StorySpace direction="v" space="8" />
      <Section title="Some Title" divider={{ title: false }}>
        Some section content
      </Section>
    </div>
  );
}

export function RemoveDividerOnMobile() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm" || false;

  return (
    <div>
      <StoryTitle>Section</StoryTitle>
      <StoryDescription>
        Removes all dividers on mobile devices 768px width. Note that content
        divider gets removed on 992px width.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Section title="Some Title" divider={!isMobile}>
        Some section content
      </Section>
    </div>
  );
}

export function CustomDivider() {
  //
  function CustomDivider({ color: borderColor }) {
    return <hr style={{ borderColor }} />;
  }

  return (
    <div>
      <StoryTitle>Section</StoryTitle>
      <StoryDescription>Custom dividers can be added as props</StoryDescription>
      <StorySpace direction="v" space="8" />
      <Section
        title="Some Title"
        divider={{
          title: <CustomDivider color="red" />,
          content: <CustomDivider color="blue" />,
        }}
      >
        Some section content
      </Section>
    </div>
  );
}
