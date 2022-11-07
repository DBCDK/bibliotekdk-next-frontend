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
        Work: {
          titles: () => ({
            main: ["Great book"],
          }),
          workReviews: () => [
            // Review that is not available anywhere
            {
              pid: "some-pid-1",
              author: "Jens Jensen",
              date: "1988-07-20",
              librariansReview: null,
              rating: null,
              origin: "Some Periodica",
              periodica: { volume: "1998. 8. årgang" },
              infomediaId: null,
              urls: [],
            },
            // Review that is available on external site
            {
              pid: "some-pid-2",
              author: "Jens Jensen",
              date: "1988-07-20",
              librariansReview: null,
              rating: null,
              origin: "Litteratursiden",
              periodica: { volume: null },
              infomediaId: null,
              urls: [{ url: "http://some-external-site/some-path" }],
            },
            // Review that is available via infomedia
            {
              pid: "some-pid-3",
              author: "Hans Hansen",
              date: "2021-06-20",
              rating: "4/6",
              librariansReview: null,
              origin: "Politiken",
              infomediaId: "some-infomedia-id",
              urls: [],
            },
            // Librarians Review
            {
              pid: "some-pid-4",
              author: "Some Librarian",
              date: "1999-05-20",
              rating: null,
              urls: [],
              infomediaId: null,
              periodica: null,
              librariansReview: [
                {
                  text: "Great book that is almost as good as ",
                  work: {
                    workId: "some-other-work-id",
                    creators: [{ display: "Some Creator" }],
                    titles: {
                      main: ["Some other great book"],
                    },
                  },
                },
              ],
            },
          ],
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
    pid: "some-pid-4",
    author: "Some Librarian",
    date: "1999-05-20",
    rating: null,
    urls: [],
    infomediaId: null,
    periodica: null,
    librariansReview: [
      {
        text: "Great book that is almost as good as ",
        work: {
          workId: "some-other-work-id",
          creators: [{ display: "Some Creator" }],
          titles: {
            main: ["Some other great book"],
          },
        },
      },
    ],
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
    pid: "some-pid-3",
    author: "Hans Hansen",
    date: "2021-06-20",
    rating: "4/6",
    librariansReview: null,
    origin: "Politiken",
    infomediaId: "some-infomedia-id",
    urls: [],
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
    pid: "some-pid-2",
    author: "Jens Jensen",
    date: "1988-07-20",
    librariansReview: null,
    origin: "Litteratursiden",
    periodica: { volume: null },
    infomediaId: null,
    urls: [{ url: "http://some-external-site/some-path" }],
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
