// pages/404.js
import Header from "@/components/header/Header";
import { useRouter } from "next/router";
import React from "react";
import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";

export default function Custom404() {
  const router = useRouter();
  return (
    <>
      <Header router={router} />
      <Section title={Translate(
        { context: "errorpages", label: "404_not_found_title" })}>
        <Text
          type="text3"
        >
          {Translate(
            { context: "errorpages", label: "404_not_found_description" })}
        </Text>
      </Section>
      {/* @TODO add translatable here */}

    </>
  );
}
