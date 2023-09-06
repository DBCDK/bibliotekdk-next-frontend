import React from "react";
import PropTypes from "prop-types";
import Router from "next/router";

/**
 * Language change wrap
 *
 * @param  {Object} props
 * @param  {Object} props.children button to change language
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

    const copy = { ...query };

    // remove modal key from query
    // this will close the modal after language change
    delete copy.modal;

    Router.push({ pathname, query: copy }, null, { locale });
  };

  // Return the new copy of children including the new onClick
  return React.cloneElement(children, { onClick: handleClick });
}

Language.propTypes = {
  children: PropTypes.object,
};
