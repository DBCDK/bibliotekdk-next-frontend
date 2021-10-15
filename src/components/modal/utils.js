/**
 * Function to trap Tab inside modal
 *
 * @param {obj} event current target element (focused element)
 * @param {obj} container container to trap Tab in (modal)
 *
 * https://medium.com/@islam.sayed8/trap-focus-inside-a-modal-aa5230326c1b
 * https://medium.com/@seif_ghezala/how-to-create-an-accessible-react-modal-5b87e6a27503
 */
export function handleTab(event, container) {
  event.preventDefault();

  const el = container.querySelector("div.modal_page.page-current");

  // elements we want
  const elements = [
    "a",
    "input:not([type='hidden'])",
    "button",
    "textarea",
    "[tabindex]",
  ];

  // Custom select string to tail after each element in list
  // Dont select elements with display:none inline style
  // Dont select hidden elements
  // Dont select elements with tabindex -1
  const select =
    ":not([aria-hidden='true']):not([tabindex='-1']):not([style*='display:none']):not([style*='display: none'])";

  const query = elements.join(select + ", ") + select;

  // // Search container for elements (tabindex prop)
  const _sequence = Object.values(el.querySelectorAll(query));

  // Remove all elements which is display:none in computedStyles (css stylesheet)
  // OBS! Performance Warning! getComputedStyle func can be slow
  const sequence = _sequence.filter(
    (el) => getComputedStyle(el).display !== "none"
  );

  // Debug -> remove me in future
  console.log("Debug", { sequence });

  if (sequence.length < 1) {
    return;
  }

  const backward = event.shiftKey;
  const first = sequence[0];
  const last = sequence[sequence.length - 1];

  // wrap around first to last, last to first
  const source = backward ? first : last;
  const target = backward ? last : first;

  if (source === event.target) {
    target.focus();
    return;
  }

  // find current position in tabsequence
  let currentIndex;
  const found = sequence.some(function (element, index) {
    if (element !== event.target) {
      return false;
    }

    currentIndex = index;
    return true;
  });

  if (!found) {
    // redirect to first as we're not in our tabsequence
    first.focus();
    return;
  }

  // shift focus to previous/next element in the sequence
  const offset = backward ? -1 : 1;
  sequence[currentIndex + offset].focus();
}

/**
 * Function to get random color by random string
 *
 *  @param {string} id
 *  @param {array} colors
 */
export function toColor(
  id,
  colors = ["#ffe7e0", "#e5c7bd", "#f4efdd", "#eed9b0", "#b7dee2"]
) {
  let hash = 0;
  if (id.length === 0) {
    return hash;
  }
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = ((hash % colors.length) + colors.length) % colors.length;
  return colors[hash];
}
