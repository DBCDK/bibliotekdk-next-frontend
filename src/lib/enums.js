export const SuggestTypeEnum = Object.freeze({
  TITLE: "title",
  SUBJECT: "subject",
  CREATOR: "creator",
  COMPOSITE: "composit",
  HISTORY: "history",
  ALL: "all",
});

export const FilterTypeEnum = Object.freeze({
  ACCESS_TYPES: "accessTypes",
  CHILDREN_OR_ADULTS: "childrenOrAdults",
  CREATORS: "creators",
  FICTION_NONFICTION: "fictionNonfiction",
  // FICTIONAL_CHARACTERS: "fictionalCharacters",
  GENRE_AND_FORM: "genreAndForm",
  MAIN_LANGUAGES: "mainLanguages",
  MATERIAL_TYPES: "materialTypes",
  SUBJECTS: "subjects",
  WORK_TYPES: "workTypes",
  ALWAYS_LOAN: "canAlwaysBeLoaned",
});

/** TODO: Maybe use a map like this instead of
 *   flattening the materialTypes as in
 *   "selectMaterialBasedOnType"
 * */
export const MaterialTypeEnum = Object.freeze({
  BOG: "bog",
  EBOG: "ebog",
  "LYDBOG (NET)": "lydbog (net)",
  "LYDBOG (CD-MP3)": "lydbog (cd-mp3)",
  "LYDBOG (CD)": "Lydbog (cd)",
  "LYDBOG (BÅND)": "lydbog (bånd)",
});

export const AccessEnum = Object.freeze({
  ACCESS_URL: "AccessUrl",
  INFOMEDIA_SERVICE: "InfomediaService",
  DIGITAL_ARTICLE_SERVICE: "DigitalArticleService",
  EREOL: "Ereol",
  INTER_LIBRARY_LOAN: "InterLibraryLoan",
});
