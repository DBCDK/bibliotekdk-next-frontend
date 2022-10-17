import {
  StoryTitle,
  StoryDescription,
  StoryLabel,
  StorySpace,
} from "@/storybook";

import { useState } from "react";

import { Suggester } from "./Suggester";

import Button from "@/components/base/button";

// Templates fro suggester results
import Creator from "./templates/creator";
import Work from "./templates/work";
import Subject from "./templates/subject";
import History from "./templates/history";

const exportedObject = {
  title: "search/Suggester",
};

export default exportedObject;

/**
 * Returns Suggester
 *
 */
export function HeaderSuggester() {
  const [isMobile, setIsMobile] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>{isMobile ? "Mobile" : "Desktop"} Suggester</StoryTitle>
      <StoryDescription>
        Suggester showing 3 different result types. Suggester comes in both
        mobile and desktop version, with some different changes and behavior.
      </StoryDescription>

      <div>
        <Button
          type="secondary"
          size="small"
          onClick={() => setIsMobile(!isMobile)}
        >
          {isMobile ? "Desktop" : "Mobile"}
        </Button>
      </div>

      <StorySpace direction="v" space="4" />

      <div style={{ maxWidth: "600px", position: "relative" }}>
        <Suggester
          query={query}
          isMobile={isMobile}
          onChange={(q) => setQuery(q)}
          onClose={() => {}}
          onSelect={(suggestionValue) => alert(`${suggestionValue} selected`)}
          clearHistory={() => alert("History cleared")}
          history={[
            {
              type: "History",
              term: "Anders Matthesen",
            },
            {
              type: "History",
              term: "Ternet Ninja",
            },
          ]}
          suggestions={[
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
          ]}
        />
      </div>
    </div>
  );
}

/**
 * Returns Suggester result
 *
 */
export function WorkSuggestion() {
  const data = {
    __typename: "Work",
    title: "Ternet Ninja",
    highlight: "Ternet Ninja",
    cover: {
      thumbnail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=46718208&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=798de63083c13721cb07",
    },
  };

  return (
    <div>
      <StoryTitle>Work Suggestion</StoryTitle>
      <StoryDescription>...</StoryDescription>

      <StoryLabel>Normal</StoryLabel>
      <StorySpace direction="v" space="1" />
      <div style={{ maxWidth: "400px" }}>
        <Work data={data} />
      </div>

      <StorySpace direction="v" space="2" />

      <StoryLabel>Loading version</StoryLabel>
      <StorySpace direction="v" space="1" />
      <div style={{ maxWidth: "400px" }}>
        <Work data={data} skeleton={true} />
      </div>
    </div>
  );
}

/**
 * Returns Suggester result
 *
 */
export function SubjectSuggestion() {
  const data = {
    __typename: "Subject",
    value: "ninjaer",
    highlight: "ninjaer",
  };

  return (
    <div>
      <StoryTitle>Subject Suggestion</StoryTitle>
      <StoryDescription>...</StoryDescription>

      <StoryLabel>Normal</StoryLabel>
      <StorySpace direction="v" space="1" />
      <div style={{ maxWidth: "400px" }}>
        <Subject data={data} />
      </div>

      <StorySpace direction="v" space="2" />

      <StoryLabel>Loading version</StoryLabel>
      <StorySpace direction="v" space="1" />
      <div style={{ maxWidth: "400px" }}>
        <Subject data={data} skeleton={true} />
      </div>
    </div>
  );
}

/**
 * Returns Suggester result
 *
 */
export function CreatorSuggestion() {
  const data = {
    __typename: "Creator",
    name: "Anders Matthesen",
    highlight: "Anders Matthesen",
    imageUrl:
      "https://forfatterweb.dk/sites/default/files/styles/top_image/public/2019-09/Matthesen%20Anders1_1200_besk%C3%A5ret_forfatterweb.jpg?itok=ANfChbLr",
  };

  return (
    <div>
      <StoryTitle>Creator Suggestion</StoryTitle>
      <StoryDescription>...</StoryDescription>

      <StoryLabel>Normal</StoryLabel>
      <StorySpace direction="v" space="1" />
      <div style={{ maxWidth: "400px" }}>
        <Creator data={data} />
      </div>

      <StorySpace direction="v" space="2" />

      <StoryLabel>Loading version</StoryLabel>
      <StorySpace direction="v" space="1" />
      <div style={{ maxWidth: "400px" }}>
        <Creator data={data} skeleton={true} />
      </div>
    </div>
  );
}

/**
 * Returns Suggester result
 *
 */
export function HistorySuggestion() {
  const data = {
    __typename: "Subject",
    name: "Anders Matthesen",
    highlight: "Anders Matthesen",
  };

  return (
    <div>
      <StoryTitle>History Suggestion</StoryTitle>
      <StoryDescription>...</StoryDescription>

      <StoryLabel>Normal</StoryLabel>
      <StorySpace direction="v" space="1" />
      <div style={{ maxWidth: "400px" }}>
        <History data={data} />
      </div>

      <StorySpace direction="v" space="2" />

      <StoryLabel>Loading version</StoryLabel>
      <StorySpace direction="v" space="1" />
      <div style={{ maxWidth: "400px" }}>
        <History data={data} skeleton={true} />
      </div>
    </div>
  );
}
