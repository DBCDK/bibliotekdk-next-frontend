import animations from "css/animations";

/**
 * Creates a html link with animation classes (underline and hover)
 * @param {String} txt
 * @param {String} url
 * @returns {String} html link as string with animation classes (underline and hover)
 */
export default function buildHtmlLink(txt, url) {
  return `<a href="${url}"} target="_blank" class="${animations.underlineContainer} ${animations.top_line_false} ${animations.top_line_keep_false}">${txt}</a>`;
}
