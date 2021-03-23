import parseArticleBody from "@/components/article/content/utils";
import PropTypes from "prop-types";
import { useMemo } from "react";

import Text from "@/components/base/text";

import styles from "./BodyParser.module.css";

/**
 * BodyParser
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function BodyParser({ body, skeleton, lines = 10 }) {
  const parsedBody = useMemo(() => {
    if (body) {
      return parseArticleBody(body);
    }
    return "";
  }, [body]);

  if (skeleton) {
    return <Text type="text2" skeleton={true} lines={lines}></Text>;
  }
  return (
    <div
      className={styles.body}
      dangerouslySetInnerHTML={{ __html: parsedBody }}
    />
  );
}
BodyParser.propTypes = {
  body: PropTypes.string,
  skeleton: PropTypes.bool,
  lines: PropTypes.number,
};
