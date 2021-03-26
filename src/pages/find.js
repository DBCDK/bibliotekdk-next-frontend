import React, { useEffect, useState } from "react";

import QuickFilters from "@/components/search/quickfilters";
import Result from "@/components/search/result/Result";
import Searchbar from "@/components/search/searchbar";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  collectSearch,
  collectSearchWorkClick,
} from "@/lib/api/datacollect.mutations";
import { fetcher } from "@/lib/api/api";
import Header from "@/components/header/Header";

/**
 * @file
 * This is the search page
 *
 */
function Find() {
  const router = useRouter();
  const [numPages, setNumPages] = useState(0);
  const { q, page = 1, view } = router.query;
  const pageTitle = "Søg, find og lån fra alle Danmarks biblioteker";
  const pageDescription =
    "bibliotek.dk er din indgang til bibliotekernes fysiske og digitale materialer.";

  /**
   * Updates URL query params
   *
   * @param {object} params
   */
  function updateQueryParams(params, settings = {}) {
    const query = { ...router.query, ...params };
    router.push(
      { pathname: router.pathname, query },
      {
        pathname: router.asPath.replace(/\?.*/, ""),
        query,
      },
      { shallow: true, ...settings }
    );
  }

  // Sideeffects to be run when search query changes
  useEffect(() => {
    // Check that q is set and not the empty string
    if (q) {
      fetcher(
        collectSearch({
          search_query: q,
        })
      );
    }
  }, [q]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription}></meta>
        <meta property="og:url" content="https://alfa.bibliotek.dk/find" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
        <meta property="og:url" content="https://alfa.bibliotek.dk/find" />
      </Head>
      <Header router={router} />
      <Searchbar query={q} />

      <QuickFilters
        viewSelected={view}
        onViewSelect={(view) => updateQueryParams({ view })}
      />
      {q && (
        <Result
          q={q}
          page={parseInt(page, 10)}
          viewSelected={view}
          updateNumPages={(pages) => setNumPages(pages)}
          onViewSelect={(view) => updateQueryParams({ view })}
          onPageChange={(page, scroll) =>
            updateQueryParams({ page }, { scroll })
          }
          onWorkClick={(index, work) => {
            fetcher(
              collectSearchWorkClick({
                search_query: q,
                search_query_hit: index + 1,
                search_query_work: work.id,
              })
            );
          }}
        />
      )}
    </>
  );
}

export default Find;
