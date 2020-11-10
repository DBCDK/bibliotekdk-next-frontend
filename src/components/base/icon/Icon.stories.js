import { StoryTitle, StorySpace } from "@/storybook";

import Icon from "./Icon";

export default {
  title: "Icon",
};

// Current button types
const sizes = [2, 3, 4, 5, 6];

/**
 * Return Icon with no background fill
 *
 */
export function BasicIcon() {
  const src = "ornament1.svg";

  return (
    <div>
      <StoryTitle>Icons sized according to width [auto height]</StoryTitle>
      {sizes.map((size) => {
        return (
          <React.Fragment key={size}>
            <Icon src={src} size={size} />
            <StorySpace space="5" />
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * Returns Round Icon with background fill
 *
 */
export function RoundIcon() {
  const src = "checkmark.svg";
  const bgColor = "var(--blue)";

  return (
    <div>
      <StoryTitle>Icons sized according to width and height</StoryTitle>
      {sizes.map((size) => {
        return (
          <React.Fragment key={size}>
            <Icon src={src} size={size} bgColor={bgColor} />
            <StorySpace space="5" />
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * Return Loading version of round Icon
 *
 */
export function Loading() {
  const src1 = "ornament1.svg";
  const src2 = "checkmark.svg";
  const bgColor = "var(--blue)";
  const skeleton = true;

  return (
    <div>
      <StoryTitle>Loading basic icons</StoryTitle>
      {sizes.map((size) => {
        return (
          <React.Fragment key={size}>
            <Icon src={src1} size={size} skeleton={skeleton} />
            <StorySpace space="5" />
          </React.Fragment>
        );
      })}

      <StoryTitle>Loading round icons</StoryTitle>
      {sizes.map((size) => {
        return (
          <React.Fragment key={size}>
            <Icon
              src={src2}
              size={size}
              bgColor={bgColor}
              skeleton={skeleton}
            />
            <StorySpace space="5" />
          </React.Fragment>
        );
      })}
    </div>
  );
}
