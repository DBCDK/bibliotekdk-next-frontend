import { Fragment } from "react";
import { StoryTitle, StorySpace } from "@/storybook";

import Text from "./Text";

export default {
  title: "base/Texts",
};

// Current text types
const texts = ["text1", "text2", "text3", "text4"];
const size = ["17/26, 600", "17/26, 400", "14/22, 400", "14/22, 600"];

/**
 * Returns all Text types
 *
 */
export function Body() {
  return (
    <div>
      <StoryTitle>Body Text</StoryTitle>

      <div style={{ maxWidth: 600 }}>
        {texts.map((type, i) => (
          <Fragment key={type}>
            <StoryTitle>
              {type} [{size[i]}]
            </StoryTitle>

            <Text type={type}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              mollis purus a iaculis finibus. Integer lacus dui, condimentum
              quis elit in, feugiat hendrerit urna. Etiam facilisis id ligula
              congue ultrices.
            </Text>

            <StorySpace space="2" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * Show how to line clamp
 *
 */
export function LineClamping() {
  return (
    <div>
      <StoryTitle>Line clamping: Max 3 lines</StoryTitle>
      <div style={{ maxWidth: 400 }}>
        <Text type="text2" lines={3} clamp={true}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla mollis
          purus a iaculis finibus. Integer lacus dui, condimentum quis elit in,
          feugiat hendrerit urna. Etiam facilisis id ligula congue ultrices.
        </Text>
      </div>
    </div>
  );
}

/**
 * Returns all Text types in skeleton loading mode (note the numer of lines wanted)
 *
 */
export function Loading() {
  const type = "text2";
  return (
    <div>
      <StoryTitle>Loading Text</StoryTitle>

      <div style={{ maxWidth: 600 }}>
        <StoryTitle>2 lines [{type}]</StoryTitle>
        <Text type={type} skeleton={true} lines={2} />

        <StoryTitle>3 lines [{type}]</StoryTitle>
        <Text type={type} skeleton={true} lines={3} />

        <StoryTitle>4 lines [{type}]</StoryTitle>
        <Text type={type} skeleton={true} lines={4} />
      </div>
    </div>
  );
}
