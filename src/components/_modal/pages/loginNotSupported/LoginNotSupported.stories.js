import { StoryTitle, StoryDescription } from "@/storybook";
import LoginNotSupported from "./LoginNotSupported";
import Translate from "@/components/base/translate";

const exportedObject = {
  title: "modal/LoginNotSupported",
};

export default exportedObject;

export function NotSupported() {
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Login Modal</StoryTitle>
      <StoryDescription>
        Shows the login modal coming from login button in header
      </StoryDescription>

      <LoginNotSupported libraryName="CBS Bibliotek" />
    </div>
  );
}
