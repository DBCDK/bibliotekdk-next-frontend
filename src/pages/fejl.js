// pages/fejl.js
import React from "react";
import Head from "next/head";
import Section from "@/components/base/section";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";

export default function ErrorPage({ statusCode }) {
  return (
    <>
      <Head>
        <title>
          {Translate({
            context: "errorpages",
            label: "general_error_title",
          })}
        </title>
      </Head>

      <Section
        title={Translate({
          context: "errorpages",
          label: "general_error_title",
        })}
      >
        <Text type="text3">
          {Translate({
            context: "errorpages",
            label: "general_error_description",
          })}{" "}
          <Link href="/">{Translate({ context: "general", label: "back" })}.</Link>
        </Text>

        {statusCode ? (
          <Text type="text4" style={{ marginTop: 16 }}>
            {`(${statusCode})`}
          </Text>
        ) : null}
      </Section>
    </>
  );
}

