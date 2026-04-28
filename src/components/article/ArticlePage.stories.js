import { StoryTitle } from "@/storybook";
import {
  Content,
  ContentSkeleton,
} from "@/components/article/content/Content.js";

import ReviewPage from "@/pages/anmeldelse/[title]/[workId]/[articleId]";
import InfomediaArticlePage from "@/pages/infomedia/[title]/[workId]/[infomediaId]";

import { AccessEnum } from "@/lib/enums.js";
import automock_utils from "@/lib/automock_utils.fixture";

const exportedObject = {
  title: "articles/page",
};

export default exportedObject;

const { MANIFESTATION_6, REVIEW_1 } = automock_utils();

export function WrappedInfomediaReviewPage() {
  return (
    <div>
      <StoryTitle>Article Page</StoryTitle>
      <ReviewPage />
    </div>
  );
}
WrappedInfomediaReviewPage.story = {
  parameters: {
    graphql: {
      resolvers: {
        Subject: {
          __resolveType: () => "SubjectText",
        },
        Query: {
          work: (args) =>
            args.variables.workId === "some-work-id"
              ? {
                  workId: "some-work-id",
                  titles: {
                    main: ["Great book"],
                  },
                  subjects: {
                    dbcVerified: [
                      {
                        display: "Some topic",
                        type: "TOPIC",
                        __typename: "SubjectText",
                        language: {
                          isoCode: "dan",
                        },
                      },
                      {
                        display: "Some other topic",
                        type: "TOPIC",
                        __typename: "SubjectText",
                        language: {
                          isoCode: "dan",
                        },
                      },
                    ],
                  },
                  relations: {
                    hasReview: [
                      {
                        pid: "pid",
                        creators: [
                          {
                            display: "Some creator",
                          },
                        ],
                        access: [
                          {
                            __resolveType: AccessEnum.INFOMEDIA_SERVICE,
                            id: "some-article-id",
                          },
                        ],

                        physicalDescription: {
                          summaryFull: "Some page number",
                          materialUnits: [
                            {
                              extent: "Some extent",
                              summary: "Some summary",
                            },
                          ],
                        },

                        hostPublication: {
                          title: "Infomedia publication",
                          issue: "2005-06-24",
                        },
                        recordCreationDate: "20050627",
                        review: {
                          rating: "5/6",
                          reviewByLibrarians: [],
                        },
                      },
                    ],
                  },
                }
              : null,

          manifestation: () => null,

          infomedia: (args) =>
            args.variables.id === "some-article-id"
              ? {
                  article: {
                    id: "some-article-id",
                    headLine: "Some review headline",
                    subHeadLine: "Some review subHeadLine",
                    byLine: "Some byLine",
                    dateLine: "24. December 2000",
                    paper: "Some paper",
                    text: '<p id="p1">Some text given as html ...</p>',
                    hedLine: "Some hedline",
                    logo: "<p>Infomedia disclaimer</p>",
                  },
                }
              : null,
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/",
      query: { workId: "some-work-id", articleId: "some-article-id" },
    },
  },
};

export function WrappedLectorReviewPage() {
  return (
    <div>
      <StoryTitle>Lector Review Page</StoryTitle>
      <ReviewPage />
    </div>
  );
}
WrappedLectorReviewPage.story = {
  parameters: {
    graphql: {
      resolvers: {
        Subject: {
          __resolveType: () => "SubjectText",
        },
        Query: {
          manifestation: (args) =>
            args.variables.pid === "some-article-id"
              ? {
                  pid: "some-article-id",
                  review: REVIEW_1,
                  relations: {
                    isReviewOf: [MANIFESTATION_6],
                  },
                }
              : null,
          infomedia: () => ({}),
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/",
      query: { workId: "some-work-id", articleId: "some-article-id" },
    },
  },
};

export function WrappedInfomediaArticlePage() {
  return (
    <div>
      <StoryTitle>Article Page</StoryTitle>
      <InfomediaArticlePage />
    </div>
  );
}
WrappedInfomediaArticlePage.story = {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          work: (args) =>
            args.variables.workId === "some-work-id" ? {} : null,
          infomedia: (args) =>
            args.variables.id === "some-article-id" ? {} : null,
        },
        InfomediaArticle: {
          logo: () => "<p>Infomedia disclaimer</p>",
        },
        Subject: {
          __resolveType: () => "SubjectText",
        },
        SubjectText: { type: () => "TOPIC" },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/",
      query: { workId: "some-work-id", infomediaId: "some-article-id" },
    },
  },
};

export function ArticlePage() {
  const articleBody = `## Overskrift 2

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget nisl urna. Etiam et volutpat dolor. Quisque eleifend dapibus erat, congue placerat orci vehicula lobortis. Ut mollis, massa ultricies blandit luctus, augue quam feugiat sem, vel efficitur eros eros vel est. Curabitur facilisis iaculis nibh, non lacinia metus auctor eu. Vivamus lobortis metus vitae lacus iaculis, vel gravida leo dictum. Nam vehicula nunc nec vestibulum rutrum. Vestibulum non dapibus lacus. Praesent consectetur sapien felis, at scelerisque magna varius vel. Mauris quis mauris consequat, fermentum nisl sed, vulputate arcu.

Prøv google: [https://www.google.dk/](https://www.google.dk/)

![Læser bog i hængekøje](/img/bibdk-hero-scaled.jpeg "Hængekøje hygge med bog")

Praesent quis velit sit amet orci tincidunt imperdiet. Proin odio turpis, laoreet nec mattis et, elementum in massa. Donec vehicula a nulla vitae volutpat. Proin varius eget neque ut laoreet. Sed sed felis vestibulum, dignissim quam eget, auctor purus. Ut quis ipsum tempus, accumsan elit non, blandit nisi. Vivamus auctor ipsum condimentum, posuere nisl at, fermentum dui. Vestibulum enim dolor, commodo at commodo ut, pretium aliquam lectus. Duis mattis orci lectus, eget lobortis nisi rhoncus a. Suspendisse condimentum magna eget lorem tristique, ut euismod leo tempus. Maecenas id ante tincidunt, ultricies velit in, porta erat.

- punkt 1
- punkt 2
- punkt 3
- punkt 4

### Overskrift 3

Sed sodales dictum lacinia. Duis molestie tortor magna, ac sagittis nibh dignissim ut. Etiam vel suscipit nisl. Nullam eu est nec libero tincidunt facilisis posuere id arcu. Sed bibendum pretium augue, a volutpat neque placerat sed. Sed orci sapien, ullamcorper at mauris nec, commodo maximus est. Donec eget nunc nec leo ornare elementum. Curabitur sagittis, nulla vel pretium malesuada, nisl odio dapibus ante, at convallis enim neque id felis. Nullam velit nisl, vulputate quis lectus ac, vehicula consectetur neque. Nam commodo elementum turpis, vel rutrum est. Donec iaculis iaculis porttitor. Morbi at condimentum ligula. Cras suscipit gravida diam, sit amet venenatis risus sollicitudin at.

**Den er fed**

Pellentesque varius tincidunt egestas. Vivamus rutrum accumsan arcu in auctor. Cras justo eros, dignissim vel ullamcorper rhoncus, posuere ac orci. Sed vulputate turpis id odio ultrices, id eleifend tellus viverra. Donec et dapibus ipsum. Maecenas blandit dictum interdum. In ac urna lectus. Curabitur euismod leo at sem congue, vel auctor velit congue. Pellentesque eros nibh, aliquam vel justo non, imperdiet cursus mi. Duis vitae porttitor leo, non sodales nibh. Aliquam nec consectetur quam. Aliquam erat volutpat. Mauris accumsan cursus massa eu tempor. Praesent a mi turpis. Phasellus sit amet justo id leo ultrices dapibus.

1. Første prioritet
2. Anden prioritet
3. Tredje prioritet

Pellentesque varius tincidunt egestas. Vivamus rutrum accumsan arcu in auctor. Cras justo eros, dignissim vel ullamcorper rhoncus, posuere ac orci. Sed vulputate turpis id odio ultrices, id eleifend tellus viverra. Donec et dapibus ipsum. Maecenas blandit dictum interdum. In ac urna lectus. Curabitur euismod leo at sem congue, vel auctor velit congue. Pellentesque eros nibh, aliquam vel justo non, imperdiet cursus mi. Duis vitae porttitor leo, non sodales nibh. Aliquam nec consectetur quam. Aliquam erat volutpat. Mauris accumsan cursus massa eu tempor. Praesent a mi turpis. Phasellus sit amet justo id leo ultrices dapibus.

Curabitur facilisis iaculis nibh, non lacinia metus auctor eu. Vivamus lobortis metus vitae lacus iaculis, vel gravida leo dictum. Nam vehicula nunc nec vestibulum rutrum. Vestibulum non dapibus lacus. Praesent consectetur sapien felis, at scelerisque magna varius vel. Mauris quis mauris consequat, fermentum nisl sed, vulputate arcu.`;

  const data = {
    article: {
      nid: 1,
      title: "Digitale bibliotekstilbud",
      fieldRubrik:
        "Læs mere om forfattere, musik og temaer. Se film, læs artikler, e- og lydbøger, og meget mere.",
      fieldImage: {
        alt: "some image alt",
        title: "some image title",
        url: "/img/bibdk-hero-scaled.jpeg",
      },
      entityCreated: "19. Marts 2021",
      body: {
        value: articleBody,
      },
    },
  };

  return (
    <div>
      <StoryTitle>Article Page</StoryTitle>
      <Content data={data} />
    </div>
  );
}

export function InfomediaArticle() {
  const data = {
    article: {
      title: "Titel på Infomedia-artikel",
      subHeadLine: "Undertitel",
      fieldRubrik: "Og en lil' rubrik er her",
      entityCreated: "19. Marts 2021",
      body: {
        value:
          '<p id="p1">Artiklens indhold er her</p><p id="p2"><em style="bold">Noget med fed</em></p><p id="p2"><em style="italic">Noget med kursiv</em></p>',
      },
      category: ["En kategori"],
      creators: [{ name: "Gudrun Jensen" }, { name: "Anders Andersen" }],
      paper: "Computerworld",
      deliveredBy: "Infomedia",
      disclaimer: {
        logo: "/infomedia_logo.svg",
        text: "Alt materiale i Infomedia er omfattet af lov om ophavsret og må ikke kopieres uden særlig tilladelse.",
      },
    },
  };

  return (
    <div>
      <StoryTitle>InfomediaArticle Page</StoryTitle>
      <Content data={data} />
    </div>
  );
}

export function InfomediaArticlePublicData() {
  const data = {
    article: {
      title: "Titel på Infomedia-artikel",
      entityCreated: "19. Marts 2021",
      category: ["En kategori"],
      creators: [{ name: "Gudrun Jensen" }, { name: "Anders Andersen" }],
      deliveredBy: "Infomedia",
    },
  };

  return (
    <div>
      <StoryTitle>InfomediaArticle Page</StoryTitle>
      <Content data={data} />
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <StoryTitle>Article Page - loading</StoryTitle>
      <ContentSkeleton />
    </div>
  );
}
