/**
 * @file
 * A section with two articles - we have some duplicate code here - @see
 * ArticleSection.js - but this component varies enough to justify its own
 * component.
 */

import { parseArticles } from "../section/ArticleSection";
import { getArticleData } from "../section/ArticleSection";
import Section from "@/components/base/section";
import { Col, Row } from "react-bootstrap";
import ArticlePreview from "@/components/article/preview";
import PropTypes from "prop-types";
import styles from "./ArticleSectionTwoRows.module.css";

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
export function ArticleSectionTwoRows({ title, articles, skeleton, matchTag }) {
  articles = parseArticles(articles, matchTag, 2);
  return (
    <Section title={title} className={styles.sectioncontainer}>
      <Row className={styles.sectionrow}>
        {articles.map((article, index) => (
          <Col key={`${article.title}_${index}`} className={styles.sectioncol}>
            <ArticlePreview article={article} skeleton={skeleton} />
          </Col>
        ))}
      </Row>
    </Section>
  );
}
ArticleSectionTwoRows.propTypes = {
  title: PropTypes.string,
  articles: PropTypes.array,
  skeleton: PropTypes.bool,
  matchTag: PropTypes.string,
};

export default function Wrapper(props) {
  const { articles, isLoading, data } = getArticleData();
  return (
    <ArticleSectionTwoRows
      {...props}
      articles={articles}
      skeleton={isLoading}
    />
  );
}
Wrapper.propTypes = {
  title: PropTypes.string,
  matchTag: PropTypes.string,
};
