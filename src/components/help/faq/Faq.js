import PropTypes from "prop-types";
import { useMemo } from "react";

import Accordion from "@/components/base/accordion";

import { sortData } from "./utils";

/**
 * The Article page React component
 *
 * @param {obj} props
 * @param {obj} props.data
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Faq({ data }) {
  data = useMemo(() => sortData(data), [data]);

  return <Accordion data={data} />;
}

Faq.propTypes = {
  data: PropTypes.array,
};

export default function Wrapper(props) {
  const data = [
    {
      title: "Har mit bibliotek bogen?",
      body: {
        value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem. Pellentesque placerat facilisis commodo. Aenean ligula metus, sodales et augue eget, porttitor gravida arcu.",
      },
    },
    {
      title:
        "Hvorfor ser jeg et mindre antal poster end det, der står i antal hits?",
      body: {
        value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor.",
      },
    },
    {
      title: "Hvordan søger jeg specifikt på fx. mp3-lydbøger?",
      body: {
        value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem.",
      },
    },
    {
      title: "Hvordan ser jeg de nyeste resultater først?",
      body: {
        value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor.",
      },
    },
    {
      title: "Hvordan fornyer jeg et lån?",
      body: {
        value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem.",
      },
    },
  ];

  return <Faq data={data} />;
}
