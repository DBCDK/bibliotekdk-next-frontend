import { useState } from "react";
import { StoryTitle, StoryDescription } from "@/storybook";

import Email from ".";

export default {
  title: "base/Forms/Email",
};

/**
 * Default email field
 *
 */
export function Default() {
  return (
    <div>
      <StoryTitle>Email field</StoryTitle>
      <Email />
    </div>
  );
}

/**
 * Default email field
 *
 */
export function ValidationOnChange() {
  return (
    <div>
      <StoryTitle>Email validation</StoryTitle>
      <StoryDescription>
        Validating input onChange (console.logs response)
      </StoryDescription>
      <Email
        value="invalid@mail."
        onChange={(value, valid) =>
          console.log(("email input", { value, valid }))
        }
      />
    </div>
  );
}

/**
 * Default email field
 *
 */
export function ValidationOnBlur() {
  return (
    <div>
      <StoryTitle>Email validation</StoryTitle>
      <StoryDescription>
        Validating input onBlur (console.logs response)
      </StoryDescription>
      <Email
        onBlur={(value, valid) =>
          console.log(("email input", { value, valid }))
        }
      />
    </div>
  );
}
