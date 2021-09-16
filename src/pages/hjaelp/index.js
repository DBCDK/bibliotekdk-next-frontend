/**
 * @file
 * This is the help page
 *
 * Next.js page docs are found here
 * https://nextjs.org/docs/basic-features/pages
 *
 * Note that dynamic routing (file based) is used on this page.
 * https://nextjs.org/docs/routing/dynamic-routes
 *
 */

import { fetchAll } from "@/lib/api/apiServerOnly";
import { publishedHelptexts } from "@/lib/api/helptexts.fragments.js";
import { promotedFaqs } from "@/lib/api/faq.fragments.js";

import Page from "@/components/help/page";

/**
 * Renders the WorkPage component
 */
export default function HelpPage() {
  return <Page />;
}

/**
 * These queries are run on the server.
 * I.e. the data fetched will be used for server side rendering
 *
 * Note that the queries must only take variables provided by
 * the dynamic routing - or else requests will fail.
 */
const serverQueries = [publishedHelptexts, promotedFaqs];

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
HelpPage.getInitialProps = (ctx) => {
  return fetchAll(serverQueries, ctx);
};
