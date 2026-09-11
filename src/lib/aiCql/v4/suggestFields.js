/**
 * @file
 * Which v4 fields are resolved through the FBI-API suggester, and with which
 * `ComplexSuggestionTypeEnum` type.
 *
 * These are the open vocabularies – there is no facet dump to match against,
 * so the catalogue itself is asked what the real value looks like. Controlled
 * fields (genre, mood, material type, languages …) are NOT in this map: they
 * are resolved locally against vocab.json by the compiler.
 *
 * `default` is deliberately absent: free text that the model could not place
 * in a field must stay as the user wrote it, otherwise a one-word prompt would
 * be replaced by an unrelated title.
 */

/** field name → ComplexSuggestionTypeEnum */
export const SUGGEST_TYPES = Object.freeze({
  creatorcontributor: "CREATORCONTRIBUTOR",
  function: "CREATORCONTRIBUTORFUNCTION",
  subject: "SUBJECT",
  title: "TITLE",
  series: "SERIES",
  publisher: "PUBLISHER",
  hostpublication: "HOSTPUBLICATION",
  fictionalcharacter: "FICTIONALCHARACTER",
});

/** The same fields as a list, for the system prompt. */
export const SUGGESTED_FIELDS = Object.freeze(Object.keys(SUGGEST_TYPES));
