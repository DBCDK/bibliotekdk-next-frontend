import { StoryTitle, StoryDescription } from "@/storybook";
import { validateEmail } from "@/utils/validateEmail";
import { useState } from "react";

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
  const [valid, setValid] = useState(false);
  return (
    <div>
      <StoryTitle>Email validation failed</StoryTitle>
      <StoryDescription>
        Validating input onChange (console.logs response)
      </StoryDescription>
      <Email
        value="invalid@mail."
        valid={valid}
        onChange={(value) => {
          setValid(validateEmail(value.target.value));
          return console.log(
            `email input: ${value.target.value} is valid: ${valid}`
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
  const [valid, setValid] = useState(true);
  return (
    <div>
      <StoryTitle>Email validation</StoryTitle>
      <StoryDescription>
        Validating input onBlur (console.logs response)
      </StoryDescription>
      <Email
        valid={valid}
        onBlur={(value, message) => {
          setValid(validateEmail(value.target.value));
          return console.log(
            `email input: ${
              value.target.value
            } is valid: ${valid} message ${JSON.stringify(message.label)}}`
          );
        }}
      />
    </div>
  );
}
