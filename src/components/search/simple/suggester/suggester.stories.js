import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import { useState } from "react";
import { Suggester } from "./Suggester";

import Button from "@/components/base/button";
import { SuggestTypeEnum } from "@/lib/enums";

const exportedObject = {
  title: "search/Suggester",
};

export default exportedObject;

export function HeaderSuggester() {
  const [isMobile, setIsMobile] = useState(false);
  const [query, setQuery] = useState("");

  const suggestions = [
    {
      type: "Title",
      term: "Ternet Ninja",
      highlight: "Ternet Ninja",
      cover: {
        thumbnail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=46718208&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=798de63083c13721cb07",
      },
    },
    {
      type: "Subject",
      term: "ninjaer",
      highlight: "ninjaer",
    },
    {
      type: "Creator",
      term: "Anders Matthesen",
      highlight: "Anders Matthesen",
      imageUrl:
        "https://forfatterweb.dk/sites/default/files/styles/top_image/public/2019-09/Matthesen%20Anders1_1200_besk%C3%A5ret_forfatterweb.jpg?itok=ANfChbLr",
    },
  ];

  const history = [
    { type: "History", term: "Anders Matthesen" },
    { type: "History", term: "Ternet Ninja" },
  ];

  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>{isMobile ? "Mobile" : "Desktop"} Suggester</StoryTitle>
      <StoryDescription>
        Suggester showing 3 different result types. Suggester comes in both
        mobile and desktop version, with some different behavior and design.
      </StoryDescription>

      <Button
        type="secondary"
        size="small"
        onClick={() => setIsMobile(!isMobile)}
        dataCy="button-mobile" // ← tilføj denne
      >
        {isMobile ? "Switch to Desktop" : "Switch to Mobile"}
      </Button>

      <StorySpace direction="v" space="4" />

      <div style={{ maxWidth: "600px", position: "relative" }}>
        <Suggester
          query={query}
          isMobile={isMobile}
          suggestions={suggestions}
          history={history}
          selectedMaterial={SuggestTypeEnum.ALL}
          onChange={(q) => setQuery(q)}
          onClose={() => alert("Closed")}
          onSelect={(val, suggestion) =>
            alert(`Valgt: ${val} (type: ${suggestion?.type})`)
          }
          clearHistory={() => alert("Historik ryddet")}
        />
      </div>
    </div>
  );
}
