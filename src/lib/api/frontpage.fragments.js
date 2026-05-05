/**
 * @file GraphQL queries for the CMS-driven frontpage (Strapi via bibliotekdkCms subgraph)
 */

import { ApiEnums } from "@/lib/api/api";
import { getLocale } from "@/components/base/translate/Translate";
import { getSite } from "@/components/hooks/useSiteConfig";

/**
 * Fetch the frontpage entry from the Strapi CMS for the current site.
 * Site is read from Next runtime config, defaulting to "bibliotekdk".
 *
 * @param {Object} params
 * @param {string} [params.locale] Strapi locale code
 */
export function cmsFrontpage({ locale = getLocale() } = {}) {
  const site = getSite();
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query CmsFrontpage($site: String!, $locale: BibliotekdkCmsI18NLocaleCode) {
      bibliotekdkCms {
        frontpages(
          status: PUBLISHED
          filters: { site: { name: { eq: $site } } }
          locale: $locale
          pagination: { limit: 1 }
        ) {
          documentId
          hero {
            alternativeText
            description
            image {
              url
              width
              height
            }
          }
          sections {
            __typename
            ... on BibliotekdkCmsComponentFrontpageSection {
              id
              title
              template
              articles {
                documentId
                title
                subheadline
                body
                categories {
                  documentId
                  name
                }
                image {
                  alternativeText
                  caption
                  url
                  width
                  height
                }
              }
            }
            ... on BibliotekdkCmsComponentFrontpageInspirationSlider {
              id
              title
              category
              subcategories
              limit
              showDivider
            }
            ... on BibliotekdkCmsComponentFrontpageLinkCard {
              id
              title
              buttonText
              url
              image {
                alternativeText
                url
                width
                height
              }
            }
          }
        }
      }
    }`,
    variables: { site, locale },
    slowThreshold: 3000,
  };
}

/**
 * Extract the first frontpage entry from query data.
 *
 * @param {Object} data
 * @returns {Object|null}
 */
export function getCmsFrontpage(data) {
  return data?.bibliotekdkCms?.frontpages?.[0] ?? null;
}
