const data = [
  {
    nid: 1,
    title: "Ældste artikel",
    entityCreated: "2021-01-05T10:19:13+0100",
    fieldRubrik:
      "Læs mere om forfattere, musik og temaer. Se film, læs artikler, e- og lydbøger, og meget mere.",
    entityUrl: {
      path: "/node/1",
    },
    fieldImage: {
      alt: "some image alt",
      title: "some image title",
      url: "/img/bibdk-hero-scaled.jpeg",
    },
  },
  {
    nid: 2,
    title: "Gammel artikel",
    entityCreated: "2021-01-13T13:47:27+0100",
    fieldRubrik:
      "Online bibliotekarhjælp. Få råd og hjælp til alt fra informationssøgning til reservationer.",
    entityUrl: {
      path: "/node/2",
    },
    fieldImage: {
      alt: "some image alt",
      title: "some image title",
      url: "/img/bibdk-hero-scaled.jpeg",
    },
  },
  {
    nid: 4,
    title: "Nyeste artikel",
    entityCreated: "2021-02-25T14:40:40+0100",
    fieldRubrik:
      "På bibliotek.dk søger du i alle landets fysiske og digitale biblioteker. Det du ønsker kan du nemt få leveret til dit lokale bibliotek eller tilgå direkte online.",
    entityUrl: {
      path: "/node/4",
    },
    fieldImage: {
      alt: "some image alt",
      title: "some image title",
      url: "/img/bibdk-hero-scaled.jpeg",
    },
  },
  {
    nid: 3,
    title: "Ny artikel",
    entityCreated: "2021-01-20T14:38:46+0100",
    fieldRubrik:
      "På bibliotek.dk søger du i alle landets fysiske og digitale biblioteker. Det du ønsker kan du nemt få leveret til dit lokale bibliotek eller tilgå direkte online.",
    entityUrl: {
      path: "/node/3",
    },
    fieldImage: {
      alt: "some image alt",
      title: "some image title",
      url: "/img/bibdk-hero-scaled.jpeg",
    },
  },
  {
    nid: 5,
    title: "Article to get removed",
    entityCreated: "2021-01-20T14:38:46+0100",
    fieldRubrik: "I will get removed, because i have an alternative url",
    fieldAlternativeArticleUrl: {
      uri: "internal:/artikler",
      title: "Vejledninger og information",
    },
    fieldImage: {
      alt: "some image alt",
      title: "some image title",
      url: "/img/bibdk-hero-scaled.jpeg",
    },
  },
];

export default data;
