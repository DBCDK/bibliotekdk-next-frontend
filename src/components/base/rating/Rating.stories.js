import {
  StoryTitle,
  StoryDescription,
  StoryLabel,
  StorySpace,
} from "@/storybook";
import { Rating, RatingSkeleton } from "./Rating";

const exportedObject = {
  title: "base/Rating",
};

export default exportedObject;

/**
 * Returns Bookmark button
 *
 */
export function SomeRating() {
  return (
    <div>
      <StoryTitle>Rating</StoryTitle>
      <StoryDescription>
        {`Converts a string/rating (e.g. \"5/6\") to a rating component.`}
      </StoryDescription>

      <Rating rating="2/6" />

      <StorySpace direction="v" space="6" />

      <StoryDescription>Other examples:</StoryDescription>

      <StoryLabel>Rate 0/6</StoryLabel>
      <Rating rating="0/6" />
      <StoryLabel>Rate 1/6</StoryLabel>
      <Rating rating="1/6" />
      <StoryLabel>Rate 2/6</StoryLabel>
      <Rating rating="2/6" />
      <StoryLabel>Rate 4/6</StoryLabel>
      <Rating rating="3/6" />
      <StoryLabel>Rate 4/6</StoryLabel>
      <Rating rating="4/6" />
      <StoryLabel>Rate 5/6</StoryLabel>
      <Rating rating="5/6" />
      <StoryLabel>Rate 6/6</StoryLabel>
      <Rating rating="6/6" />
    </div>
  );
}

/**
 * Returns Loading version of the Bookmark button
 *
 */
export function Loading() {
  return (
    <div>
      <StoryTitle>Loading</StoryTitle>
      <StoryDescription>
        Loading/skeleton version of rating component
      </StoryDescription>
      <RatingSkeleton />
    </div>
  );
}
