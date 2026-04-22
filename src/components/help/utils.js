/**
 * Parse helptexts by groups.
 * @param helpTexts
 * @returns {{}}
 *  eg. {Søgning:[{id:"abc123", title:"fisk"}]}
 */
export function helpTextParseMenu(helpTexts) {
  const structuredHelpTexts = {};

  helpTexts.forEach((helptext) => {
    if (helptext) {
      const element = setGroupElement(helptext);
      const group = helptext.group;
      if (!group) return;
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
  // some elements are not in fixed array — merge not included elements
  return { ...sortedHelpText, ...structuredHelpTexts };
}

function sortOrder() {
  return [
    "soegning",
    "bestilling",
    "login",
    "privatlivspolitik",
    "om_bibliotek_dk",
    "Personlige data",
    "profil",
    "Teknik",
    "Mobil version",
    "Tilgængelighed",
  ];
}

/**
 * Defines an element in a help group.
 * @param helptext
 * @returns {{id: string, title: string}}
 */
function setGroupElement(helptext) {
  return {
    id: helptext.documentId,
    title: helptext.title,
  };
}
