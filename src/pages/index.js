/**
 * @file
 * This is the index page of the application
 *
 */

import ArticleSection from "@/components/article/section";
import Hero from "@/components/hero";
import { promotedArticles } from "@/lib/api/article.fragments";
import { fetchAll } from "@/lib/api/apiServerOnly";
import Header from "@/components/header/Header";
import Translate from "@/components/base/translate";
import React from "react";
import { frontpageHero } from "@/lib/api/hero.fragments";
import { InspirationSlider } from "@/components/inspiration";

const Index = () => {
  return (
    <div>
      <Header />
      <Hero />

      <ArticleSection
        title={Translate({ context: "index", label: "section1" })}
        matchTag="section 1"
        template="triple"
      />

      <ArticleSection
        title={Translate({ context: "index", label: "section3" })}
        matchTag="section 3"
        template="double"
      />
      <ArticleSection title={false} matchTag="section 4" template="single" />
      <InspirationSlider
        title={Translate({
          context: "inspiration",
          label: "category-fiction-nyeste",
        })}
        backgroundColor="var(--parchment)"
        filters={[{ category: "fiction", subCategories: ["nyeste"] }]}
      />
      <InspirationSlider
        title={Translate({
          context: "inspiration",
          label: "category-nonfiction-nyeste",
        })}
        divider={{ content: false }}
        filters={[{ category: "nonfiction", subCategories: ["nyeste"] }]}
      />
    </div>
  );
};

/**
 * These queries are run on the server.
 * I.e. the data fetched will be used for server side rendering
 */
const serverQueries = [promotedArticles, frontpageHero];

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
Index.getInitialProps = async (ctx) => {
  return await fetchAll(serverQueries, ctx);
};

export default Index;
