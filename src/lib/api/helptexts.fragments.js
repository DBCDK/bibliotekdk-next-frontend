import { lang, getLanguage } from "@/components/base/translate";
import { ApiEnums } from "@/lib/api/api";
import { getLangcode } from "@/components/base/translate/Translate";
/**
 * Helptexts - published
 */
export function publishedHelptexts({ language }) {
  const langcode = getLangcode(language);
  if (!language) {
    return null;
  }
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query ($language: LanguageId! $langcode: [String]){
      nodeQuery (limit:75 filter: {conditions: [
        {field: "type", value: ["help_text"]},
        {field: "status", value:"1"},
        {field: "langcode", value: $langcode}
      ] }) {
        count
        entities(language:$language) {
        ... on NodeHelpText {
            nid
            title
            body{
              value
              processed
            }
            fieldHelpTextGroup
            fieldImage {
              alt
              title
              url
              width
              height
            }
          }
        }
      }
     monitor(name: "published_helptexts")
    }`,
    variables: { language, langcode },
    slowThreshold: 3000,
  };
}

export function helpText({ helpTextId }) {
  const language = getLanguage();

  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query helptext ($helpTextId: String!, $language: LanguageId!) {
      nodeById(id: $helpTextId, language: $language) {
        ... on NodeHelpText {
          nid
          title
          body {
            value
            processed
          }
          entityCreated
          entityChanged
          fieldHelpTextGroup
          fieldImage {
            alt
            title
            url
            width
            height
          }
        }
      }
      monitor(name: "helptext_by_id")
    }`,
    variables: { helpTextId, language },
    slowThreshold: 3000,
  };
}

export function helpTextSearch({ q }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    delay: 100, // add small delay to avoid flicker when query is fast
    query: `query ($q: String!, $language: LanguageCodeEnum) {
              help(q: $q, language: $language) {
                result {
                  body
                  group
                  nid      
                  orgTitle
                  title
                }
              }
          monitor(name: "helptext_search")
        }`,
    variables: { q, language: lang?.toUpperCase() },
    slowThreshold: 3000,
  };
}
