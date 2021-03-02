/**
 * @file
 * Two articles in a row template
 */

import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

import ArticlePreview from "@/components/article/preview";

import styles from "./Single.module.css";

/**
 * A section displaying three articles
 *
 * @param {array} props.articles
 * @param {boolean} props.skeleton
 *
 */
export default function Single({ articles, skeleton }) {
  const article = articles[0];

  if (!articles[0]) {
    return "No articles found";
  }

  return (
    <Row className={styles.wrap}>
      <Col className={styles.article}>
        <ArticlePreview article={article} skeleton={skeleton} rubrik={false} />
      </Col>
    </Row>
  );
}

Single.propTypes = {
  articles: PropTypes.array,
  skeleton: PropTypes.bool,
};
