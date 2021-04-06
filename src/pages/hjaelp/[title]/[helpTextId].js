/**
 * @file
 * Page for displaying a helptext
 *
 * Next.js page docs are found here
 * https://nextjs.org/docs/basic-features/pages
 *
 * Note that dynamic routing (file based) is used on this page.
 * https://nextjs.org/docs/routing/dynamic-routes
 *
 * Path parameters on this page:
 *  - helpTextId
 *
 */

import { useRouter } from "next/router";
import { fetchAll } from "@/lib/api/api";
import { helpText, publishedHelptexts } from "@/lib/api/helptexts.fragments";

import Page from "@/components/help/texts/page";

/**
 * Renders the help text component
 */
export default function HelptextPage() {
  const router = useRouter();
  const { helpTextId } = router.query;

  return (
    <React.Fragment>
      <Page helpTextId={helpTextId} />
    </React.Fragment>
  );
}

/**
 * These queries are run on the server.
 * I.e. the data fetched will be used for server side rendering
 *
 * Note that the queries must only take variables provided by
 * the dynamic routing - or else requests will fail.
 * On this page, queries should only use:
 *  - articleId
 */
const serverQueries = [helpText, publishedHelptexts];

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
HelptextPage.getInitialProps = (ctx) => {
  return fetchAll(serverQueries, ctx);
};
