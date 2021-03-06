import PropTypes from "prop-types";

import Content from "../content";

/**
 * The Article page React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function ArticlePage({ articleId }) {
  return (
    <main>
      <Content articleId={articleId} />
    </main>
  );
}

ArticlePage.propTypes = {
  Article: PropTypes.string,
};
