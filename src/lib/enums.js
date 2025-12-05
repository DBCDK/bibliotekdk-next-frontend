export const SuggestTypeEnum = Object.freeze({
  TITLE: "title",
  SUBJECT: "subject",
  CREATOR: "creator",
  COMPOSITE: "composit",
  HISTORY: "history",
  ALL: "all",
});

// Enum defining what databases to handle from facet.source
export const FacetValidDatabases = Object.freeze({
  BESÆTTELSESTIDSBIBLIOGRAFIEN: "Besættelsestidsbibliografien",
  SPORTLINE: "Sportline",
  BIBLIOGRAFI_OVER_DANSK_KUNST: "Bibliografi over Dansk Kunst",
  DANSK_HISTORISK_BIBLIOGRAFI: "Dansk Historisk Bibliografi",
  DANIA_POLYGLOTTA: "Dania Polyglotta",
  DANSK_MUSIKLITTERÆR_BIBLIOGRAFI: "Dansk Musiklitterær Bibliografi",
  DANSK_LITTERATURHISTORISK_BIBLIOGRAFI:
    "Dansk Litteraturhistorisk Bibliografi",
  KONGELIGE_TEATER_PROGRAMARTIKLER: "Kongelige Teater programartikler",
});

export const SimpleFacetsTypeEnum = Object.freeze({
  SPECIFICMATERIALTYPE: "materialTypesSpecific",
  FICTIONALCHARACTERS: "fictionalCharacters",
});

export const AdvFacetsTypeEnum = Object.freeze({
  SPECIFICMATERIALTYPE: "specificmaterialtype",
  CREATOR: "creator",
  CONTRIBUTOR: "contributor",
  SUBJECT: "subject",
  MAINLANGUAGE: "mainlanguage",
  GENERALAUDIENCE: "generalaudience",
  FICTIONALCHARACTER: "fictionalcharacter",
  GENREANDFORM: "genreandform",
  AGES: "ages",
  LIX: "lix",
  LET: "let",
  PRIMARYTARGET: "primarytarget",
  PUBLICATIONYEAR: "publicationyear",
  SOURCE: "source",
  INSTRUMENT: "instrument",
  CHOIRTYPE: "choirtype",
  CHAMBERMUSICTYPE: "chambermusictype",
  HOSTPUBLICATIONTYPE: "hostpublicationtype",
  // CATALOGUECODE: "cataloguecode",
  // CONTRIBUTORFUNCTION: "contributorfunction",
  // CREATORCONTRIBUTOR: "creatorcontributor",
  // CREATORCONTRIBUTORFUNCTION: "creatorcontributorfunction",
  // CREATORFUNCTION: "creatorfunction",
  // FILMNATIONALITY: "filmnationality",
  // GAMEPLATFORM: "gameplatform",
  // GENERALMATERIALTYPE: "generalmaterialtype",
  // ISSUE: "issue",
  // LANGUAGE: "language",
  // LIBRARYRECOMMENDATION: "libraryrecommendation",
  // MUSICALENSEMBLEORCAST: "musicalensembleorcast",
  // PLAYERS: "players",
  // SPOKENLANGUAGE: "spokenlanguage",
  // SUBTITLELANGUAGE: "subtitlelanguage",
  // TYPEOFSCORE: "typeofscore",
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
  PUBLIZON: "Publizon",
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
