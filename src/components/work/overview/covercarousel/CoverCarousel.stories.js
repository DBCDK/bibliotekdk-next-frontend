import React from "react";
import CoverCarousel, {
  CoverCarousel as NamedCoverCarousel,
} from "./CoverCarousel";
import { StoryDescription, StoryTitle } from "@/storybook";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const exportedObject = {
  title: "work/CoverCarousel",
};

export default exportedObject;

const { MANIFESTATION_1, MANIFESTATION_2, DEFAULT_STORY_PARAMETERS } =
  automock_utils();

/** CoverCarouselComponentBuilder
 * @param {string} type
 * @param {Object<Object<string, Array, boolean>, boolean, boolean>} coverCarouselProps
 * @param {string} storyNameOverride
 */
function CoverCarouselComponentBuilder({
  coverCarouselProps,
  type = "Bog",
  storyNameOverride = null,
}) {
  const descriptionName = storyNameOverride ? storyNameOverride : type;

  return (
    <div>
      <StoryTitle>CoverCarousel - {descriptionName}</StoryTitle>
      <StoryDescription>The CoverCarousel: {descriptionName}</StoryDescription>
      <CoverCarousel
        allPids={coverCarouselProps.allPids}
        selectedPids={coverCarouselProps.selectedPids}
        workTitles={coverCarouselProps.workTitles}
      />
    </div>
  );
}

export function CoverCarouselMultipleCovers() {
  const coverCarouselProps = {
    allPids: ["some-pid-1", "some-pid-2", "some-pid-3"],
    selectedPids: ["some-pid-1", "some-pid-2"],
    workTitles: {
      titles: {
        full: ["Hugo i Sølvskoven"],
      },
    },
  };

  return (
    <CoverCarouselComponentBuilder
      coverCarouselProps={coverCarouselProps}
      storyNameOverride={"testa"}
    />
  );
}
CoverCarouselMultipleCovers.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

export function CoverCarouselSingleManifestation() {
  const coverCarouselProps = {
    allPids: ["some-pid-1", "some-pid-2", "some-pid-3"],
    selectedPids: ["some-pid-1"],
    workTitles: {
      titles: {
        full: ["Hugo i Sølvskoven"],
      },
    },
  };

  return (
    <CoverCarouselComponentBuilder
      coverCarouselProps={coverCarouselProps}
      storyNameOverride={"testa"}
    />
  );
}
CoverCarouselSingleManifestation.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

export function CoverCarouselMultipleManifestationsSingleCover() {
  const coverCarouselProps = {
    allPids: ["some-pid-1", "some-pid-2", "some-pid-3", "some-pid-6"],
    selectedPids: ["some-pid-1", "some-pid-6"],
    workTitles: {
      titles: {
        full: ["Hugo i Sølvskoven"],
      },
    },
  };

  return (
    <CoverCarouselComponentBuilder
      coverCarouselProps={coverCarouselProps}
      storyNameOverride={"testa"}
    />
  );
}
CoverCarouselMultipleManifestationsSingleCover.story = merge(
  {},
  DEFAULT_STORY_PARAMETERS,
  {
    parameters: {
      graphql: {
        resolvers: {},
      },
    },
  }
);
export function NamedCoverCarouselTenManifestations() {
  const manifestations = Array(5)
    .fill([])
    .map(() => [MANIFESTATION_1, MANIFESTATION_2])
    .flat();
  const materialType = ["bog"];
  const workTitles = {
    titles: {
      full: ["Hugo i Sølvskoven"],
    },
  };

  return (
    <div>
      <StoryTitle>CoverCarousel - {"NamedCoverCarousel"}</StoryTitle>
      <StoryDescription>
        The CoverCarousel: {"NamedCoverCarousel"}
      </StoryDescription>
      <NamedCoverCarousel
        manifestations={manifestations}
        materialType={materialType}
        workTitles={workTitles}
      />
    </div>
  );
}
export function NamedCoverCarouselTwentyManifestations() {
  const manifestations = Array(10)
    .fill([])
    .map(() => [MANIFESTATION_1, MANIFESTATION_2])
    .flat();
  const materialType = ["bog"];
  const workTitles = {
    titles: {
      full: ["Hugo i Sølvskoven"],
    },
  };

  return (
    <div>
      <StoryTitle>CoverCarousel - {"NamedCoverCarousel"}</StoryTitle>
      <StoryDescription>
        The CoverCarousel: {"NamedCoverCarousel"}
      </StoryDescription>
      <NamedCoverCarousel
        manifestations={manifestations}
        materialType={materialType}
        workTitles={workTitles}
      />
    </div>
  );
}
