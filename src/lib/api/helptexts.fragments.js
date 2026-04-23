import { lang } from "@/components/base/translate";
import { ApiEnums } from "@/lib/api/api";
import { getLocale } from "@/components/base/translate/Translate";

const HELPTEXT_FIELDS = `
  documentId
  title
  body
  group
  image {
    url
    alternativeText
    width
    height
  }
`;

const SITE = process.env.NEXT_PUBLIC_SITE || "bibliotekDk"; //TODO: maybe store default in a constant and reuse it in other queries

/**
 * All published help texts — used for the landing page sections and sidebar menu.
 */
export function publishedHelptexts({ locale = getLocale() } = {}) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query PublishedHelptextsQuery($locale: BibliotekdkCmsI18NLocaleCode, $site: String!) {
      bibliotekdkCms {
        helpTexts(
          status: PUBLISHED,
          locale: $locale,
          pagination: { limit: 100 },
          filters: { sites: { name: { eq: $site } } }
        ) {
          ${HELPTEXT_FIELDS}
        }
      }
    }`,
    variables: { locale, site: SITE },
    slowThreshold: 3000,
  };
}

/**
 * Single help text by documentId.
 */
export function helpText({ helpTextId }) {
  const locale = getLocale();
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query HelptextByIdQuery($documentId: ID!, $locale: BibliotekdkCmsI18NLocaleCode, $site: String!) {
      bibliotekdkCms {
        helpTexts(
          status: PUBLISHED,
          locale: $locale,
          filters: {
            documentId: { eq: $documentId },
            sites: { name: { eq: $site } }
          }
        ) {
          ${HELPTEXT_FIELDS}
          createdAt
          updatedAt
        }
      }
    }`,
    variables: { documentId: helpTextId, locale, site: SITE },
    slowThreshold: 3000,
  };
}

export function helpTextSearch({ q }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    delay: 100,
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
