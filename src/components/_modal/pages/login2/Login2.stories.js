import { StoryTitle, StoryDescription } from "@/storybook";
import Login2 from "./Login2";
import Translate from "@/components/base/translate";

const exportedObject = {
  title: "modal/Login",
};

export default exportedObject;

/**
 * Menu template
 *
 */
export function Login2Order() {
  const context = {
    title: Translate({ context: "login", label: "login-to-order" }),
  };
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Login Modal</StoryTitle>
      <StoryDescription>
        Shows the login modal coming from order button
      </StoryDescription>

      <Login2 context={context} />
    </div>
  );
}

export function Login2Login() {
  const context = {
    title: Translate({ context: "header", label: "login" }),
  };
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Login Modal</StoryTitle>
      <StoryDescription>
        Shows the login modal coming from login button in header
      </StoryDescription>

      <Login2 context={context} />
    </div>
  );
}
