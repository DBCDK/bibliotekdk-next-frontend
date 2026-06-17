import {
  StoryTitle,
  StoryDescription,
  StorySpace,
} from "@/storybook/Storybook";
import WrappedDetails, { DetailsSkeleton } from "./Details";
import merge from "lodash/merge";
import automock_utils from "@/lib/automock_utils.fixture";

const exportedObject = {
  title: "work/Details",
};

export default exportedObject;

const { DEFAULT_STORY_PARAMETERS } = automock_utils();

export function WrappedDetailsSection() {
  return (
    <div>
      <StoryTitle>Details section</StoryTitle>
      <StoryDescription>
        Work details component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <WrappedDetails workId="fisk" type={["bog"]} />
    </div>
  );
}

WrappedDetailsSection.parameters = {
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

        materialTypes: () => [
          {
            materialTypeSpecific: { display: "bog", code: "BOOK" },
            materialTypeGeneral: { display: "bøger", code: "BOOKS" },
          },
        ],
      },
    },
  },
};
/**
 * Returns details section
 *
 */

export function WrappedDetailsSectionMovie() {
  return (
    <div>
      <StoryTitle>Details section</StoryTitle>
      <StoryDescription>
        Work details component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <WrappedDetails workId="hest" type={["film (dvd)"]} />
    </div>
  );
}

WrappedDetailsSectionMovie.parameters = {
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
        physicalDescription: () => ({
          summaryFull: "1 dvd-video ca. 50 min.",
        }),
        materialTypes: () => [
          {
            materialTypeSpecific: {
              display: "film (dvd)",
              code: "FILM_DVD",
            },
            materialTypeGeneral: { display: "film", code: "FILMS" },
          },
        ],
        edition: () => ({
          publicationYear: {
            display: "2011",
          },
        }),
        classifications: () => [
          {
            code: "86-06",
            system: "DK5",
            display: "86-06 Dansk skønlitteratur",
          },
          {
            code: "sk",
            system: "DK5",
            display: "Skønlitteratur",
          },
        ],
      },
    },
  },
};
/**
 * Returns details section
 *
 */

export function WrappedDetailsSectionArtikelArtikelOnline() {
  return (
    <div>
      <StoryTitle>Details section</StoryTitle>
      <StoryDescription>
        Work details component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <WrappedDetails
        workId="some-work-id-2-1"
        type={["artikel", "artikel (online)"]}
      />
    </div>
  );
}

const WrappedDetailsSectionArtikelArtikelOnlineStory = merge(
  {},
  DEFAULT_STORY_PARAMETERS,
  {
    parameters: {
      graphql: {
        resolvers: {},
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/",
      query: {},
    },
  }
);
WrappedDetailsSectionArtikelArtikelOnline.parameters =
  WrappedDetailsSectionArtikelArtikelOnlineStory.parameters;
WrappedDetailsSectionArtikelArtikelOnline.args =
  WrappedDetailsSectionArtikelArtikelOnlineStory.args;
WrappedDetailsSectionArtikelArtikelOnline.decorators =
  WrappedDetailsSectionArtikelArtikelOnlineStory.decorators;
WrappedDetailsSectionArtikelArtikelOnline.storyName =
  WrappedDetailsSectionArtikelArtikelOnlineStory.name ||
  WrappedDetailsSectionArtikelArtikelOnlineStory.storyName;
/**
 * Returns details section
 *
 */

export function WrappedDetailsSectionNoManifestationsNoDetails() {
  return (
    <div>
      <StoryTitle>Details section</StoryTitle>
      <StoryDescription>
        Work details component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <WrappedDetails workId="some-work-id-2" type={["sdiofjsaiojf"]} />
    </div>
  );
}

const WrappedDetailsSectionNoManifestationsNoDetailsStory = merge(
  {},
  DEFAULT_STORY_PARAMETERS,
  {
    parameters: {
      graphql: {
        resolvers: {},
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/",
      query: {},
    },
  }
);
WrappedDetailsSectionNoManifestationsNoDetails.parameters =
  WrappedDetailsSectionNoManifestationsNoDetailsStory.parameters;
WrappedDetailsSectionNoManifestationsNoDetails.args =
  WrappedDetailsSectionNoManifestationsNoDetailsStory.args;
WrappedDetailsSectionNoManifestationsNoDetails.decorators =
  WrappedDetailsSectionNoManifestationsNoDetailsStory.decorators;
WrappedDetailsSectionNoManifestationsNoDetails.storyName =
  WrappedDetailsSectionNoManifestationsNoDetailsStory.name ||
  WrappedDetailsSectionNoManifestationsNoDetailsStory.storyName;
/**
 * Returns loading details section
 *
 */
export function Loading() {
  return (
    <div>
      <StoryTitle>Details section</StoryTitle>
      <StoryDescription>Loading details component</StoryDescription>
      <StorySpace direction="v" space="8" />
      <DetailsSkeleton />
    </div>
  );
}
