import { StoryTitle, StoryDescription } from "@/storybook";

import WrappedReviews, { ReviewsSkeleton } from "./Reviews.js";

import { AccessEnum } from "@/lib/enums.js";

const exportedObject = {
  title: "work/Reviews",
};

export default exportedObject;

export function WrappedReviewsSlider() {
  return (
    <div>
      <StoryTitle>Anmeldelser</StoryTitle>
      <StoryDescription>Wrapped component</StoryDescription>
      <WrappedReviews workId={"some-work-id"} />
    </div>
  );
}
WrappedReviewsSlider.story = {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          work: () => ({
            workId: "some-work-id",
            titles: {
              main: ["Great book"],
            },
            relations: {
              hasReview: [
                unavailableReview(1),
                unavailableReview(2),
                unavailableReview(3),
                reviewAvailableAtExternalSite(4),
                reviewAvailableAtExternalSite(5),
                reviewAvailableAtExternalSite(6),
                reviewAvailableAtExternalSite(7),
                reviewAvailableAtInfomedia(8),
                reviewAvailableAtInfomedia(9),
                reviewAvailableAtInfomedia(10),
                librariansReview(11),
                librariansReview(12),
              ],
            },
          }),
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/",
      query: {},
    },
  },
};

export function LoadingSlider() {
  return (
    <div>
      <StoryTitle>Loading</StoryTitle>
      <StoryDescription>
        The loading/skeleton version of the review slider, uses the Infomedia
        template as skeleton elements.
      </StoryDescription>
      <ReviewsSkeleton />
    </div>
  );
}

// Review that is not available anywhere
const unavailableReview = (number = 1) => {
  return {
    pid: "Some pid",
    creators: [
      {
        display: "Some creator",
      },
    ],
    access: [
      {
        __resolveType: AccessEnum.DIGITAL_ARTICLE_SERVICE,
        issn: "Some issn",
      },
    ],
    hostPublication: {
      title: "External publication (no url)",
      issue: `Nr. ${number} (2006)`,
    },
    recordCreationDate: "20061120",
    review: {
      rating: "3/6",
      reviewByLibrarians: [],
    },
  };
};

// Review that is available on external site
const reviewAvailableAtExternalSite = (number = 1) => {
  return {
    pid: "Some pid",
    creators: [
      {
        display: "Some creator",
      },
    ],
    access: [
      {
        __resolveType: AccessEnum.DIGITAL_ARTICLE_SERVICE,
        issn: "Some issn",
      },
      {
        __resolveType: AccessEnum.ACCESS_URL,
        origin: "Some domain",
        url: "http://www.some-url.dk",
        note: "Some note",
        loginRequired: false,
      },
    ],
    hostPublication: {
      title: "External publication (url)",
      issue: `Nr. ${number} (2006)`,
    },
    recordCreationDate: "20061120",
    review: {
      rating: null,
      reviewByLibrarians: [],
    },
  };
};

// Review that is available via infomedia
const reviewAvailableAtInfomedia = (day = 1) => {
  return {
    pid: "some pid",
    creators: [
      {
        display: "Some creator",
      },
    ],
    access: [
      {
        __resolveType: AccessEnum.INFOMEDIA_SERVICE,
        id: "some-infomedia-id",
      },
      { __resolveType: AccessEnum.INTER_LIBRARY_LOAN },
    ],
    hostPublication: {
      title: "Infomedia publication",
      issue: `2005-06-${day}`,
    },
    recordCreationDate: "20050627",
    review: {
      rating: "5/6",
      reviewByLibrarians: [],
    },
  };
};

// Librarians Review
const librariansReview = (day = 1) => {
  return {
    pid: "Some pid",
    creators: [
      {
        display: "Some creator",
      },
    ],
    access: [],
    recordCreationDate: `202005${day}`,
    hostPublication: null,
    review: {
      rating: null,
      reviewByLibrarians: [
        {
          content: "This is some content",
          heading: "The heading",
          type: "ABSTRACT",
          manifestations: [],
        },
        {
          content: "This is Some book title and more content",
          heading: "The heading",
          type: "ABSTRACT",
          manifestations: [
            {
              ownerWork: {
                workId: "some-work-id",
                titles: {
                  main: ["Some book title"],
                },
                creators: [
                  {
                    display: "Some creator",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  };
};
