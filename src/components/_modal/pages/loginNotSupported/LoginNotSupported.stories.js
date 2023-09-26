import { StoryTitle, StoryDescription } from "@/storybook";
import LoginNotSupported from "./LoginNotSupported";

const exportedObject = {
  title: "modal/LoginNotSupported",
};

export default exportedObject;

export function NotSupported() {
  const context = {
    libraryName: "CBS Bibliotek",
  };
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Login Modal</StoryTitle>
      <StoryDescription>
        Shows the login modal coming from login button in header
      </StoryDescription>

      <LoginNotSupported context={context} />
    </div>
  );
}
