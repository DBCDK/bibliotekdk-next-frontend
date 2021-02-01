import PropTypes from "prop-types";

import { useState, useEffect, createContext, useContext } from "react";

// Translation data obj - used as default and to get translations from backend
import translation from "./Translate.json";
export let lang = "da";
export let contexts = {};
/**
 * Set locale for the translate component
 *
 * @param {string} locale Either da or en
 */
export function setLocale(locale = "da") {
  lang = locale;
}

let which;

/**
 * Set translations - they are fetched serverside
 * this function is imported in _app.js
 * @see _app.js::setTranslations
 *
 * @param translations
 *  translations from backend
 * @return
 *  obj | false
 */
export function setTranslations(translations) {
  // we use the file (Translate.json) as default if
  // translations fail to get -> translations are set to false. (@see _app.js::getInitialProps)
  if (translations === false) {
    // get it from file
    contexts = translation.contexts;
  } else {
    // set it from backend
    contexts = translations.translations.contexts;
  }
}

/**
 * 
 * Documentaion:
 * 
 * Props of the translate component
 * 
 * @param {string} props.context
 *  Context prop could be the name of the main component (Module), where the translate function is called. 
 *  
 * Examples: 
 *  "WorkSlider"
 *  "Footer"
 *  "Header"
 * 
 * @param {string} props.label
 *  Label should be the name of the translated text. Label should be uniqu name inside of the context.
 * 
 * Examples: 
 *  "submitButton"
 *  "submitHelpText"
 *  "contactName"
 *  "contactEmail"
 * 
 * @param {array} props.vars
 * Vars is a list of variabels, used to make the translated text more dynamic. 
 * Variabels in the translated text (%s) will get replaced (in the given order).
 * Also functions/Translate functions can be passed as a variable
 * 
 * Examples:
 *  [5] => "In cart: %s" = "In cart: 5"
 *  [3, books] => "Order %s %s" = "Order 3 books"
 * 
 * @param {bool} props.renderAsHtml
 * The translated json text can be rendered as html. 
 * Html tags can be set in the json translations, 
 * but also passed as variabels. 
 * 
 * Exampels: 
 *  [1] => "Order <strong>%s<strong> book" = "Order <strong>1<strong> book"
 *  [<span>3</span>] => Order %s books = "Order <span>3<span> books"
 * 
 * 
 * 
 * Use of the translate component
 * 
 * Examples:
 *
 * The componentWay:
 * <Translate context="" label="" vars={[x,y,..]}/>
 *
 * The functionWay:
 * Translate({context: '', label: '', vars: [x,y,..]});
 *
 * The function-in-component way:
 * <Translate
   context=''
   label=''
   vars={[x, y, Translate({context: '', label: ''})]}
 />

 /**
 * The Component function
 *
 * @param {obj} props
 * @param {string} props.context
 * @param {string} props.label
 * @param {array} props.vars
 * @param {bool} props.renderAsHtml
 * See propTypes for specific props and types
 *
 * @returns {string}
 *
 */
function Translate({ context, label, vars = [], renderAsHtml = false }) {
  // Check if requested text exist, return error message instead, if not
  if (!contexts[context]) {
    return `[! unknown context: ${context}]`;
  }
  if (!contexts[context][label]) {
    return `[! unknown label: ${label} in context: ${context}]`;
  }
  if (!contexts[context][label][lang]) {
    return `[! unknown language: ${lang} in label: ${label}]`;
  }

  // Requested text
  const text = contexts[context][label][lang];

  // Result
  let result = text;

  /*
   * If requested text contains variables (%s)
   * %s will be replaced by variables from the
   * vars array
   */

  if (text.includes("%s")) {
    const aText = text.split("%s");

    if (aText.length - 1 !== vars.length) {
      return `{! vars does not match %s in label: ${label}}`;
    }

    let str = "";
    for (var i = 0; i < aText.length; i++) {
      str += aText[i] || "";
      str += vars[i] || "";
    }
    result = str;
  }

  // Render Html in text
  if (renderAsHtml) {
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  }

  return result;
}

// PropTypes for component
Translate.propTypes = {
  context: PropTypes.string,
  label: PropTypes.string,
  vars: PropTypes.array,
  renderAsHtml: PropTypes.bool,
};

export default Translate;
