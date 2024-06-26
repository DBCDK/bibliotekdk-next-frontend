import { StoryTitle, StoryDescription } from "@/storybook";
import {
  RenderLanguageAddition,
  RenderTitlesWithoutLanguage,
} from "@/components/work/overview/titlerenderer/TitleRenderer";
import Title from "@/components/base/title";

const exportedObject = {
  title: "work/Overview/TitleRenderer",
};

export default exportedObject;

/** TitleRendererComponentBuilder
 * @param {string} type
 * @param {Object<Object<string, Array, boolean>, boolean, boolean>} titleRendererProps
 * @param {string} storyNameOverride
 */
function TitleRendererComponentBuilder({
  titleRendererProps,
  type = "Bog",
  storyNameOverride = null,
}) {
  const descriptionName = storyNameOverride ? storyNameOverride : type;

  return (
    <div>
      <StoryTitle>TitleRenderer - {descriptionName}</StoryTitle>
      <StoryDescription>
        TitleRenderer with description: {descriptionName}
      </StoryDescription>
      <Title type={"title3"} skeleton={false} dataCy={"title-overview"}>
        <RenderTitlesWithoutLanguage work={titleRendererProps} />
        <RenderLanguageAddition work={titleRendererProps} />
      </Title>
    </div>
  );
}

export function TitleRendererTvSeries() {
  const titleRendererProps = {
    titles: {
      full: ["Hugo i Sølvskoven", "Hugo og Rita fra Sølvskoven"],
      tvSeries: {
        title: "Seinfeld",
        episodeTitles: ["Episodes 1-5"],
        season: {
          display: "sæson 3",
        },
        disc: {
          display: "disc 1",
        },
      },
    },
    mainLanguages: [
      { isoCode: "dan", display: "dansk" },
      { isoCode: "eng", display: "engelsk" },
    ],
    workTypes: ["LITERATURE"],
  };

  return (
    <TitleRendererComponentBuilder
      titleRendererProps={titleRendererProps}
      storyNameOverride={"TitleRendererMultipleLanguages"}
    />
  );
}

export function TitleRendererMultipleLanguages() {
  const titleRendererProps = {
    titles: {
      full: ["Hugo i Sølvskoven", "Hugo og Rita fra Sølvskoven"],
      tvSeries: null,
    },
    mainLanguages: [
      { isoCode: "dan", display: "dansk" },
      { isoCode: "eng", display: "engelsk" },
    ],
    workTypes: ["LITERATURE"],
  };

  return (
    <TitleRendererComponentBuilder
      titleRendererProps={titleRendererProps}
      storyNameOverride={"TitleRendererMultipleLanguages"}
    />
  );
}
export function TitleRendererOnlyDanish() {
  const titleRendererProps = {
    titles: {
      full: ["Hugo i Sølvskoven", "Hugo og Rita fra Sølvskoven"],
      tvSeries: null,
    },
    mainLanguages: [{ isoCode: "dan", display: "dansk" }],
    workTypes: ["LITERATURE"],
  };

  return (
    <TitleRendererComponentBuilder
      titleRendererProps={titleRendererProps}
      storyNameOverride={"TitleRendererOnlyDanish"}
    />
  );
}
export function TitleRenderer1NonDanish() {
  const titleRendererProps = {
    titles: {
      full: ["Hugo i Sølvskoven", "Hugo og Rita fra Sølvskoven"],
      tvSeries: null,
    },
    mainLanguages: [{ isoCode: "eng", display: "engelsk" }],
    workTypes: ["LITERATURE"],
  };

  return (
    <TitleRendererComponentBuilder
      titleRendererProps={titleRendererProps}
      storyNameOverride={"TitleRenderer1NonDanish"}
    />
  );
}
export function TitleRendererNonLiterature() {
  const titleRendererProps = {
    titles: {
      full: ["Hugo i Sølvskoven", "Hugo og Rita fra Sølvskoven"],
      tvSeries: null,
    },
    mainLanguages: [{ isoCode: "eng", display: "engelsk" }],
    workTypes: ["ARTICLE"],
  };

  return (
    <TitleRendererComponentBuilder
      titleRendererProps={titleRendererProps}
      storyNameOverride={"TitleRendererNonLiterature"}
    />
  );
}
