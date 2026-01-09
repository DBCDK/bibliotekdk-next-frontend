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
import React, { useEffect, useRef, useState } from "react";
import {
  formatMaterialTypesFromUrl,
  formatMaterialTypesToUrl,
} from "@/lib/manifestationFactoryUtils";
import { workIdToTitleCreator } from "@/lib/api/work.fragments";
import { encodeTitleCreator } from "@/lib/utils";
import { fetcher } from "@/lib/api/api";

/**
 * Renders the WorkPage component
 */
export default function WorkPage() {
  const router = useRouter();
  const { workId, type } = router.query;
  const [query, setQuery] = useState({});
  const cleanedRef = useRef(false);

  function syncUrl(extraVisibleQuery = {}) {
    const { title_author, workId, setPickupAgency, ...rest } = router.query;

    const visibleQuery = { ...rest, ...extraVisibleQuery };
    const internalQuery = { title_author, workId, ...visibleQuery };

    const asPathWithoutQuery = router.asPath.split("#")[0].replace(/\?.*/, "");

    router.replace(
      { pathname: router.pathname, query: internalQuery },
      { pathname: asPathWithoutQuery, query: visibleQuery },
      { shallow: true, scroll: false }
    );
  }

  useEffect(() => {
    if (!router.isReady) return;
    if (cleanedRef.current) return;

    if ("setPickupAgency" in router.query) {
      cleanedRef.current = true;
      syncUrl();
    } else {
      cleanedRef.current = true;
    }
  }, [router.isReady, router.asPath]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!query?.type) return;

    syncUrl(query);
  }, [router.isReady, query?.type]);

  function handleOnTypeChange(queryInput) {
    let newQuery = {
      ...queryInput,
      type: formatMaterialTypesToUrl(queryInput?.type),
    };
    if (router?.query?.tid) newQuery.tid = router?.query?.tid;
    setQuery(newQuery);
  }

  return (
    <>
      <Header workId={workId} />
      <Page
        workId={workId}
        onTypeChange={handleOnTypeChange}
        login={signIn}
        type={formatMaterialTypesFromUrl(type)}
      />
    </>
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
 * Extract fixed url for getInitialProps to fix the url when the title_author is mucked up
 * @param queryRes
 * @param ctx
 * @returns {string|null}
 */
function extractFixedUrl(queryRes, ctx) {
  const title = queryRes?.data?.work?.titles?.main?.[0];
  const creators = queryRes?.data?.work?.creators;
  const title_creator = encodeTitleCreator(title, creators);

  // Change all %3A to ":" for aestetics and to ensure they are the same
  //  across workIds from data and url
  const workIdFromUrl = ctx.query.workId.replaceAll("%3A", ":");
  const workId = queryRes?.data?.work?.workId.replaceAll("%3A", ":");

  // look for materiale to handle "/materiale/[title_author]/[workId]" in url
  //  We exchange wrong [title_author] to actual
  //  and then we use the persistentWorkId instead a pid one
  const fixedUrl = ctx.asPath
    .replaceAll("%3A", ":")
    .replace(
      `materiale/${ctx.query.title_author}`,
      `materiale/${title_creator}`
    )
    .replace(
      `materiale/${title_creator}/${workIdFromUrl}`,
      `materiale/${title_creator}/${workId}`
    );

  const titleCreatorWasFixed =
    title_creator && title_creator !== ctx.query.title_author;
  const workIdWasFixed = workId && workId !== workIdFromUrl;

  if ((titleCreatorWasFixed || workIdWasFixed) && fixedUrl) {
    return fixedUrl;
  }

  return null;
}

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

  // user session
  const queryRes = await fetcher(
    {
      ...workIdToTitleCreator({ workId: ctx.query.workId }),
    },
    ctx.req.headers["user-agent"],
    ctx.req.headers["x-forwarded-for"] || ctx.req.connection.remoteAddress,
    { headers: { ...ctx.req.headers, cookie: ctx.req.customCookieHeader } }
  );

  const fixedUrl = extractFixedUrl(queryRes, ctx);

  if (queries[0]?.data && !queries[0]?.data?.work) {
    ctx.res.statusCode = 404;
    return {
      notFound: true,
    };
  }

  if (fixedUrl) {
    if (typeof window !== "undefined") {
      return {};
    }
    if (ctx.res) {
      ctx.res.writeHead(302, {
        Location: fixedUrl,
        "Content-Type": "text/html; charset=utf-8",
      });
      ctx.res.end();
    }
    return {};
  }

  return init;
};
