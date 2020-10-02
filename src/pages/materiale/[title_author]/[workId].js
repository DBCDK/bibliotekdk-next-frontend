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
import { fetchOnServer } from "../../../lib/api";

import Overview from "../../../components/work/overview/";
import Details from "../../../components/work/details/";
import Description from "../../../components/work/description/";
import Content from "../../../components/work/content/";

import Example from "../../../components/work/Example";
import Example2 from "../../../components/work/Example2";

/**
 * Renders the WorkPage component
 */
export default function WorkPage() {
  const router = useRouter();
  const { workId, type } = router.query;

  return (
    <React.Fragment>
      <Overview workId={workId} />
      <Details workId={workId} type={type} />
      <Description workId={workId} type={type} />
      <Content workId={workId} type={type} />
    </React.Fragment>
  );
}

/**
 * Renders example of WorkPage component
 */
export function ExampleWorkPage() {
  const router = useRouter();
  const { workId } = router.query;

  return (
    <div>
      <Example workId={workId} />
      <Example2 workId={workId} />
    </div>
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
const serverQueries = [Example.query, Example2.query];

/**
 * We export getServerSideProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
export const getServerSideProps = fetchOnServer(serverQueries);
