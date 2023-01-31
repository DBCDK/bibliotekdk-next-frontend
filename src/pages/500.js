// pages/500.js
import React from "react";
import Header from "@/components/header/Header";
import Section from "@/components/base/section";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import { useRouter } from "next/router";

export default function Custom500() {
  const router = useRouter();

  return (
    <>
      <Header router={router} />
      <Section
        title={Translate({
          context: "errorpages",
          label: "500_internal_server_error_title",
        })}
      >
        <Text type="text3">
          {Translate({
            context: "errorpages",
            label: "500_internal_server_error_description",
          })}
          <Link
            href={Translate({
              context: "errorpages",
              label: "500_internal_server_error_information_website_url",
            })}
          >
            {Translate({
              context: "errorpages",
              label: "500_internal_server_error_information_website_title",
            })}
            .
          </Link>
        </Text>
      </Section>
      {/* @TODO add translatable here */}
    </>
  );
}
