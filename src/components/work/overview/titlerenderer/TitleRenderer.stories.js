import { StoryTitle, StoryDescription } from "@/storybook";
import TitleRenderer from "@/components/work/overview/titlerenderer/TitleRenderer";
import automock_utils from "@/components/_modal/pages/automock_utils";
import merge from "lodash/merge";

const exportedObject = {
  title: "work/Overview/TitleRenderer",
};

export default exportedObject;

const { DEFAULT_STORY_PARAMETERS } = automock_utils();

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
      <TitleRenderer workId={titleRendererProps?.workId} />
    </div>
  );
}

export function TitleRendererMultipleLanguages() {
  const titleRendererProps = {
    workId: "some-work-id-1",
  };

  return (
    <TitleRendererComponentBuilder
      titleRendererProps={titleRendererProps}
      storyNameOverride={"TitleRendererMultipleLanguages"}
    />
  );
}
TitleRendererMultipleLanguages.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          work: () => {
            return {
              titles: {
                full: ["Hugo i Sølvskoven", "Hugo og Rita fra Sølvskoven"],
              },
              mainLanguages: [
                { isoCode: "dan", display: "dansk" },
                { isoCode: "eng", display: "engelsk" },
              ],
              workTypes: ["LITERATURE"],
              manifestations: {
                mostRelevant: [
                  {
                    access: [
                      { __typename: "InterLibraryLoan", loanIsPossible: true },
                    ],
                  },
                ],
              },
            };
          },
        },
      },
    },
  },
});
export function TitleRendererOnlyDanish() {
  const titleRendererProps = {
    workId: "some-work-id-1",
  };

  return (
    <TitleRendererComponentBuilder
      titleRendererProps={titleRendererProps}
      storyNameOverride={"TitleRendererOnlyDanish"}
    />
  );
}
TitleRendererOnlyDanish.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          work: () => {
            return {
              titles: {
                full: ["Hugo i Sølvskoven", "Hugo og Rita fra Sølvskoven"],
              },
              mainLanguages: [{ isoCode: "dan", display: "dansk" }],
              workTypes: ["LITERATURE"],
              manifestations: {
                mostRelevant: [
                  {
                    access: [
                      { __typename: "InterLibraryLoan", loanIsPossible: true },
                    ],
                  },
                ],
              },
            };
          },
        },
      },
    },
  },
});
export function TitleRenderer1NonDanish() {
  const titleRendererProps = {
    workId: "some-work-id-1",
  };

  return (
    <TitleRendererComponentBuilder
      titleRendererProps={titleRendererProps}
      storyNameOverride={"TitleRenderer1NonDanish"}
    />
  );
}
TitleRenderer1NonDanish.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          work: () => {
            return {
              titles: {
                full: ["Hugo i Sølvskoven", "Hugo og Rita fra Sølvskoven"],
              },
              mainLanguages: [{ isoCode: "eng", display: "engelsk" }],
              workTypes: ["LITERATURE"],
              manifestations: {
                mostRelevant: [
                  {
                    access: [
                      { __typename: "InterLibraryLoan", loanIsPossible: true },
                    ],
                  },
                ],
              },
            };
          },
        },
      },
    },
  },
});
export function TitleRendererNonLiterature() {
  const titleRendererProps = {
    workId: "some-work-id-1",
  };

  return (
    <TitleRendererComponentBuilder
      titleRendererProps={titleRendererProps}
      storyNameOverride={"TitleRendererNonLiterature"}
    />
  );
}
TitleRendererNonLiterature.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          work: () => {
            return {
              titles: {
                full: ["Hugo i Sølvskoven", "Hugo og Rita fra Sølvskoven"],
              },
              mainLanguages: [{ isoCode: "eng", display: "engelsk" }],
              workTypes: ["ARTICLE"],
              manifestations: {
                mostRelevant: [
                  {
                    access: [
                      { __typename: "InterLibraryLoan", loanIsPossible: true },
                    ],
                  },
                ],
              },
            };
          },
        },
      },
    },
  },
});
