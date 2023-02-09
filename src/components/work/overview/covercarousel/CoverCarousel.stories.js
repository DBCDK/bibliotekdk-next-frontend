import React from "react";
import CoverCarousel from "./CoverCarousel";
import { StoryDescription, StoryTitle } from "@/storybook";
import automock_utils from "@/components/_modal/pages/automock_utils";
import merge from "lodash/merge";

const exportedObject = {
  title: "work/CoverCarousel",
};

export default exportedObject;

const { DEFAULT_STORY_PARAMETERS } = automock_utils();

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
        selectedPids={coverCarouselProps.selectedPids}
        workTitles={coverCarouselProps.workTitles}
      />
    </div>
  );
}

export function CoverCarouselMultipleCovers() {
  const coverCarouselProps = {
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
