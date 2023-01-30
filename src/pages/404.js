// pages/404.js
import React from "react";
import Header from "@/components/header/Header";
import Section from "@/components/base/section";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import { useRouter } from "next/router";

export function Custom() {
  const router = useRouter();

  return (
    <>
      <Header router={router} />
      <Section
        title={Translate({
          context: "errorpages",
          label: "404_not_found_title",
        })}
      >
        <Text type="text3">
          {Translate({
            context: "errorpages",
            label: "404_not_found_description",
          })}
        </Text>
      </Section>
      {/* @TODO add translatable here */}
    </>
  );
}

export default function Custom404() {
  return <Custom />;
}
