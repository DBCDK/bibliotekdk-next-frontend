import { StoryTitle } from "@/storybook";
import { ArticleSection } from "@/components/article/section";

export default {
  title: "Articles",
};

export function ArticlePreviewSection() {
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
      fieldTags: [
        { entity: { entityLabel: "section-help" } },
        { entity: { entityLabel: "pos-2" } },
      ],
    },
    {
      title: "Bibliotek.dk",
      fieldRubrik:
        "På bibliotek.dk søger du i alle landets fysiske og digitale biblioteker. Det du ønsker kan du nemt få leveret til dit lokale bibliotek eller tilgå direkte online.",
      fieldImage: {
        alt: "some image alt",
        title: "some image title",
        url: "/img/bibdk-hero-scaled.jpeg",
      },
      fieldArticleSection: "section other",
      fieldArticlePosition: "1",
      fieldTags: [
        { entity: { entityLabel: "section-other" } },
        { entity: { entityLabel: "pos-1" } },
      ],
    },
    null,
  ];
  return (
    <div>
      <StoryTitle>Article Preview Section</StoryTitle>

      <ArticleSection
        title="Bibliotek.dk tilbyder"
        articles={articles}
        matchTag="section 2"
      />
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <StoryTitle>Article Preview Section - loading</StoryTitle>
      <ArticleSection title="Bibliotek.dk tilbyder" skeleton={true} />
    </div>
  );
}
