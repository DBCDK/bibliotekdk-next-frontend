import parseArticleBody from "@/components/article/content/utils";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef } from "react";

import Text from "@/components/base/text";

import styles from "./BodyParser.module.css";
import { signIn } from "@dbcdk/login-nextjs/client";

/**
 * BodyParser
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function BodyParser({ body, className, skeleton, lines = 10 }) {
  const parsedBody = useMemo(() => {
    if (body) {
      return parseArticleBody(body);
    }
    return "";
  }, [body]);

  if (skeleton) {
    return <Text type="text2" skeleton={true} lines={lines}></Text>;
  }

  // handle login links (https://login.bib.dk/login) - replace
  // with click event to use login platform
  const articleBody = useRef();

  useEffect(() => {
    // quickfix .. notifications caused this one to fail
    if (!articleBody) {
      return;
    }
    if (!articleBody.current) {
      return;
    }
    // end quickfix

    // get dom element containing login links
    const timer = setTimeout(() => {
      const href = articleBody.current.querySelectorAll(
        "[href='https://login.bib.dk/login']"
      );
      if (href.length > 0) {
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

  return (
    <div
      ref={articleBody}
      className={`${styles.body} ${className}`}
      dangerouslySetInnerHTML={{ __html: parsedBody }}
    />
  );
}

BodyParser.propTypes = {
  body: PropTypes.string,
  skeleton: PropTypes.bool,
  lines: PropTypes.number,
};
