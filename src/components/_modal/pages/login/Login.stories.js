import { StoryTitle, StoryDescription } from "@/storybook";
import Login from "./Login";
import Translate from "@/components/base/translate";
import { useModal } from "@/components/_modal";

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
  const modal = useModal();

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Login Modal</StoryTitle>
      <StoryDescription>
        Shows the login modal coming from reservation button
      </StoryDescription>

      <Login context={context} modal={modal} />
    </div>
  );
}

export function LoginHeader() {
  const context = {
    title: Translate({ context: "header", label: "login" }),
  };
  const modal = useModal();
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Login Modal</StoryTitle>
      <StoryDescription>
        Shows the login modal coming from login button in header
      </StoryDescription>

      <Login context={context} modal={modal} />
    </div>
  );
}

LoginHeader.story = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Query: {
          monitor: () => "some-monitor",
        },
        BranchResult: {
          hitcount: () => "10",
          agencyUrl: () => "some-agencyUrl",
          result: () => [
            {
              name: "Test agency",
            },
            { name: "Test agency 2" },
          ],
        },
        Highlight: {
          key: () => "some-key",
          value: () => "some-value",
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/",
      query: {},
    },
  },
};
