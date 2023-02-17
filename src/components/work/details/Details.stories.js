import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import WrappedDetails, { DetailsSkeleton } from "./Details";

const exportedObject = {
  title: "work/Details",
};

export default exportedObject;

/**
 * Returns details section
 *
 */

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
              roles: [],
            },
          ],
          contributors: () => [],
          audience: () => ({
            generalAudience: [
              "Mærkning: Tilladt for alle men frarådes børn under 7 år",
            ],
          }),
          languages: () => ({
            spoken: [
              {
                display: "dansk",
              },
              {
                display: "norsk",
              },
              {
                display: "finsk",
              },
              {
                display: "svensk",
              },
            ],
            subtitles: [
              {
                display: "dansk",
              },
              {
                display: "engelsk",
              },
              {
                display: "norsk",
              },
              {
                display: "finsk",
              },
              {
                display: "svensk",
              },
            ],
            main: [
              {
                display: "engelsk",
              },
            ],
          }),

          physicalDescriptions: () => [
            {
              summary: "1 dvd-video ca. 50 min.",
            },
          ],

          materialTypes: () => [{ specific: "Musik (dvd)" }],
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
