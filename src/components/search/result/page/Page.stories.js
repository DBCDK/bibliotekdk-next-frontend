import { StoryTitle, StoryDescription } from "@/storybook";
import { ResultPage } from ".";

export default {
  title: "search/Result",
};

export function Default() {
  const rows = [
    {
      id: "some-id-1",
      cover: {
        detail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=22629344&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=0136749c6e9729d895ed",
      },
      creators: [
        {
          name: "Joanne K. Rowling",
        },
      ],
      materialTypes: [
        {
          materialType: "Bog",
        },
        {
          materialType: "Diskette",
        },
        {
          materialType: "Ebog",
        },
        {
          materialType: "Lydbog (bånd)",
        },
        {
          materialType: "Lydbog (cd)",
        },
        {
          materialType: "Lydbog (cd-mp3)",
        },
        {
          materialType: "Lydbog (net)",
        },
        {
          materialType: "Punktskrift",
        },
      ],
      path: ["Bøger", "Fiktion", "skønlitteratur", "roman"],
      title: "Harry Potter og De Vises Sten",
    },
    {
      id: "some-id-2",
      cover: {
        detail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=22677780&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=01f2186198e525d002a2",
      },
      creators: [
        {
          name: "Joanne K. Rowling",
        },
      ],
      materialTypes: [
        {
          materialType: "Bog",
        },
        {
          materialType: "Diskette",
        },
        {
          materialType: "Ebog",
        },
        {
          materialType: "Lydbog (bånd)",
        },
        {
          materialType: "Lydbog (cd)",
        },
        {
          materialType: "Lydbog (cd-mp3)",
        },
        {
          materialType: "Lydbog (net)",
        },
        {
          materialType: "Punktskrift",
        },
      ],
      path: ["Bøger", "Fiktion", "skønlitteratur", "roman"],
      title: "Harry Potter og Hemmelighedernes Kammer",
    },
    {
      id: "some-id-3",
      cover: {
        detail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=24880605&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=87f28c0762bb189c72bb",
      },
      creators: [
        {
          name: "Joanne K. Rowling",
        },
      ],
      materialTypes: [
        {
          materialType: "Bog",
        },
        {
          materialType: "Diskette",
        },
        {
          materialType: "Ebog",
        },
        {
          materialType: "Lydbog (bånd)",
        },
        {
          materialType: "Lydbog (cd)",
        },
        {
          materialType: "Lydbog (cd-mp3)",
        },
        {
          materialType: "Lydbog (net)",
        },
        {
          materialType: "Punktskrift",
        },
      ],
      path: ["Bøger", "Fiktion", "skønlitteratur", "roman"],
      title: "Harry Potter og Fønixordenen",
    },
  ];
  return (
    <div>
      <StoryTitle>Result</StoryTitle>
      <StoryDescription>Multiple results found</StoryDescription>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <ResultPage rows={rows} />
      </div>
    </div>
  );
}

export function Partial() {
  const partial = [
    {
      title: "Harry Potter og de vises sten",
      creator: {
        name: "Joanne K. Rowling",
      },
    },
    {
      title: "Harry Potter og Hemmelighedernes Kammer",
      creator: {
        name: "Joanne K. Rowling",
      },
    },
    {
      title: "Harry Potter og Fønixordenen",
      creator: {
        name: "Joanne K. Rowling",
      },
    },
  ];
  return (
    <div>
      <StoryTitle>Partial data fetched</StoryTitle>
      <StoryDescription>Partial fetched data visible</StoryDescription>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <ResultPage rows={partial} />
      </div>
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <StoryTitle>Loading version</StoryTitle>
      <StoryDescription>No data ready to show</StoryDescription>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <ResultPage isLoading={true} />
      </div>
    </div>
  );
}
