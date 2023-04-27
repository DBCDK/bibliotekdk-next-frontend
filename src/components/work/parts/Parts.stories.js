import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { Parts } from "./Parts";

const exportedObject = {
  title: "work/Parts",
};

export default exportedObject;

export function PartSection() {
  const modalOpen = () => {
    alert("Open parts");
  };

  const parts = [
    {
      title: "hest",
      playingTime: "2,47",
    },
    {
      title: "fisk",
    },
    {
      title: "hund",
      playingTime: "400 minutter",
    },
  ];

  return (
    <div>
      <StoryTitle>Parts section</StoryTitle>
      <StoryDescription>
        Work Parts component. List of songs on a record .. or content in
        sheetmusic
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Parts modalOpen={modalOpen} type="DVD" parts={parts} />
    </div>
  );
}
