import { StoryTitle, StoryDescription } from "../../base/storybook";

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
  title: "Reviews",
};

/**
 * Returns all primary buttons (Default button style)
 *
 */

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
      <StoryTitle>MaterialReview template</StoryTitle>
      <StoryDescription>Material review example</StoryDescription>
      <div style={{ maxWidth: "1000px" }}>
        <MaterialReview data={data} />
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
      <StoryTitle>Infomedia template</StoryTitle>
      <StoryDescription>Infomedia review example</StoryDescription>
      <InfomediaReview data={data} />
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
      <StoryTitle>Litteratursiden template</StoryTitle>
      <StoryDescription>Litteratursiden review example</StoryDescription>
      <LitteratursidenReview data={data} />
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <StoryTitle>Loading Infomedia template</StoryTitle>
      <StoryDescription>
        Skeleton/loading view of the infomedia review template
      </StoryDescription>
      <InfomediaReviewSkeleton />
    </div>
  );
}
