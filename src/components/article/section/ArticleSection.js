import { useMemo } from "react";
import PropTypes from "prop-types";
import { promotedArticles } from "@/lib/api/article.fragments";
import { useData } from "@/lib/api/api";
import Section from "@/components/base/section";
import Single from "./templates/single";
import Double from "./templates/double";
import Triple from "./templates/triple";
import { getLanguage } from "@/components/base/translate/Translate";

// TODO (post-CMS migration): when Drupal is fully removed, clean up the following:
// - `matchTag` prop and the tag-based filtering/sorting branch in parseArticles()
//   (fieldArticleSection / fieldArticlePosition) — CMS delivers articles pre-ordered
// - `getArticleData()` and the `Wrap` default export that fetches via promotedArticles()
//   (Drupal nodeQuery) — index.js now passes articles directly from cmsFrontpage()
// - `fieldArticleSection` / `fieldArticlePosition` references in normalizeArticle()
//   in article.fragments.js
// - The `promotedArticles` query in article.fragments.js itself

/**
 * Get context by template name (template settings)
 *
 * @param {string} template template name
 *
 */
function getContext(template) {
  switch (template) {
    case "single":
      return {
        template: Single,
        numberOfArticles: 1,
      };
    case "double":
      return {
        template: Double,
        numberOfArticles: 2,
        background: "var(--jagged-ice)",
      };
    case "triple":
      return { template: Triple, numberOfArticles: 3 };
    default:
      return { template: Single, numberOfArticles: 1 };
  }
}
/**
 * Will remove articles that does not have fieldTag
 * matching matchTag
 *
 * Sort remaining articles by the special 'pos' tag
 * @param {Array} articles
 * @param {string} matchTag
 *  @param {number} numberOfArticles
 *
 * @returns {Array}
 */
function parseArticles(articles, matchTag, numberOfArticles) {
  if (!articles) {
    // Create skeleton articles
    return Array(numberOfArticles).fill({});
  }

  // When no matchTag is given (CMS-driven), articles are already ordered
  if (!matchTag) {
    return articles.filter(Boolean).slice(0, numberOfArticles);
  }

  return articles
    .filter(
      (article) =>
        article &&
        article.fieldArticleSection &&
        article.fieldArticleSection === matchTag
    )
    .sort(function (a, b) {
      return a.fieldArticlePosition - b.fieldArticlePosition;
    })
    .slice(0, numberOfArticles);
}

/**
 * get promoted articles
 *
 * @returns {Array}
 */

function getArticleData(data) {
  return (
    data &&
    data.nodeQuery &&
    data.nodeQuery.entities &&
    data.nodeQuery.entities.filter(
      (article) => article && article.__typename === "NodeArticle"
    )
  );
}

/**
 * A section displaying three articles
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {Array} props.articles
 * @param {boolean} props.skeleton
 * @param {string} props.matchTag
 *
 */
export function ArticleSection({
  title,
  articles,
  skeleton,
  matchTag,
  template,
  color = false,
}) {
  const context = getContext(template);

  const numberOfArticles = context.numberOfArticles;
  const Template = context.template;
  const backgroundColor = color || context.background || null;

  articles = useMemo(
    () => parseArticles(articles, matchTag, numberOfArticles),
    [articles, matchTag, numberOfArticles]
  );

  if (articles.length < 1) {
    // there are no articles prevent mount
    return null;
  }
  return (
    <Section
      title={title}
      backgroundColor={backgroundColor}
      divider={{ content: false }}
    >
      <Template articles={articles} skeleton={skeleton} />
    </Section>
  );
}

ArticleSection.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  articles: PropTypes.array,
  skeleton: PropTypes.bool,
  matchTag: PropTypes.string,
  template: PropTypes.string,
  color: PropTypes.string,
};

export default function Wrap(props) {
  const { data, isLoading } = useData(
    promotedArticles({ language: getLanguage() })
  );

  const articles = getArticleData(data);
  return <ArticleSection {...props} articles={articles} skeleton={isLoading} />;
}

Wrap.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  articles: PropTypes.array,
  skeleton: PropTypes.bool,
  matchTag: PropTypes.string,
  template: PropTypes.string,
};
