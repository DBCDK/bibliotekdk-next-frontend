/**
 * @file
 * This is the index page of the application
 *
 */

import Head from "next/head";

import Hero from "@/components/hero";
import Header from "@/components/header/Header";
import React from "react";

const Index = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Head>
          <meta key="og:type" property="og:type" content="website" />
        </Head>
      </main>
    </>
  );
};

export default Index;
