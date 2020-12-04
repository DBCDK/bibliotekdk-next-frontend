/**
 * @file
 * This is the index page of the application
 *
 */

import Hero from "@/components/hero";
import Head from "next/head";

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
      </div>
    </React.Fragment>
  );
};

export default Index;
