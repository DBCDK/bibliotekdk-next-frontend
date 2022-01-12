/**
 * @file
 * Three articles in a row template
 */

import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

import ArticlePreview from "@/components/article/preview";

import styles from "./Triple.module.css";

/**
 * A section displaying three articles
 *
 * @param {obj} props
 * @param {obj} props.article
 * @param {boolean} props.skeleton
 *
 */
export default function Triple({ articles, skeleton }) {
  if (articles.length < 1) {
    return null;
    //return "Less than 3 articles found";
  }

  return (
    <Row>
      {articles.map((article, index) => (
        <Col xs={12} md={4} key={`${article.title}_${index}`}>
          <ArticlePreview article={article} skeleton={skeleton} />
        </Col>
      ))}
    </Row>
  );
}
Triple.propTypes = {
  article: PropTypes.object,
  skeleton: PropTypes.bool,
};
