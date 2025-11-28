import { ApiEnums } from "@/lib/api/api";
import { getLangcode } from "@/components/base/translate/Translate";
export function promotedFaqs(language) {
  const langcode = getLangcode(language);
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query($language: LanguageId! $langcode: [String]) {
      faq: nodeQuery (limit:75 filter: {conditions: [
        {field: "type", value: ["faq"]},
        {field: "status", value:"1"},
        {field: "promote", value:"1"},
        {field: "langcode", value: $langcode}
      ] }) {
        count
        entities (language: $language){
        ... on NodeFaq {
          langcode {
            value
            }
            nid
            title
          promote
            body{
              value
              processed
            }
          fieldTags {
            entity {
              entityLabel
              }
            }
          }
        }
      }
     monitor(name: "promoted_faqs")
    }`,
    variables: { language, langcode },
    slowThreshold: 3000,
  };
}

/**
 * Get published faq's
 * @param language
 *  NOTICE Drupals default language code is en - most (all) content is written in en ..
 *  as default
 * @returns {{variables: {}, slowThreshold: number, query: string}}
 */
export function publishedFaqs(language) {
  const langcode = getLangcode(language);
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query($language: LanguageId! $langcode: [String]) {
      faq: nodeQuery (limit:75 filter: {conditions: [
        {field: "type", value: ["faq"]},
        {field: "status", value:"1"},
        {field: "langcode", value: $langcode}
      ] }) {
        count
        entities (language: $language){
        ... on NodeFaq {
            langcode {
              value
            }
            nid
            title
            promote
            body{
              value
              processed
            }
            fieldTags {
              entity {
                entityLabel
              }
            }            
          }
        }
      }
     monitor(name: "published_faqs")
    }`,
    variables: { language, langcode },
    slowThreshold: 3000,
  };
}

export function FaqById({ faqId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query ($faqId: String!) {
        faq: nodeById(id: $faqId){
        ... on NodeFaq {
            langcode {
              value
            }
            nid
            title
            promote
            body{
              value
              processed
            }
            fieldTags {
              entity {
                entityLabel
              }
            }            
          }
        }
          
        monitor(name: "faq_by_id")
        }`,
    variables: { faqId },
    slowThreshold: 3000,
  };
}
