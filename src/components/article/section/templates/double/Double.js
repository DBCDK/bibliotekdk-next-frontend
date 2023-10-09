/**
 * @file
 * Two articles in a row template
 */

import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import ArticlePreview from "@/components/article/preview";

import styles from "./Double.module.css";

/**
 * A section displaying three articles
 *
 * @param {Object} props
 * @param {array} props.articles
 * @param {boolean} props.skeleton
 *
 */
export default function Double({ articles, skeleton }) {
  const skeletonClass = skeleton ? styles.skeleton : "";

  return (
    <Row className={styles.wrap}>
      {articles.map((article, index) => (
        <Col
          key={`${article.title}_${index}`}
          className={`${styles.article} ${skeletonClass}`}
        >
          <ArticlePreview
            article={article}
            skeleton={skeleton}
            rubrik={false}
          />
        </Col>
      ))}
    </Row>
  );
}

Double.propTypes = {
  articles: PropTypes.array,
  skeleton: PropTypes.bool,
};
