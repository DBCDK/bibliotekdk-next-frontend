/**
 * @file test the checkTranslationObject method (@see Translate component).
 * Translations come from backend in the form:
 * {ok:true/false, translations.contexts}
 */

import { checkTranslationsObject } from "@/components/base/translate/Translate";
import translation from "@/components/base/translate/Translate.json";

test("Test_checkTranslations", () => {
  let input = null;
  let expected = false;
  let output = checkTranslationsObject(input);
  // nothing
  expect(output).toEqual(expected);

  input = {};
  expected = false;
  output = checkTranslationsObject(input);
  // empty object
  expect(output).toEqual(expected);

  input = [];
  expected = false;
  output = checkTranslationsObject(input);
  // empty array
  expect(output).toEqual(expected);

  input = [];
  input["ok"] = true;
  input["translations"] = {};
  input["translations"]["context"] = "hund";
  expected = false;
  output = checkTranslationsObject(input);
  // fake array
  expect(output).toEqual(expected);

  input = { ok: true, result: translation };
  expected = true;
  output = checkTranslationsObject(input);

  // the real thing
  expect(output).toEqual(expected);

  // @TODO more tests
});
