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
  return (
    <Text type="text2">
      <span
        className={`${styles.body} ${className}`}
        dangerouslySetInnerHTML={{ __html: parsedBody }}
      />
    </Text>
  );
}
BodyParser.propTypes = {
  body: PropTypes.string,
  skeleton: PropTypes.bool,
  lines: PropTypes.number,
};
