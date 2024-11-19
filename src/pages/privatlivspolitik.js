/**
 * @file this is the page for privacy policy
 */
import Head from "next/head";

import Header from "@/components/header/Header";
import Section from "@/components/base/section";
import BodyParser from "@/components/base/bodyparser";
import Translate from "@/components/base/translate";

const Privatlivspolitik = () => {
  return (
    <>
      <Header />
      <main>
        <Head />
        <Section
          space={{ top: 100, bottom: 100 }}
          title={<span />}
          divider={false}
        >
          <BodyParser
            body={Translate({ context: "helptexts", label: "privacypolicy" })}
          />
        </Section>
      </main>
    </>
  );
};

export default Privatlivspolitik;
