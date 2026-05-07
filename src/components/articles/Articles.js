import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";

import { sortArticles } from "./utils";

import { useData } from "@/lib/api/api";
import useBreakpoint from "@/components/hooks/useBreakpoint";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ArticlePreview from "@/components/article/preview";
import Pagination from "@/components/search/pagination/Pagination";

import { allArticles, getArticles } from "@/lib/api/article.fragments";
import { getLocale } from "@/components/base/translate/Translate";

import styles from "./Articles.module.css";

const ARTICLES_PER_PAGE = 12;
const SKELETON_ARTICLES = Array.from({ length: 6 }, (_, index) => ({
  documentId: `article-skeleton-${index}`,
  title: "...",
  fieldRubrik: "...",
  entityCreated: index,
}));

/**
 * The Article page React component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export function Articles({ articles = [], skeleton }) {
  const articlesRef = useRef(null);
  const breakpoint = useBreakpoint();
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = ["xs", "sm", "md"].includes(breakpoint);

  const sortedArticles = useMemo(() => sortArticles(articles), [articles]);
  const numPages = Math.ceil(sortedArticles.length / ARTICLES_PER_PAGE);

  useEffect(() => {
    if (currentPage > numPages) {
      setCurrentPage(numPages || 1);
    }
  }, [currentPage, numPages]);

  const visibleArticles = useMemo(() => {
    if (skeleton) {
      return sortedArticles;
    }

    const startIndex = isMobile ? 0 : (currentPage - 1) * ARTICLES_PER_PAGE;
    const endIndex = currentPage * ARTICLES_PER_PAGE;

    return sortedArticles.slice(startIndex, endIndex);
  }, [currentPage, isMobile, skeleton, sortedArticles]);

  function onPageChange(page, scroll) {
    setCurrentPage(page);

    if (scroll) {
      articlesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      <Row ref={articlesRef}>
        {visibleArticles.map((article, index) => (
          <Col
            xs={12}
            md={4}
            key={
              article.documentId || article.nid || `${article.title}_${index}`
            }
          >
            <div className={styles.bottomspacing}>
              <ArticlePreview article={article} skeleton={skeleton} />
            </div>
          </Col>
        ))}
      </Row>
      {!skeleton && numPages > 1 && (
        <Pagination
          className={styles.pagination}
          currentPage={currentPage}
          numPages={numPages}
          onChange={onPageChange}
        />
      )}
    </>
  );
}
Articles.propTypes = {
  articles: PropTypes.array,
  skeleton: PropTypes.bool,
};

export default function Wrap(props) {
  const locale = getLocale();
  const { isLoading, data } = useData(allArticles({ locale }));
  const articles = isLoading ? SKELETON_ARTICLES : getArticles(data);

  return <Articles {...props} articles={articles} skeleton={isLoading} />;
}
