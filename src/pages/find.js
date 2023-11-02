import Head from "next/head";
import { useRouter } from "next/router";

import * as searchFragments from "@/lib/api/search.fragments";

import useFilters, {
  getQuery as getQueryFilters,
} from "@/components/hooks/useFilters";
import useQ, {
  types as typesQ,
  getQuery as getQueryQ,
} from "@/components/hooks/useQ";
import { fetchAll } from "@/lib/api/apiServerOnly";
import { useData } from "@/lib/api/api";

import useDataCollect from "@/lib/useDataCollect";

import Result from "@/components/search/result/Result";
import Searchbar from "@/components/search/searchbar";
import Translate from "@/components/base/translate";

import Related from "@/components/search/related";

import Header from "@/components/header/Header";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";
import { SuggestTypeEnum } from "@/lib/enums";
import { useRef } from "react";

/**
 * @file
 * This is the search page
 *
 */
function Find() {
  // To get correct hitcount we use the serverside supported getQuery instead of the local filters
  const filters = useFilters().getQuery();
  const q = useQ().getQuery();
  const dataCollect = useDataCollect();
  const router = useRouter();
  const scrollRef = useRef();

  const { page = 1 } = router.query;

  // Add worktype and all q types to useCanonicalUrl func
  const { canonical, alternate } = useCanonicalUrl({
    preserveParams: ["workTypes", ...typesQ.map((t) => `q.${t}`)],
  });

  // use the useData hook to fetch data
  const hitcountResponse = useData(searchFragments.hitcount({ q, filters }));

  const hits = hitcountResponse?.data?.search?.hitcount || 0;

  const context = { context: "metadata" };

  const titleToUse =
    q[SuggestTypeEnum.ALL] ||
    q[SuggestTypeEnum.TITLE] ||
    q[SuggestTypeEnum.CREATOR] ||
    q[SuggestTypeEnum.SUBJECT];
  const pageTitle = Translate({
    ...context,
    label: "find-title",
    vars: [titleToUse],
  });

  const pageDescription = Translate({
    ...context,
    label: "find-description",
    vars: [`${hits}`, titleToUse],
  });

  function scrollToRef(ref) {
    ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  /**
   * Updates URL query params
   *
   * @param {Object} params
   */
  async function updateQueryParams(params) {
    const query = { ...router.query, ...params };

    await router.push(
      { pathname: router.pathname, query },
      {
        pathname: router.asPath.replace(/\?.*/, ""),
        query,
      },
      { shallow: true, scroll: false }
    );
  }

  return (
    <>
      <Head>
        <title key="title">{pageTitle}</title>
        <meta
          key="description"
          name="description"
          content={pageDescription}
        ></meta>
        <meta key="og:url" property="og:url" content={canonical.url} />
        <meta key="og:title" property="og:title" content={pageTitle} />
        <meta
          key="og:description"
          property="og:description"
          content={pageDescription}
        />
        <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
        {alternate.map(({ locale, url }) => (
          <link key={locale} rel="alternate" hreflang={locale} href={url} />
        ))}
      </Head>

      <div ref={scrollRef} />

      <Header router={router} />

      <main>
        <Searchbar q={q} />
        <Related q={q} />

        {q && (
          <Result
            page={parseInt(page, 10)}
            onPageChange={async (page, scroll) => {
              scroll = typeof scroll !== "boolean" || scroll !== false;
              await updateQueryParams({ page });
              scroll && scrollToRef(scrollRef);
            }}
            onWorkClick={(index, work) => {
              dataCollect.collectSearchWorkClick({
                search_request: { q, filters },
                search_query_hit: index + 1,
                search_query_work: work.workId,
              });
            }}
          />
        )}
      </main>
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
  return fetchAll([searchFragments.hitcount], ctx, {
    filters: queryFilters,
    q: queryQ,
  });
};

export default Find;
