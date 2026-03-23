import { ApiEnums } from "@/lib/api/api";

const FAQ_FIELDS = `
  documentId
  title
  body
  promoted
  category {
    documentId
    name
  }
`;

/**
 * Get all published FAQs (used on the full FAQ page /hjaelp/faq)
 */
export function publishedFaqs() {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
      query PublishedFaqsQuery {
        bibliotekdkCms {
          faqs(status: PUBLISHED) {
            ${FAQ_FIELDS}
          }
        }
      }
    `,
    slowThreshold: 3000,
  };
}

/**
 * Get promoted FAQs (used on the help landing page).
 * Strapi does not support filtering on the promoted boolean directly in this
 * query, so we fetch all published FAQs and filter client-side in the component.
 */
export function promotedFaqs() {
  return publishedFaqs();
}
