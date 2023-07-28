import { StoryTitle, StoryDescription } from "@/storybook";
import Login from "./Login";
import Translate from "@/components/base/translate";

const exportedObject = {
  title: "modal/Login",
};

export default exportedObject;

/**
 * Menu template
 *
 */
export function LoginOrder() {
  const context = {
    title: Translate({ context: "login", label: "login-to-order" }),
  };
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Login Modal</StoryTitle>
      <StoryDescription>
        Shows the login modal coming from order button
      </StoryDescription>

      <Login context={context} />
    </div>
  );
}

export function LoginLogin() {
  const context = {
    title: Translate({ context: "header", label: "login" }),
  };
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Login Modal</StoryTitle>
      <StoryDescription>
        Shows the login modal coming from login button in header
      </StoryDescription>

      <Login context={context} />
    </div>
  );
}
