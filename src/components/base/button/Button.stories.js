import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import Button from "./Button";
import Skeleton from "@/components/base/skeleton";
import { useEffect, useState } from "react";

export default {
  title: "Buttons",
};

// Current button types
const sizes = ["large", "medium", "small"];

/**
 * Returns all primary buttons (Default button style)
 *
 */
export function Primary() {
  const type = "primary";

  return (
    <div>
      <StoryTitle>Primary buttons</StoryTitle>
      <StoryDescription>
        Primary buttons takes up 100% of width [block]
      </StoryDescription>
      <div style={{ maxWidth: 400 }}>
        {sizes.map((size) => (
          <React.Fragment key={`${type}-${size}`}>
            <Button type={type} size={size}>
              {size}
            </Button>
            <StorySpace space="2" />
          </React.Fragment>
        ))}
      </div>

      <StoryTitle>[Disabled] Primary buttons </StoryTitle>

      <div style={{ maxWidth: 400 }}>
        {sizes.map((size) => (
          <React.Fragment key={`${type}-${size}`}>
            <Button type={type} size={size} disabled={true}>
              {size}
            </Button>
            <StorySpace space="2" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * Returns all Secondary buttons
 *
 */
export function Secondary() {
  const type = "secondary";

  return (
    <div>
      <StoryTitle>Secondary buttons </StoryTitle>
      <StoryDescription>
        Secondary buttons adapts to content [inline]
      </StoryDescription>
      {sizes.map((size) => (
        <React.Fragment key={`${type}-${size}`}>
          <Button type={type} size={size}>
            {size}
          </Button>
          <StorySpace space="2" />
        </React.Fragment>
      ))}

      <StoryTitle>[Disabled] Secondary buttons </StoryTitle>

      {sizes.map((size) => (
        <React.Fragment key={`${type}-${size}`}>
          <Button type={type} size={size} disabled={true}>
            {size}
          </Button>
          <StorySpace space="2" />
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Returns a skeleton loading version of the buttons
 *
 */
export function Loading() {
  const type = "secondary";

  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsSlow(!isSlow), 4500);
  }, [isSlow]);

  return (
    <div>
      <StoryTitle>Loading Secondary buttons </StoryTitle>
      <StoryDescription>
        Normal skeleton loading version of the secondary button
      </StoryDescription>

      {sizes.map((size) => (
        <React.Fragment key={`${type}-${size}`}>
          <Button type={type} size={size} skeleton={true}>
            {size}
          </Button>
          <StorySpace space="2" />
        </React.Fragment>
      ))}

      <StoryTitle>[isSlow] Loading Secondary buttons</StoryTitle>
      <StoryDescription>
        This Loading version is used when expected loadtime has been exceeded.
        The failed (red) loading animation is shown by passing an isSlow prop.
      </StoryDescription>

      {sizes.map((size) => (
        <React.Fragment key={`${type}-${size}`}>
          <Button className="relative" disabled={true} type={type} size={size}>
            <Skeleton isSlow={isSlow} />
            {size}
          </Button>

          <StorySpace space="2" />
        </React.Fragment>
      ))}
    </div>
  );
}
