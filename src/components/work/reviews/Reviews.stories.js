import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import WrappedReviews, { ReviewsSkeleton } from "./Reviews.js";

import {
  MaterialReview,
  MaterialReviewSkeleton,
} from "./types/material/MaterialReview.js";

import {
  InfomediaReview,
  InfomediaReviewSkeleton,
} from "./types/infomedia/InfomediaReview.js";

import {
  ExternalReview,
  ExternalReviewSkeleton,
} from "./types/external/ExternalReview.js";

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
                // Review that is not available anywhere
                {
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
                    issue: "Nr. 1 (2006)",
                  },
                  recordCreationDate: "20061120",
                  review: {
                    rating: "3/6",
                    reviewByLibrarians: null,
                  },
                },
                // Review that is available on external site
                {
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
                    issue: "Nr. 1 (2006)",
                  },
                  recordCreationDate: "20061120",
                  review: {
                    rating: null,
                    reviewByLibrarians: null,
                  },
                },
                // Review that is available via infomedia
                {
                  pid: "heste pid",
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
                    issue: "2005-06-24",
                  },
                  recordCreationDate: "20050627",
                  review: {
                    rating: "5/6",
                    reviewByLibrarians: null,
                  },
                },
                // Librarians Review
                {
                  pid: "Some pid",
                  creators: [
                    {
                      display: "Some creator",
                    },
                  ],
                  access: [],
                  recordCreationDate: "20200512",
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
                },
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

export function Material() {
  const data = {
    pid: "Some pid",
    creators: [
      {
        display: "Some creator",
      },
    ],
    recordCreationDate: "20200512",
    review: {
      rating: null,
      reviewByLibrarians: [
        {
          content: "This is some content",
          heading: "The heading",
          type: "Some content type",
          manifestations: [],
        },
        {
          content: "This is Some book title and more content",
          heading: "The heading",
          type: "Some content type",
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
  return (
    <div>
      <div>
        <StoryTitle>MaterialReview template</StoryTitle>
        <StoryDescription>Material review example</StoryDescription>
        <div style={{ maxWidth: "1000px" }}>
          <MaterialReview data={data} />
        </div>
      </div>

      <StorySpace direction="v" space="3" />

      <div>
        <StoryTitle>Loading</StoryTitle>
        <StoryDescription>Loading Material review example</StoryDescription>
        <div style={{ maxWidth: "1000px" }}>
          <MaterialReviewSkeleton />
        </div>
      </div>
    </div>
  );
}

export function Infomedia() {
  const data = {
    pid: "Some pid",
    creators: [
      {
        display: "Some creator",
      },
    ],
    access: [
      {
        __typename: "InfomediaService",
        id: "Some id",
      },
    ],
    hostPublication: {
      title: "Some host publication",
      issue: "2005-06-24",
    },
    recordCreationDate: "20050627",
    review: {
      rating: "5/6",
    },
  };
  return (
    <div>
      <div>
        <StoryTitle>Infomedia template</StoryTitle>
        <StoryDescription>Infomedia review example</StoryDescription>
        <InfomediaReview data={data} />
      </div>

      <StorySpace direction="v" space="3" />

      <div>
        <StoryTitle>Loading</StoryTitle>
        <StoryDescription>
          Skeleton/loading view of the infomedia review template
        </StoryDescription>
        <InfomediaReviewSkeleton />
      </div>
    </div>
  );
}

export function ExternalMedia() {
  const data = {
    pid: "Some pid",
    creators: [
      {
        display: "Some creator",
      },
    ],
    access: [
      {
        __typename: "AccessUrl",
        origin: "Some domain",
        url: "Some url",
        note: "Some note",
        loginRequired: false,
        type: "RESOURCE",
      },
      {
        __typename: "DigitalArticleService",
        issn: "Some issn",
      },
    ],
    hostPublication: {
      title: "Some title",
      issue: "Nr. 1 (2006)",
    },
    recordCreationDate: "20061120",
    review: {
      rating: "5/6",
    },
  };
  return (
    <div>
      <div>
        <StoryTitle>External media template</StoryTitle>
        <StoryDescription>External media review example</StoryDescription>
        <ExternalReview data={data} />
      </div>

      <StorySpace direction="v" space="3" />

      <div>
        <StoryTitle>External media template</StoryTitle>
        <StoryDescription>External media review example</StoryDescription>
        <ExternalReviewSkeleton />
      </div>
    </div>
  );
}
