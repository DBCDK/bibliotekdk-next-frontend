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
import { fetchAll } from "@/lib/api/apiServerOnly";
import * as workFragments from "@/lib/api/work.fragments";

import Page from "@/components/work/page";
import Header from "@/components/work/page/Header";
import { signIn } from "@dbcdk/login-nextjs/client";
import React, { useMemo, useState } from "react";
import {
  formatMaterialTypesFromUrl,
  formatMaterialTypesToUrl,
} from "@/lib/manifestationFactoryFunctions";

/**
 * Renders the WorkPage component
 */
export default function WorkPage() {
  const router = useRouter();
  const { workId, type } = router.query;
  const [query, setQuery] = useState({});

  useMemo(() => {
    if (query.type) {
      router.replace(
        { pathname: router.pathname, query },
        {
          pathname: router.asPath.replace(/\?.*/, ""),
          query,
        },
        { shallow: true, scroll: false }
      );
    }
  }, [query]);

  /**
   * Updates the query params in the url
   * (f.x. query.type which changes the type of material selected: Book, Ebook, ...)
   *
   * @param {obj} queryInput
   */
  function handleOnTypeChange(queryInput) {
    setQuery({
      ...queryInput,
      type: formatMaterialTypesToUrl(queryInput?.type),
    });
  }

  return (
    <React.Fragment>
      <Header workId={workId} />
      <Page
        workId={workId}
        onTypeChange={handleOnTypeChange}
        login={signIn}
        type={formatMaterialTypesFromUrl(type)}
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
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * We do check if a work is found - if not we redirect to 'not found' page
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
WorkPage.getInitialProps = async (ctx) => {
  const init = await fetchAll(serverQueries, ctx);
  const queries = Object.values(init.initialData);
  if (queries[0]?.data && !queries[0]?.data?.work) {
    ctx.res.statusCode = 404;
    return {
      notFound: true,
    };
  }
  return init;
};
