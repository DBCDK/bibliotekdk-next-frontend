import { StoryTitle, StoryDescription } from "@/storybook";
import { PeriodicaArticles } from "@/components/work/periodicaArticles/PeriodicaArticles";

const exportedObject = {
  title: "work/PeriodicaArticles",
};

export default exportedObject;

/**
 * Returns Description section
 *
 */
export function DefaultPeriodica() {
  return (
    <div>
      <StoryTitle>Other articles in same issue</StoryTitle>
      <StoryDescription>Display articles</StoryDescription>
      {/*<StorySpace direction="v" space="8" />*/}
      <PeriodicaArticles />
    </div>
  );
}

export function PeriodicaIsLoading() {
  return (
    <div>
      <StoryTitle>Waiting for data</StoryTitle>
      <StoryDescription>Display skeleton while waiting</StoryDescription>
      {/*<StorySpace direction="v" space="8" />*/}
      <PeriodicaArticles isLoading={true} />
    </div>
  );
}
