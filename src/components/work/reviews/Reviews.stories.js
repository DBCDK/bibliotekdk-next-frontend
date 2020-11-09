import { StoryTitle, StoryDescription, StorySpace } from "../../base/storybook";

import { Reviews, ReviewsSkeleton } from "./Reviews.js";

import {
  MaterialReview,
  MaterialReviewSkeleton,
} from "./types/material/MaterialReview.js";

import {
  InfomediaReview,
  InfomediaReviewSkeleton,
} from "./types/infomedia/InfomediaReview.js";

import {
  LitteratursidenReview,
  LitteratursidenReviewSkeleton,
} from "./types/litteratursiden/LitteratursidenReview.js";

export default {
  title: "Work: Reviews",
};

/**
 * Returns all primary buttons (Default button style)
 *
 */

export function ReviewsSlider() {
  const data = [
    {
      author: "Svend Svendsen",
      media: "Jyllandsposten",
      rating: "4/5",
      reviewType: "INFOMEDIA",
      url: "http://",
    },
    {
      author: "Didrik Pedersen",
      media: "",
      rating: "1/5",
      reviewType: "LITTERATURSIDEN",
      url: "http://",
    },
    {
      author: "Svend Svendsen",
      media: "",
      rating: "3/5",
      reviewType: "MATERIALREVIEWS",
      url: "http://",
    },
    {
      author: "Didrik Pedersen",
      media: "Berlingske Tidende",
      rating: "5/5",
      reviewType: "INFOMEDIA",
      url: "http://",
    },
    {
      author: "Svend Svendsen",
      media: "Jyllandsposten",
      rating: "4/5",
      reviewType: "INFOMEDIA",
      url: "http://",
    },
  ];

  return (
    <div>
      <StoryTitle>Anmeldesler</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <Reviews data={data} />
    </div>
  );
}

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
    author: "Svend Svendsen",
    media: "Jyllandsposten",
    rating: "4/5",
    reviewType: "MATERIALREVIEW",
    url: "http://",
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
    author: "Svend Svendsen",
    media: "Jyllandsposten",
    rating: "4/5",
    reviewType: "INFOMEDIA",
    url: "http://",
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

export function Litteratursiden() {
  const data = {
    author: "Svend Svendsen",
    reviewType: "INFOMEDIA",
    url: "http://",
  };
  return (
    <div>
      <div>
        <StoryTitle>Litteratursiden template</StoryTitle>
        <StoryDescription>Litteratursiden review example</StoryDescription>
        <LitteratursidenReview data={data} />
      </div>

      <StorySpace direction="v" space="3" />

      <div>
        <StoryTitle>Litteratursiden template</StoryTitle>
        <StoryDescription>Litteratursiden review example</StoryDescription>
        <LitteratursidenReviewSkeleton />
      </div>
    </div>
  );
}
