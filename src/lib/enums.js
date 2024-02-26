export const SuggestTypeEnum = Object.freeze({
  TITLE: "title",
  SUBJECT: "subject",
  CREATOR: "creator",
  COMPOSITE: "composit",
  HISTORY: "history",
  ALL: "all",
});

export const AdvFacetsTypeEnum = Object.freeze({
  MATERIAL_TYPES: "specificmaterialtype",
  SUBJECT: "subject",
  // CREATORS: "creators",
  MAIN_LANGUAGE: "mainlanguage",
  // GENRE_AND_FORM: "genreAndForm",
  // CHILDREN_OR_ADULTS: "childrenOrAdults",
});

export const FilterTypeEnum = Object.freeze({
  MATERIAL_TYPES: "materialTypesSpecific",
  ACCESS_TYPES: "accessTypes",
  SUBJECTS: "subjects",
  CREATORS: "creators",
  FICTION_NONFICTION: "fictionNonfiction",
  MAIN_LANGUAGES: "mainLanguages",
  GENRE_AND_FORM: "genreAndForm",
  CHILDREN_OR_ADULTS: "childrenOrAdults",
  FICTIONAL_CHARACTERS: "fictionalCharacters",
  WORK_TYPES: "workTypes",
  //ALWAYS_LOAN: "canAlwaysBeLoaned",
});

export const AccessEnum = Object.freeze({
  ACCESS_URL: "AccessUrl",
  INFOMEDIA_SERVICE: "InfomediaService",
  EREOL: "Ereol",
  DIGITAL_ARTICLE_SERVICE: "DigitalArticleService",
  INTER_LIBRARY_LOAN: "InterLibraryLoan",
});

export const WorkTypeEnum = Object.freeze({
  ARTICLE: "ARTICLE",
  MOVIE: "MOVIE",
  LITERATURE: "LITERATURE",
  DEBATEARTICLE: "DEBATEARTICLE",
});

export const RelationTypeEnum = Object.freeze({
  CONTINUES: { key: "continues", workType: WorkTypeEnum.ARTICLE },
  CONTINUEDIN: { key: "continuedIn", workType: WorkTypeEnum.ARTICLE },
  ISADAPTATIONOF: { key: "isAdaptationOf", workType: WorkTypeEnum.MOVIE },
  HASADAPTATION: { key: "hasAdaptation", workType: WorkTypeEnum.LITERATURE },
  DISCUSSES: { key: "discusses", workType: WorkTypeEnum.DEBATEARTICLE },
  DISCUSSEDIN: { key: "discussedIn", workType: WorkTypeEnum.DEBATEARTICLE },
});

export const AnchorsEnum = Object.freeze({
  SERIES: { context: "workmenu", label: "series" },
  RELATED_WORKS: { context: "relatedworks", label: "title" },
  UNIVERSES: { context: "workmenu", label: "universes" },
});

export const HiddenRoleFunctionEnum = Object.freeze({
  OPHAV: { code: "cre", singular: "ophav", plural: "ophav" },
});
