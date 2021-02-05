/**
 * @file
 * This is the index page of the application
 *
 */

import ArticleSection from "@/components/article/section";
import Hero from "@/components/hero";
import Head from "next/head";
import { promotedArticles } from "@/lib/api/article.fragments";
import { fetchOnServer } from "@/lib/api/api";
import Notifications from "@/components/base/notifications/Notifications";

const Index = () => {
  const pageTitle = "Søg, find og lån fra alle Danmarks biblioteker";
  const pageDescription =
    "bibliotek.dk er din indgang til bibliotekernes fysiske og digitale materialer.";
  return (
    <React.Fragment>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription}></meta>
        <meta property="og:url" content="https://beta.bibliotek.dk/find" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
        <meta property="og:url" content="https://beta.bibliotek.dk/find" />
      </Head>
      <div>
        <Hero />
        <ArticleSection
          title="Bibliotek.dk tilbyder"
          matchTag="section-offerings"
        />
        <ArticleSection title="Kan vi hjælpe?" matchTag="section-help" />
      </div>
    </React.Fragment>
  );
};

/**
 * These queries are run on the server.
 * I.e. the data fetched will be used for server side rendering
 */
const serverQueries = [promotedArticles];

/**
 * We export getServerSideProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
export const getServerSideProps = fetchOnServer(serverQueries);

export default Index;
