import PropTypes from "prop-types";
import { useMemo } from "react";
import get from "lodash/get";

import { sortArticles } from "./utils";

import { useData } from "@/lib/api/api";

import { Col, Row } from "react-bootstrap";
import ArticlePreview from "@/components/article/preview";

import { allArticles } from "@/lib/api/article.fragments";

/**
 * The Article page React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Articles({ articles, skeleton }) {
  articles = useMemo(() => sortArticles(articles), [articles]);

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
Articles.propTypes = {
  articles: PropTypes.array,
  skeleton: PropTypes.bool,
};

export default function Wrap(props) {
  const { isLoading, data } = useData(allArticles());
  const articles = get(data, "nodeQuery.entities", []).filter(
    (article) => article && article.__typename === "NodeArticle"
  );

  return <Articles {...props} articles={articles} skeleton={isLoading} />;
}
