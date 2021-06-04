/**
 * @file
 * This is the index page of the application
 *
 */

import ArticleSection from "@/components/article/section";
import Hero from "@/components/hero";
import Head from "next/head";
import { promotedArticles } from "@/lib/api/article.fragments";
import { fetchAll } from "@/lib/api/api";
import Header from "@/components/header/Header";
import Translate from "@/components/base/translate";

import { useRouter } from "next/router";

const Index = () => {
  const context = { context: "metadata" };
  const pageTitle = Translate({ ...context, label: "frontpage-title" });
  const pageDescription = Translate({
    ...context,
    label: "frontpage-description",
  });

  const router = useRouter();

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
        <Header router={router} />
        <Hero />
        <ArticleSection
          title="Bibliotek.dk tilbyder"
          matchTag="section 1"
          template="triple"
        />
        <ArticleSection
          title="Kan vi hjælpe?"
          matchTag="section 2"
          template="triple"
        />
        <ArticleSection
          title="Nyheder"
          matchTag="section 3"
          template="double"
        />
        <ArticleSection title={false} matchTag="section 4" template="single" />
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
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
Index.getInitialProps = (ctx) => {
  return fetchAll(serverQueries, ctx);
};

export default Index;
