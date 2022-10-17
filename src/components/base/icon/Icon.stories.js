import { Fragment } from "react";
import { StoryTitle, StorySpace } from "@/storybook";

import Icon from "./Icon";

const exportedObject = {
  title: "base/Icon",
};

export default exportedObject;

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
          <Fragment key={size}>
            <Icon src={src} size={{ w: size, h: "auto" }} />
            <StorySpace space="5" />
          </Fragment>
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
          <Fragment key={size}>
            <Icon src={src} size={{ w: size, h: size }} bgColor={bgColor} />
            <StorySpace space="5" />
          </Fragment>
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
          <Fragment key={size}>
            <Icon
              src={src1}
              size={{ w: size, h: "auto" }}
              skeleton={skeleton}
            />
            <StorySpace space="5" />
          </Fragment>
        );
      })}

      <StoryTitle>Loading round icons</StoryTitle>
      {sizes.map((size) => {
        return (
          <Fragment key={size}>
            <Icon
              src={src2}
              size={{ w: size, h: size }}
              bgColor={bgColor}
              skeleton={skeleton}
            />
            <StorySpace space="5" />
          </Fragment>
        );
      })}
    </div>
  );
}
