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
import { fetchAll } from "@/lib/api/apiServerOnly";
import { helpText, publishedHelptexts } from "@/lib/api/helptexts.fragments";
import { getStrapiHelpTextRedirect } from "@/lib/legacyUrlRedirect";
import Header from "@/components/help/texts/header";

import Page from "@/components/help/texts/page";
import React, { useEffect } from "react";
import Custom404 from "@/pages/404";

/**
 * Renders the help text component
 */
export default function HelptextPage() {
  const router = useRouter();
  const { helpTextId } = router.query;
  const redirectUrl = getStrapiHelpTextRedirect(helpTextId);

  useEffect(() => {
    if (redirectUrl) {
      router.replace(redirectUrl);
    }
  }, [redirectUrl, router]);

  if (typeof helpTextId === "undefined" || helpTextId === null) {
    return <Custom404 />;
  }

  if (redirectUrl) {
    return null;
  }

  return (
    <React.Fragment>
      <Header helpTextId={helpTextId} />
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
HelptextPage.getInitialProps = async (ctx) => {
  const redirectUrl = getStrapiHelpTextRedirect(ctx.query.helpTextId);
  if (redirectUrl) {
    if (ctx.res) {
      ctx.res.writeHead(301, { Location: redirectUrl });
      ctx.res.end();
    }
    return {};
  }

  return await fetchAll(serverQueries, ctx);
};
