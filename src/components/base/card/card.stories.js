import { StoryTitle, StoryDescription } from "@/storybook";

import Card from "./Card";

const exportedObject = {
  title: "base/Cards",
};

export default exportedObject;

export function WorkNarrowAndWideCover() {
  const narrow = {
    creators: [
      {
        name: "Ruth Rendell",
      },
      {
        name: "Asta Smith-Hansen",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=28756674&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=4d36c639cc28e6f7da2c",
    },
    description:
      "Krimi med kommissær Wexford og hans makker Burden på sporet af historien bag fundet af to lig, der var gravet ned 11 og 8 år tidligere. Beboerne i den lille by Kingsmarkham har mange hemmeligheder, og nogle af dem er dystre",
    id: "work-id-1",
    title: "Ikke i kød og blod",
  };

  const wide = {
    creators: [
      {
        name: "Andrew Taylor (f. 1951)",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=29388598&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=d7fd87c75aaaa00955b5",
    },
    description:
      "Kriminalroman. Da den aldrende enkemand Rufus bliver fundet død, lyder kendelsen på selvmord, men det er kriminalassistent Thornhill ikke tilfreds med. Han graver i sagen, som involverer mange personer, herunder hans egen kone Edith, da dødsfaldet viser sig at have tråde tilbage til mystiske dødsfald i 1938",
    id: "work-id-2",
    title: "Blodrøde spor",
  };

  const longTitle = {
    creators: [
      {
        name: "Some Creator",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=29388598&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=d7fd87c75aaaa00955b5",
    },
    description:
      "Kriminalroman. Da den aldrende enkemand Rufus bliver fundet død, lyder kendelsen på selvmord, men det er kriminalassistent Thornhill ikke tilfreds med. Han graver i sagen, som involverer mange personer, herunder hans egen kone Edith, da dødsfaldet viser sig at have tråde tilbage til mystiske dødsfald i 1938",
    id: "work-id-3",
    title: "I am a very long title, so long and very long. Its really long",
  };

  return (
    <div>
      <StoryTitle>Work: Narrow and wide covers</StoryTitle>
      <StoryDescription>
        {`The work card has fixed dimensions. Lines are clamped, and cover is
        \"contained\" in a fixed sized box`}
      </StoryDescription>
      <div style={{ display: "flex" }}>
        <Card {...narrow} />
        <Card {...wide} />
        <Card {...longTitle} />
      </div>
    </div>
  );
}
WorkNarrowAndWideCover.story = {
  parameters: {
    nextRouter: {
      showInfo: true,
    },
  },
};

export function SeriesCard() {
  const part = {
    creators: [
      {
        name: "Andrew Taylor (f. 1951)",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=29388598&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=d7fd87c75aaaa00955b5",
    },
    description:
      "Kriminalroman. Da den aldrende enkemand Rufus bliver fundet død, lyder kendelsen på selvmord, men det er kriminalassistent Thornhill ikke tilfreds med. Han graver i sagen, som involverer mange personer, herunder hans egen kone Edith, da dødsfaldet viser sig at have tråde tilbage til mystiske dødsfald i 1938",
    id: "work-id-2",
    title: "Blodrøde spor",
    series: {
      part: 17,
    },
  };

  return (
    <div>
      <StoryTitle>Work: part 17 of series</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <Card {...part} />
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <StoryTitle>Loading</StoryTitle>

      <Card skeleton={true} />
    </div>
  );
}
