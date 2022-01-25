import React, { useEffect, useState } from "react";

import QuickFilters from "@/components/search/quickfilters";
import Result from "@/components/search/result/Result";
import Searchbar from "@/components/search/searchbar";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import { hitcount } from "@/lib/api/search.fragments";

import useFilters, {
  getQuery as getQueryFilters,
} from "@/components/hooks/useFilters";
import useQ, {
  types as typesQ,
  getQuery as getQueryQ,
} from "@/components/hooks/useQ";

import { useModal } from "@/components/_modal";

import Head from "next/head";
import { useRouter } from "next/router";
import {
  collectSearch,
  collectSearchWorkClick,
} from "@/lib/api/datacollect.mutations";
import { useFetcher } from "@/lib/api/api";
import { fetchAll } from "@/lib/api/apiServerOnly";

import Header from "@/components/header/Header";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";

/**
 * @file
 * This is the search page
 *
 */
function Find() {
  const modal = useModal();

  // To get correct hitcount we use the serverside supported getQuery instead of the local filters
  const filters = useFilters().getQuery();
  const q = useQ().getQuery();

  const router = useRouter();
  const fetcher = useFetcher();
  const { page = 1, view } = router.query;

  // Add worktype and all q types to useCanonicalUrl func
  const { canonical, alternate, root } = useCanonicalUrl({
    preserveParams: ["workType", ...typesQ.map((t) => `q.${t}`)],
  });

  // use the useData hook to fetch data
  const hitcountResponse = useData(hitcount({ q: q, filters }));

  const hits = hitcountResponse?.data?.search?.hitcount || 0;

  const context = { context: "metadata" };

  const pageTitle = Translate({
    ...context,
    label: "find-title",
    vars: [q?.all],
  });

  const pageDescription = Translate({
    ...context,
    label: "find-description",
    vars: [`${hits}`, q?.all],
  });

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
    if (q.all) {
      fetcher(
        collectSearch({
          search_query: q.all,
        })
      );
    }
  }, [q.all]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription}></meta>
        <meta property="og:url" content={canonical.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta
          property="og:image"
          content={`${root}/img/bibdk-og-cropped.jpg`}
        />
        <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
        {alternate.map(({ locale, url }) => (
          <link key={url} rel="alternate" hreflang={locale} href={url} />
        ))}
      </Head>
      <Header router={router} />

      <Searchbar q={q} />

      <QuickFilters
        viewSelected={view}
        onViewSelect={(view) => updateQueryParams({ view })}
        onFiltersClick={() => modal.push("filter", { q })}
      />

      {q && (
        <Result
          q={q}
          page={parseInt(page, 10)}
          viewSelected={view}
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

Find.getInitialProps = (ctx) => {
  // Build a filters object based on the context query
  const queryFilters = getQueryFilters(ctx.query);
  // Get correct structured q params from query
  const queryQ = getQueryQ(ctx.query);
  // Appends a custom query filters object containing all materialfilters
  // The filters object can now be read by the search.fragments
  return fetchAll([hitcount], ctx, { filters: queryFilters, q: queryQ });
};

export default Find;
