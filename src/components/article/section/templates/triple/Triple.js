import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ArticlePreview from "@/components/article/preview";
import styles from "./Triple.module.css";

/**
 * @file
 * Three articles in a row template
 */

/**
 * A section displaying three articles
 *
 * @param  {Object} articles
 * @param {boolean} skeleton
 *
 */
export default function Triple({ articles, skeleton }) {
  return (
    <Row className={styles.container}>
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
