import { StoryTitle, StoryDescription } from "@/storybook";
import { useState } from "react";
import Pagination from "../pagination/Pagination";
import QuickFilters from "../quickfilters";
import { Result } from "./Result";
import { ResultPage } from "./page";

export default {
  title: "search/Result",
};

export function SearchResult() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSelected, setSelectedView] = useState();
  const rows = [
    {
      title: "Harry Potter og de vises sten",
      work: {
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
    },
    {
      title: "Harry Potter og Hemmelighedernes Kammer",
      work: {
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
    },
    {
      title: "Harry Potter og Fønixordenen",
      work: {
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
    },
  ];
  return (
    <div>
      <StoryTitle>Search Result section</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <QuickFilters
        onViewSelect={setSelectedView}
        viewSelected={viewSelected}
      />
      <Result
        hitcount="1234"
        onViewSelect={setSelectedView}
        viewSelected={viewSelected}
      >
        <ResultPage rows={rows} />
      </Result>
      <Pagination currentPage={currentPage} onChange={setCurrentPage} />
    </div>
  );
}

export function SearchResult_Partial() {
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
      <StoryTitle>Search Result section with partial data</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <QuickFilters />
      <Result rows={partial} />
      <Pagination isLoading={true} />
    </div>
  );
}

export function SearchResult_isLoading() {
  return (
    <div>
      <StoryTitle>Search Result section with partial data</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <QuickFilters />
      <Result isLoading={true} />
      <Pagination isLoading={true} />
    </div>
  );
}
