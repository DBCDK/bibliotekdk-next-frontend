/**
 * Get style prop for some dom element
 * @param {object} el dom element
 * @param {string} styleProp the css prop
 */
export function getStyle(el, styleProp) {
  let val;
  if (el.currentStyle) {
    val = el.currentStyle[styleProp];
  } else if (window.getComputedStyle)
    val = document.defaultView
      .getComputedStyle(el, null)
      .getPropertyValue(styleProp);
  return val;
}
