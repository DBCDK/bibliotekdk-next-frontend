import Soegning from "@/components/helptexts/soegning";
import styles from "@/components/article/content/Content.module.css";
import BodyParser from "@/components/base/bodyparser";
import Head from "next/head";
import { Header } from "@/components/header";
import Section from "@/components/base/section";
import Translate from "@/components/base/translate";

const body = "";

function Soegninghjaelp() {
  // return <Soegning />;
  return (
    <>
      <Header />
      <Head>
        <title key="title">Søgning hjælp</title>
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Søgning hjælp" />
      </Head>
      <Section
        title={<span />}
        backgroundColor={"var(--white)"}
        space={{ top: "var(--pt4)", bottom: "var(--pt4)" }}
      >
        <BodyParser
          body={Translate({ context: "helptexts", label: "soegninghjaelp" })}
        />
      </Section>
    </>
  );
}

export default Soegninghjaelp;
