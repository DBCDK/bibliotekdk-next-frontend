import { Fragment } from "react";
import { StoryTitle } from "@/storybook";

import Title from "./Title";

const exportedObject = {
  title: "base/Titles",
};

export default exportedObject;

// Current title types
const titles = [
  "title1",
  "title2",
  "title3",
  "title4",
  "title5",
  "title6",
  "title7",
];
const size = [
  "80/92 - 400",
  "48/62 - 400",
  "40/52 - 400",
  "24/32 - 500",
  "24/32 - 400",
  "18/24 - 400",
  "18/24 - 400 (work overview specific - grows on larger screens)",
];

/**
 * Returns all Titles as h1 tags
 *
 */
export function Titles() {
  return (
    <div>
      <StoryTitle>Titles</StoryTitle>

      {titles.map((type, i) => (
        <Fragment key={type}>
          <StoryTitle>{`${type} [${size[i]}]`}</StoryTitle>
          <Title tag="h1" key={type} type={type}>
            Hello World
          </Title>
        </Fragment>
      ))}
    </div>
  );
}

/**
 * Returns all Titles as h1 in skeleton loading mode
 *
 */
export function Loading() {
  return (
    <div>
      <StoryTitle>Loading Titles</StoryTitle>

      {titles.map((type) => (
        <Fragment key={type}>
          <StoryTitle>{`Loading Title [${type}]`}</StoryTitle>

          <Title tag="h1" type={type} skeleton={true}>
            Hello World
          </Title>
        </Fragment>
      ))}
    </div>
  );
}
