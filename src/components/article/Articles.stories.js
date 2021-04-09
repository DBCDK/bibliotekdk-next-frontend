import { StoryTitle, StoryLabel, StoryDescription } from "@/storybook";
import { ArticleSection } from "@/components/article/section";

export default {
  title: "articles/sections",
};

const articles = [
  {
    nid: 1,
    title: "Digitale bibliotekstilbud",
    fieldArticleSection: "section 2",
    fieldArticlePosition: "3",
    fieldRubrik:
      "Læs mere om forfattere, musik og temaer. Se film, læs artikler, e- og lydbøger, og meget mere.",
    fieldImage: {
      alt: "some image alt",
      title: "some image title",
      url: "/img/bibdk-hero-scaled.jpeg",
    },
    entityUrl: {
      path: "/node/1",
    },
    fieldTags: [
      { entity: { entityLabel: "section-help" } },
      { entity: { entityLabel: "pos-3" } },
    ],
  },
  {
    nid: 2,
    title: "Spørg en bibliotekar",
    fieldArticleSection: "section 2",
    fieldArticlePosition: "1",
    fieldRubrik:
      "Online bibliotekarhjælp. Få råd og hjælp til alt fra informationssøgning til reservationer.",
    fieldImage: {
      alt: "some image alt",
      title: "some image title",
      url: "/img/bibdk-hero-scaled.jpeg",
    },
    entityUrl: {
      path: "/node/2",
    },
    fieldTags: [
      { entity: { entityLabel: "section-help" } },
      { entity: { entityLabel: "pos-1" } },
    ],
  },
  {
    nid: 3,
    title: "Bibliotek.dk",
    fieldArticleSection: "section 2",
    fieldArticlePosition: "2",
    fieldRubrik:
      "På bibliotek.dk søger du i alle landets fysiske og digitale biblioteker. Det du ønsker kan du nemt få leveret til dit lokale bibliotek eller tilgå direkte online.",
    fieldImage: {
      alt: "some image alt",
      title: "some image title",
      url: "/img/bibdk-hero-scaled.jpeg",
    },
    entityUrl: {
      path: "/node/3",
    },
    fieldTags: [
      { entity: { entityLabel: "section-help" } },
      { entity: { entityLabel: "pos-2" } },
    ],
  },
  {
    nid: 4,
    title: "Bibliotek.dk",
    fieldRubrik:
      "På bibliotek.dk søger du i alle landets fysiske og digitale biblioteker. Det du ønsker kan du nemt få leveret til dit lokale bibliotek eller tilgå direkte online.",
    fieldImage: {
      alt: "some image alt",
      title: "some image title",
      url: "/img/bibdk-hero-scaled.jpeg",
    },
    fieldArticleSection: "section 4",
    fieldArticlePosition: "1",
    fieldTags: [
      { entity: { entityLabel: "section-other" } },
      { entity: { entityLabel: "pos-1" } },
    ],
  },
  {
    nid: 5,
    title: "Alle artikler",
    fieldRubrik: "Vejledninger og information",
    fieldImage: {
      alt: "some image alt",
      title: "some image title",
      url: "/img/bibdk-hero-scaled.jpeg",
    },
    fieldAlternativeArticleUrl: {
      uri: "internal:/artikler",
      title: "Vejledninger og information",
    },
    fieldArticleSection: "section 3",
    fieldArticlePosition: "1",
    fieldTags: [
      { entity: { entityLabel: "section-other" } },
      { entity: { entityLabel: "pos-1" } },
    ],
  },
  null,
];

export function SingleSection() {
  return (
    <div>
      <StoryTitle>1 article template</StoryTitle>
      <StoryDescription>Action button goes to current article</StoryDescription>
      <ArticleSection
        title={false}
        articles={articles}
        matchTag="section 4"
        template="single"
      />
    </div>
  );
}

export function SingleSectionAlternativeUrl() {
  return (
    <div>
      <StoryTitle>1 article template</StoryTitle>
      <StoryDescription>
        Action button goes to an alternative url (page), defined by an editor in
        the CMS
      </StoryDescription>
      <ArticleSection
        title={false}
        articles={articles}
        matchTag="section 3"
        template="single"
      />
    </div>
  );
}

export function DoubleSection() {
  return (
    <div>
      <StoryTitle>2 articles template</StoryTitle>
      <ArticleSection
        title="Bibliotek.dk tilbyder"
        articles={articles}
        matchTag="section 2"
        template="double"
      />
    </div>
  );
}

export function TripleSection() {
  return (
    <div>
      <StoryTitle>3 articles template</StoryTitle>
      <ArticleSection
        title="Bibliotek.dk tilbyder"
        articles={articles}
        matchTag="section 2"
        template="triple"
      />
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <StoryTitle>Article Preview Section - loading</StoryTitle>

      <StoryLabel>Loading single section</StoryLabel>
      <ArticleSection title={false} skeleton={true} template="single" />

      <StoryLabel>Loading double section</StoryLabel>
      <ArticleSection
        title="Bibliotek.dk tilbyder"
        skeleton={true}
        template="double"
      />

      <StoryLabel>Loading triple section</StoryLabel>
      <ArticleSection
        title="Bibliotek.dk tilbyder"
        skeleton={true}
        template="triple"
      />
    </div>
  );
}
