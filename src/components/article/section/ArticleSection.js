import { useMemo } from "react";
import PropTypes from "prop-types";
import Section from "@/components/base/section";
import Single from "./templates/single";
import Double from "./templates/double";
import Triple from "./templates/triple";

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

function getSectionArticles(articles, numberOfArticles) {
  if (!articles) {
    // Create skeleton articles
    return Array(numberOfArticles).fill({});
  }

  return articles.filter(Boolean).slice(0, numberOfArticles);
}

/**
 * A section displaying three articles
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {Array} props.articles
 * @param {boolean} props.skeleton
 *
 */
export function ArticleSection({
  title,
  articles,
  skeleton,
  template,
  color = false,
}) {
  const context = getContext(template);

  const numberOfArticles = context.numberOfArticles;
  const Template = context.template;
  const backgroundColor = color || context.background || null;

  const sectionArticles = useMemo(
    () => getSectionArticles(articles, numberOfArticles),
    [articles, numberOfArticles]
  );

  if (sectionArticles.length < 1) {
    // there are no articles prevent mount
    return null;
  }
  return (
    <Section
      title={title}
      backgroundColor={backgroundColor}
      divider={{ content: false }}
    >
      <Template articles={sectionArticles} skeleton={skeleton} />
    </Section>
  );
}

ArticleSection.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  articles: PropTypes.array,
  skeleton: PropTypes.bool,
  template: PropTypes.string,
  color: PropTypes.string,
};

export default ArticleSection;
