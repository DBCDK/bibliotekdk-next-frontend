/**
 * @file
 * This is the work landing page
 *
 * Next.js page docs are found here
 * https://nextjs.org/docs/basic-features/pages
 *
 * Note that dynamic routing (file based) is used on this page.
 * https://nextjs.org/docs/routing/dynamic-routes
 *
 * Path parameters on this page:
 *  - title_author: title and author concatenated
 *  - workId: The work id we use when fetching data
 *
 */

import { useRouter } from "next/router";
import { fetchOnServer } from "../../../lib/api/api";
import * as workFragments from "../../../lib/api/work.fragments";

import Page from "../../../components/work/page";
import Header from "../../../components/work/page/Header";

/**
 * Renders the WorkPage component
 */
export default function WorkPage() {
  const router = useRouter();
  const { workId, title_author, type } = router.query;

  /**
   * Updates the query params in the url
   * (f.x. query.type which changes the type of material selected: Book, Ebook, ...)
   *
   * @param {obj} query
   */

  function handleOnTypeChange(query) {
    router.push(
      { pathname: router.pathname, query },
      {
        pathname: router.asPath.replace(/\?.*/, ""),
        query,
      },
      { shallow: true }
    );
  }

  return (
    <React.Fragment>
      <Header workId={workId} />
      <Page
        workId={workId}
        onTypeChange={handleOnTypeChange}
        type={type}
        query={{ type }}
      />
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
 *  - workId
 */
const serverQueries = Object.values(workFragments);

/**
 * We export getServerSideProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
export const getServerSideProps = fetchOnServer(serverQueries);
