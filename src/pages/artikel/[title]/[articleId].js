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

import Page from "@/components/article/page";
import ArticleHeader from "@/components/article/page/Header";
import Header from "@/components/header/Header";
import React from "react";

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
   * @param {Object} query
   */

  return (
    <React.Fragment>
      <Header router={router} />
      <ArticleHeader articleId={articleId} />
      <Page articleId={articleId} />
    </React.Fragment>
  );
}
