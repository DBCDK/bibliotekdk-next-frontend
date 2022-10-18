import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import ArticlePreview from "@/components/article/preview";

/**
 * @file
 * Three articles in a row template
 */

/**
 * A section displaying three articles
 *
 * @param {obj} articles
 * @param {boolean} skeleton
 *
 */
export default function Triple({ articles, skeleton }) {
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
