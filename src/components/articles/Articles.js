import PropTypes from "prop-types";
import { useMemo } from "react";

import { sortArticles } from "./utils";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ArticlePreview from "@/components/article/preview";

import { getLanguage } from "@/components/base/translate/Translate";
import { getAllArticles } from "@/local-data/cms/resolvers";

import styles from "./Articles.module.css";

/**
 * The Article page React component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export function Articles({ articles, skeleton }) {
  articles = useMemo(() => sortArticles(articles), [articles]);

  return (
    <Row>
      {articles.map((article, index) => (
        <Col xs={12} md={4} key={`${article.title}_${index}`}>
          <div className={styles.bottomspacing}>
            <ArticlePreview article={article} skeleton={skeleton} />
          </div>
        </Col>
      ))}
    </Row>
  );
}
Articles.propTypes = {
  articles: PropTypes.array,
  skeleton: PropTypes.bool,
};

export default function Wrap(props) {
  const articles = getAllArticles(getLanguage()).filter(
    (article) => article && article.__typename === "NodeArticle"
  );

  return <Articles {...props} articles={articles} skeleton={false} />;
}
