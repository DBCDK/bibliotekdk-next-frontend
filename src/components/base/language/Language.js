import React from "react";
import PropTypes from "prop-types";
import Router from "next/router";

/**
 * Language change wrap
 *
 * @param {obj} props
 * @param {obj} props.children button to change language
 *
 * @returns {component}
 */

export default function Language({ children }) {
  // onClick function to pass to children
  const handleClick = function onClick(e) {
    e.preventDefault();
    const locale = Router.locale === "da" ? "en" : "da";
    const pathname = Router.pathname;
    const query = Router.query;

    Router.replace({ pathname, query }, null, { locale });
  };

  // Return the new copy of children including the new onClick
  return React.cloneElement(children, { onClick: handleClick });
}

Language.propTypes = {
  children: PropTypes.object,
};
