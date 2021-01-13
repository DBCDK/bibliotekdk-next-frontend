/**
 * @file The header section of the work page
 *
 * We embed a JSON-LD representation of the work
 * - https://developers.google.com/search/docs/data-types/book
 * - https://solsort.dk/dkabm-til-schema.org
 *
 * And we embed Open Graph as RDFa
 */
import PropTypes from "prop-types";
import Head from "next/head";

/**
 * The article page Header React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Header({ articleId }) {
  return (
    <Head>
      <title>{`Some article`}</title>
    </Head>
  );
}

Header.propTypes = {
  articleId: PropTypes.string,
};
