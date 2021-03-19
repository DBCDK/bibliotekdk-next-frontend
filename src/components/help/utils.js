/**
 * Parse helptexts by groups
 * @param helpTexts
 * @return {{}}
 *  eg. {Søgning:[{id:25, title:fisk}. {id:1,title:hest}]}
 */
export function helpTextParseMenu(helpTexts) {
  // sort helptexts by group
  const structuredHelpTexts = {};
  let element = {};
  let group;

  helpTexts.forEach((helptext, idx) => {
    element = setGroupElement(helptext);
    group = helptext.fieldHelpTextGroup;
    if (structuredHelpTexts[group]) {
      structuredHelpTexts[group].push(element);
    } else {
      structuredHelpTexts[group] = [element];
    }
  });
  return structuredHelpTexts;
}

/**
 * Defines an element in a help group
 * @param heltptext
 * @return {{id: (number|string|*), title}}
 */
function setGroupElement(heltptext) {
  return {
    id: heltptext.nid,
    title: heltptext.title,
  };
}
