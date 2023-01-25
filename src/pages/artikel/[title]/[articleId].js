/**
 * @file
 * This is the article page
 *
 * Next.js page docs are found here
 * https://nextjs.org/docs/basic-features/pages
 *
 * Note that dynamic routing (file based) is used on this page.
 * https://nextjs.org/docs/routing/dynamic-routes
 *
 * Path parameters on this page:
 *  - title: title of the article
 *  - workId: The work id we use when fetching data
 *
 */

import { useRouter } from "next/router";
import { fetchAll } from "@/lib/api/apiServerOnly";
import { article } from "@/lib/api/article.fragments";

import Page from "@/components/article/page";
import ArticleHeader from "@/components/article/page/Header";
import Header from "@/components/header/Header";
import React from "react";
import { getLanguage } from "@/components/base/translate/Translate";

/**
 * Renders the WorkPage component
 */
export default function ArticlePage() {
  const router = useRouter();
  const { articleId } = router.query;

  /**
   * Updates the query params in the url
   * (f.x. query.type which changes the type of material selected: Book, Ebook, ...)
   *
   * @param {obj} query
   */

  return (
    <React.Fragment>
      <Header router={router} />
      <ArticleHeader articleId={articleId} />
      <Page articleId={articleId} />
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
const serverQueries = [article];

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
ArticlePage.getInitialProps = async (ctx) => {
  const articleId = ctx?.query?.articleId;
  const language = getLanguage();
  return await fetchAll(serverQueries, ctx, { articleId, language });
};
