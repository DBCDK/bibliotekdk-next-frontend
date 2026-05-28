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
import Header from "@/components/help/texts/header";

import Page from "@/components/help/texts/page";
import React from "react";
import Custom404 from "@/pages/404";

/**
 * Renders the help text component
 */
export default function HelptextPage() {
  const router = useRouter();
  const { helpTextId } = router.query;

  if (typeof helpTextId === "undefined" || helpTextId === null) {
    return <Custom404 />;
  }

  return (
    <React.Fragment>
      <Header helpTextId={helpTextId} />
      <Page helpTextId={helpTextId} />
    </React.Fragment>
  );
}
