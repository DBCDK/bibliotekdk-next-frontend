import {
  StoryTitle,
  StoryDescription,
  StorySpace,
} from "@/storybook/Storybook";
import WrappedDetails, { DetailsSkeleton } from "./Details";

const exportedObject = {
  title: "work/Details",
};

export default exportedObject;

export function WrappedDetailsSection() {
  return (
    <div>
      <StoryTitle>Detials section</StoryTitle>
      <StoryDescription>
        Work details component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <WrappedDetails workId="fisk" type="bog" />
    </div>
  );
}

WrappedDetailsSection.story = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Work: {
          genreAndForm: () => ["actionfilm", "thriller", "science fiction"],
          workTypes: () => ["LITERATURE"],
        },

        Manifestation: {
          access: () => [
            {
              __typename: "InterLibraryLoan",
              loanIsPossible: true,
            },
          ],
          languages: () => ({
            subtitles: [],
            spoken: [],
            main: [
              {
                display: "dansk",
              },
            ],
          }),
          audience: () => ({
            generalAudience: [
              "Mærkning: Tilladt for alle men frarådes børn under 7 år",
            ],
            lix: "2222",
          }),

          materialTypes: () => [{ materialTypeSpecific: { display: "bog" } }],
        },
      },
    },
  },
  nextRouter: {
    showInfo: true,
    pathname: "/",
    query: {},
  },
};

/**
 * Returns details section
 *
 */

export function WrappedDetailsSectionMovie() {
  return (
    <div>
      <StoryTitle>Detials section</StoryTitle>
      <StoryDescription>
        Work details component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <WrappedDetails workId="fisk" type="bog" />
    </div>
  );
}

WrappedDetailsSectionMovie.story = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Work: {
          genreAndForm: () => ["actionfilm", "thriller", "science fiction"],
          workTypes: () => ["MOVIE"],
        },

        Manifestation: {
          access: () => [
            {
              __typename: "InterLibraryLoan",
              loanIsPossible: true,
            },
          ],
          creators: () => [
            {
              display: "William Steig",
              roles: [
                {
                  functionCode: "drt",
                  function: {
                    singular: "instruktør",
                    plural: "instruktører",
                  },
                },
              ],
            },
            {
              display: "Anders Thomas Jensen",
              roles: [
                {
                  functionCode: "cre",
                  function: {
                    singular: "ophav",
                    plural: "ophav",
                  },
                },
              ],
            },
          ],
          contributors: () => [
            {
              display: "Nikolaj Lie Kaas",
              roles: [
                {
                  function: {
                    plural: "skuespillere",
                    singular: "skuespiller",
                  },
                  functionCode: "act",
                },
              ],
            },
          ],
          audience: () => ({
            generalAudience: [
              "Mærkning: Tilladt for alle men frarådes børn under 7 år",
            ],
          }),
          languages: () => ({
            subtitles: [],
            spoken: [],
            main: [
              {
                display: "dansk",
              },
            ],
          }),

          physicalDescriptions: () => [
            {
              summary: "1 dvd-video ca. 50 min.",
            },
          ],

          materialTypes: () => [
            { materialTypeSpecific: { display: "film (dvd)" } },
          ],
          edition: () => ({
            publicationYear: {
              display: "2011",
            },
          }),
        },
      },
    },
  },
  nextRouter: {
    showInfo: true,
    pathname: "/",
    query: {},
  },
};

/**
 * Returns loading details section
 *
 */
export function Loading() {
  return (
    <div>
      <StoryTitle>Detials section</StoryTitle>
      <StoryDescription>Loading details component</StoryDescription>
      <StorySpace direction="v" space="8" />
      <DetailsSkeleton />
    </div>
  );
}
