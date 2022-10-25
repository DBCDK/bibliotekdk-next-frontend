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
});

/** TODO: Maybe use a map like this instead of
 *   flattening the materialTypes as in
 *   "selectMaterialBasedOnType"
 * */
export const MaterialTypeEnum = Object.freeze({
  BOG: "bog",
  EBOG: "e-bog",
  "LYDBOG (NET)": "lydbog (net)",
  "LYDBOG (CD-MP3)": "lydbog (cd-mp3)",
  "LYDBOG (CD)": "Lydbog (cd)",
  "LYDBOG (BÅND)": "lydbog (bånd)",
});
