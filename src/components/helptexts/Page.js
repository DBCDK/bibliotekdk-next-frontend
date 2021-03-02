import PropTypes from "prop-types";

import HelpText from "./HelpText";

/**
 * HelpText page React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function HelpTextPage({ helptxtId }) {
  console.log("FISK");
  return <HelpText helpTxtId={helptxtId} />;
}

HelpTextPage.propTypes = {
  helptxtId: PropTypes.string,
};
