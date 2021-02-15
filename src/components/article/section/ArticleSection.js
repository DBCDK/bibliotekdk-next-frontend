import { useMemo } from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/sortBy";

import { promotedArticles } from "@/lib/api/article.fragments";
import { useData } from "@/lib/api/api";
import { Col, Row } from "react-bootstrap";
import styles from "./ArticleSection.module.css";
import Section from "@/components/base/section";
import ArticlePreview from "@/components/article/preview";

/**
 * Will remove articles that does not have fieldTag
 * matching matchTag
 *
 * Sort remaining articles by the special 'pos' tag
 * @param {array} articles
 * @param {string} matchTag
 *
 * @returns {array}
 */
function parseArticles(articles, matchTag) {
  // Remove articles that don't match the section tag
  let processedArticles = articles.filter(
    (article) =>
      article.fieldArticleSection && article.fieldArticleSection === matchTag
  );
  // Extract the position tag to use as sort key
  processedArticles.forEach((article) => {
    article.sort = article.fieldArticlePosition;
  });

  // Sort articles
  processedArticles = sortBy(processedArticles, "sort");

  return processedArticles;
}

/**
 * A section displaying three articles
 *
 * @param {object} props
 * @param {string} props.title
 * @param {array} props.articles
 * @param {boolean} props.skeleton
 * @param {string} props.matchTag
 *
 */
export function ArticleSection({ title, articles, skeleton, matchTag }) {
  // We are filtering and sorting, hence we make us of useMemo
  articles = useMemo(() => {
    if (!articles) {
      // Create skeleton articles
      return Array(3).fill({});
    } else {
      return parseArticles(articles, matchTag);
    }
  }, [articles]);

  return (
    <Section title={title} className={styles.section}>
      <Row>
        {articles.map((article, index) => (
          <Col xs={12} md={4} key={`${article.title}_${index}`}>
            <ArticlePreview article={article} skeleton={skeleton} />
          </Col>
        ))}
      </Row>
    </Section>
  );
}
ArticleSection.propTypes = {
  title: PropTypes.string,
  articles: PropTypes.array,
  skeleton: PropTypes.bool,
  matchTag: PropTypes.string,
};

export default function Wrapper(props) {
  const { isLoading, data } = useData(promotedArticles());
  const articles =
    data &&
    data.nodeQuery &&
    data.nodeQuery.entities &&
    data.nodeQuery.entities.filter(
      (article) => article && article.__typename === "NodeArticle"
    );

  return <ArticleSection {...props} articles={articles} skeleton={isLoading} />;
}
Wrapper.propTypes = {
  title: PropTypes.string,
  matchTag: PropTypes.string,
};
