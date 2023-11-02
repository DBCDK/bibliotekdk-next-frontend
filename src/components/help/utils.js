/**
 * Parse helptexts by groups
 * @param helpTexts
 * @returns {{}}
 *  eg. {Søgning:[{id:25, title:fisk}. {id:1,title:hest}]}
 */
export function helpTextParseMenu(helpTexts) {
  // sort helptexts by group
  const structuredHelpTexts = {};
  let element = {};
  let group;

  helpTexts.forEach((helptext) => {
    if (helptext) {
      element = setGroupElement(helptext);
      group = helptext.fieldHelpTextGroup;
      if (structuredHelpTexts[group]) {
        structuredHelpTexts[group].push(element);
      } else {
        structuredHelpTexts[group] = [element];
      }
    }
  });

  // order by fixed array
  const sortedHelpText = {};
  for (let index = 0; index < sortOrder().length; index++) {
    if (structuredHelpTexts[sortOrder()[index]]) {
      sortedHelpText[sortOrder()[index]] =
        structuredHelpTexts[sortOrder()[index]];
    }
  }
  // some elements are not in fixed array - eg if a new is added in backend
  // merge not included elements
  return { ...sortedHelpText, ...structuredHelpTexts };
}

function sortOrder() {
  return [
    "Søgning",
    "Bestilling",
    "Login",
    "Privatlivspolitik",
    "Om bibliotek.dk",
    "Personlige data",
    "Profil",
    "Teknik",
    "Mobil version",
    "Tilgængelighed",
  ];
}

/**
 * Defines an element in a help group
 * @param heltptext
 * @returns {{id: (number|string|*), title}}
 */
function setGroupElement(heltptext) {
  return {
    id: heltptext.nid,
    title: heltptext.title,
  };
}
