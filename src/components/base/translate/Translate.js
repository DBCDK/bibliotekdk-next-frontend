import PropTypes from "prop-types";

// Translation data obj
import translation from "./Translate.json";

export const lang = translation.language;
export const units = translation.units;
export const contexts = translation.contexts;

/**
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
   vars={[x, y, T({context: '', label: ''})]}
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
export default function Translate({
  context,
  label,
  vars = [],
  renderAsHtml = false,
}) {
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
