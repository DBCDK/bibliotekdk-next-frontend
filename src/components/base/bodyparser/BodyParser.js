import parseArticleBody from "@/components/article/content/utils";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";

import Text from "@/components/base/text";

import styles from "./BodyParser.module.css";
import animations from "css/animations";
import { signIn } from "@dbcdk/login-nextjs/client";

function underlineOnAnchorElements(htmlString) {
  const ela = document.createElement("div");
  ela.innerHTML = htmlString;

  const aInParsedBodyLength = ela.getElementsByTagName("a").length;

  const animationsStyles = [
    animations.top_line_keep_false,
    animations.top_line_false,
    animations.underlineContainer,
  ].join(" ");

  for (let i = 0; i < aInParsedBodyLength; i++) {
    ela.getElementsByTagName("a").item(i).className += `${animationsStyles}`;
  }
  return ela.innerHTML;
}

/**
 * BodyParser
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function BodyParser({
  body,
  className,
  skeleton,
  lines = 10,
  dataCy = "",
}) {
  const parsedBody = useMemo(() => {
    if (body) {
      return parseArticleBody(body);
    }
    return "";
  }, [body]);

  const [parsedBodyWithUnderlines, setParsedBodyWithUnderlines] =
    useState(null);

  useEffect(() => {
    setParsedBodyWithUnderlines(underlineOnAnchorElements(parsedBody));
  }, [parsedBody]);

  // handle login links (https://login.bib.dk/login) - replace
  // with click event to use login platform
  const articleBody = useRef();

  useEffect(() => {
    // quickfix .. notifications caused this one to fail
    if (!articleBody || !articleBody?.current) {
      return;
    }
    // end quickfix

    // get dom element containing login links
    const timer = setTimeout(() => {
      const href =
        articleBody.current &&
        articleBody.current.querySelectorAll(
          "[href='https://login.bib.dk/login']"
        );
      if (href && href.length > 0) {
        href.forEach((ref) => {
          ref.href = "#";
          ref.addEventListener("click", function (e) {
            e.preventDefault();
            signIn();
          });
        }, 5);
        return () => {
          clearTimeout(timer);
        };
      }
    });
  }, [body]);

  if (skeleton || !parsedBody) {
    return <Text type="text2" skeleton={true} lines={lines}></Text>;
  }

  return (
    <div
      data-cy={dataCy}
      ref={articleBody}
      className={`${styles.body} ${className}`}
      dangerouslySetInnerHTML={{
        __html: parsedBodyWithUnderlines || parsedBody,
      }}
    />
  );
}

BodyParser.propTypes = {
  body: PropTypes.string,
  skeleton: PropTypes.bool,
  lines: PropTypes.number,
};
