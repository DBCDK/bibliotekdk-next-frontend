import { StoryTitle, StoryDescription, StorySpace } from "./Storybook";

export default {
  title: "Storybook",
};

/**
 * Returns storybook title component
 *
 */
export const StorybookTitle = () => {
  return (
    <div>
      <StoryTitle copy>This is a title used in storybook</StoryTitle>
    </div>
  );
};

/**
 * Returns storybook description component
 *
 */
export const StorybookDescription = () => {
  return (
    <div>
      <StoryDescription copy>
        This is a description used in storybook
      </StoryDescription>
    </div>
  );
};

/**
 * Returns storybook description component
 *
 */
export const StorybookSpace = () => {
  return (
    <div>
      <StoryTitle>Spacings used between storybook elements</StoryTitle>
      <StoryDescription>
        Horizontal space used between elements in storybook. In this demo, space
        is illustrated with a blue color.
      </StoryDescription>

      <div>
        <StorySpace demo={true} space="1" />
        <StorySpace space="1" />
        <StorySpace demo={true} space="2" />
        <StorySpace space="1" />
        <StorySpace demo={true} space="3" />
        <StorySpace space="1" />
        <StorySpace demo={true} space="4" />
        <StorySpace space="1" />
        <StorySpace demo={true} space="5" />
        <StorySpace space="1" />
        <StorySpace demo={true} space="6" />
        <StorySpace space="1" />
        <StorySpace demo={true} space="7" />
        <StorySpace space="1" />
        <StorySpace demo={true} space="8" />
      </div>
      <StoryTitle> </StoryTitle>
      <StoryDescription>
        Vertical space used between elements in storybook. In this demo, space
        is illustrated with a blue color.
      </StoryDescription>
      <div>
        <StorySpace demo={true} direction="v" space="1" />
        <StorySpace space="1" />
        <StorySpace demo={true} direction="v" space="2" />
        <StorySpace space="1" />
        <StorySpace demo={true} direction="v" space="3" />
        <StorySpace space="1" />
        <StorySpace demo={true} direction="v" space="4" />
        <StorySpace space="1" />
        <StorySpace demo={true} direction="v" space="5" />
        <StorySpace space="1" />
        <StorySpace demo={true} direction="v" space="6" />
        <StorySpace space="1" />
        <StorySpace demo={true} direction="v" space="7" />
        <StorySpace space="1" />
        <StorySpace demo={true} direction="v" space="8" />
      </div>

      <StorySpace direction="v" space="3" />
      <StorySpace direction="h" space="2" />

      <StorySpace copy />
    </div>
  );
};
