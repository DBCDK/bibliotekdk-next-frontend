import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";

import Header from "@/components/header/Header";
import Translate from "@/components/base/translate";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";
import useFilters, {
  getQuery as getQueryFilters,
} from "@/components/hooks/useFilters";
import useQ, {
  types as typesQ,
  getQuery as getQueryQ,
} from "@/components/hooks/useQ";
import { useData } from "@/lib/api/api";
import * as searchFragments from "@/lib/api/search.fragments";
import { fetchAll } from "@/lib/api/apiServerOnly";
import useDataCollect from "@/lib/useDataCollect";
import { SuggestTypeEnum } from "@/lib/enums";

import Page from "@/components/search/page";

export default function FindPage() {
  const router = useRouter();

  const scrollRef = useRef();
  const filters = useFilters().getQuery();
  const q = useQ().getQuery();
  const dataCollect = useDataCollect();

  const { page = 1 } = router.query;

  const { canonical, alternate } = useCanonicalUrl({
    preserveParams: ["workTypes", ...typesQ.map((t) => `q.${t}`)],
  });

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

  async function updateQueryParams(params) {
    const query = { ...router.query, ...params };

    await router.push(
      { pathname: router.pathname, query },
      { pathname: router.asPath.replace(/\?.*/, ""), query },
      { shallow: true, scroll: false }
    );
  }

  return (
    <>
      <Head>
        <title key="title">{pageTitle}</title>
        <meta key="description" name="description" content={pageDescription} />
        <meta key="og:url" property="og:url" content={canonical.url} />
        <meta key="og:title" property="og:title" content={pageTitle} />
        <meta
          key="og:description"
          property="og:description"
          content={pageDescription}
        />
        <link rel="preconnect" href="https://moreinfo.addi.dk" />
        {alternate.map(({ locale, url }) => (
          <link key={locale} rel="alternate" hreflang={locale} href={url} />
        ))}
      </Head>

      <Header router={router} />
      <div ref={scrollRef} />

      <Page
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
    </>
  );
}

// SSR-support
FindPage.getInitialProps = async (ctx) => {
  const mode = ctx.query.mode || ctx.params?.mode;
  console.log("✅ SSR mode:", mode);

  const validModes = ["simpel", "avanceret", "cql"];
  if (!validModes.includes(mode)) {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: "/find/simpel" });
      ctx.res.end();
    }
    return {};
  }

  const queryFilters = getQueryFilters(ctx.query);
  const queryQ = getQueryQ(ctx.query);

  const modeForFetch = mode === "cql" ? "avanceret" : mode;

  return await fetchAll([searchFragments.hitcount], ctx, {
    filters: queryFilters,
    q: queryQ,
    mode: modeForFetch,
  });
};
