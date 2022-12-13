import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import Keywords, { KeywordsSkeleton } from "./Keywords";

const exportedObject = {
  title: "work/Keywords",
};

export default exportedObject;

/**
 * Returns Keyword section
 *
 */
export function KeywordsSection() {
  const workId = "some-id";
  // const data = getSubjectsDbcVerified({ workId });
  // const uniqueSubjects = Object.values(uniqueSubjectEntries(data[workId]));

  return (
    <div>
      <StoryTitle>Keywords section</StoryTitle>
      <StoryDescription>
        Work keywords component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Keywords workId={workId} />
    </div>
  );
}

KeywordsSection.story = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Query: {
          work: () => {
            return {
              subjects: {
                dbcVerified: [
                  { display: "Whiskyland" },
                  { display: "Snapseland" },
                  { display: "Ølland" },
                  { display: "Vodkaland" },
                  { display: "Borgonjeland" },
                  { display: "Absintland" },
                  { display: "Shotland" },
                  { display: "Gløggglasland" },
                  { display: "Hjemmebrændtland" },
                  { display: "Aperolland" },
                  { display: "Bundeland" },
                  { display: "Øllebrødsland" },
                  { display: "Lagerland" },
                  { display: "Classicland" },
                  { display: "Vinland" },
                  { display: "Romland" },
                  { display: "Ginland" },
                ],
              },
            };
          },
        },
      },
      url: "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql",
    },
    nextRouter: {
      showInfo: true,
      pathname: "/materiale",
      query: { workId: "work-of:870970-basis:51701763" },
    },
  },
};

/**
 * Returns Loading description section
 *
 */
export function Loading() {
  return (
    <div>
      <StoryTitle>Keywords section</StoryTitle>
      <StoryDescription>Loading keywords component</StoryDescription>
      <StorySpace direction="v" space="8" />
      <KeywordsSkeleton />
    </div>
  );
}
