// pages/404.js
import { StaticHeader } from "@/components/header/Header";
import React from "react";
import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";

export function Custom() {
  return (
    <>
      <StaticHeader replace={true} />
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
