import { StoryTitle, StoryDescription } from "@/storybook";

import Email from "./";

const exportedObject = {
  title: "base/Forms/Email",
};

export default exportedObject;

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
        onChange={(value, valid) => {
          return console.log(
            `email input: ${value.target.value} is valid: ${valid.status}`
          );
        }}
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
        onBlur={(value, valid) => {
          return console.log(
            `email input: ${value.target.value} is valid: ${valid.status}`
          );
        }}
      />
    </div>
  );
}
