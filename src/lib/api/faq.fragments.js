export function promotedFaqs(language) {
  return {
    query: `query($language: LanguageId!) {
      faq: nodeQuery (limit:20 filter: {conditions: [
        {field: "type", value: ["faq"]},
        {field: "status", value:"1"},
        {field: "promote", value:"1"}
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
    variables: { language },
    slowThreshold: 3000,
  };
}

/**
 * Get published faq's
 * @param langcode
 *  NOTICE Drupals default language code is en - most (all) content is written in en ..
 *  as default
 * @return {{variables: {}, slowThreshold: number, query: string}}
 */
export function publishedFaqs(langcode) {
  return {
    query: `query($langcode: LanguageId!) {
      faq: nodeQuery (limit:20 filter: {conditions: [
        {field: "type", value: ["faq"]},
        {field: "status", value:"1"}
      ] }) {
        count
        entities (language: $langcode){
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
    variables: { langcode },
    slowThreshold: 3000,
  };
}

export function FaqById({ faqId }) {
  return {
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
