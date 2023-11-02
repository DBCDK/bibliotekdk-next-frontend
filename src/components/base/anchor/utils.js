import debounce from "lodash/debounce";

export const PRETTY_OFFSET = 8; // var(--pt1)

/**
 * Get section by id
 *
 * @param {string} id
 * @param {Object} items
 * @param {number} menuT
 * @param {number} height
 *
 * @returns {Object}
 */
export function getSectionById(id, items, menuT, height) {
  // target section
  const section = items[id].current;

  // If section is not mounted or sections does not contain content (book has no description)
  if (!section || section.children.length === 0) {
    return null;
  }

  // Check scroll position for active section
  const clientHeight = section.clientHeight;
  const offsetTop = section.offsetTop;

  // Set offset according to menu is above or underneath section
  const offset = offsetTop + clientHeight > menuT ? height : 0;

  return {
    id,
    element: section,
    clientHeight,
    offsetTop,
    offset,
  };
}

/**
 * Get id of the active section (visible in users viewport)
 *
 * @param {Object} items
 * @param {number} scrollY
 * @param {number} menuT
 * @param {number} height
 *
 * @returns {string|null}
 */
export function getActiveElement(items, scrollY, menuT, height) {
  if (!items) {
    return null;
  }

  let activeId = null;
  Object.keys(items).forEach((id) => {
    const section = getSectionById(id, items, menuT, height);

    if (!section) {
      return null;
    }

    // Active section calculation
    const active =
      scrollY + section.offset >= section.offsetTop - PRETTY_OFFSET &&
      scrollY + section.offset < section.offsetTop + section.clientHeight;

    if (active) {
      activeId = id;
    }
  });

  return activeId;
}

/**
 * Handle scrolling and activate callback when scroll is finished
 *
 * @param {Object} container
 * @param {Object} section
 * @param {number} offset
 * @param {function} callback
 */
export function handleScroll(container, section, offset = 0, callback = null) {
  // Scroll to element position
  const distance = section.offsetTop - offset;

  // Callback trigger on scroll finish
  let isScrolling;

  const onScroll = function () {
    window.clearTimeout(isScrolling);

    isScrolling = setTimeout(function () {
      container.removeEventListener("scroll", onScroll);
      callback && callback();
    }, 66);
  };

  container.addEventListener("scroll", onScroll, false);

  container.scrollTo({
    top: distance,
    left: 0,
    behavior: "smooth",
  });
}

/**
 * Align active menu item to the left on active change
 *
 * @param {Object} container
 * @param {Object} item
 *
 * @param {number} offset
 * @param {function|null=} callback
 * @returns {MutableRefObject<null>}
 */
function debouncedAlignMenuItem(container, item, offset = 0, callback = null) {
  // Check that menu wrap exist
  if (!container.current) {
    return null;
  }

  // If item exist
  if (!item.current) {
    return null;
  }

  container = container.current;

  // Scroll to element position
  const distance = item.current.offsetLeft - offset;

  // Callback trigger on scroll finish
  const onScroll = function () {
    const scrollWidth = container.scrollWidth;
    const scrollLeft = container.scrollLeft;
    const offsetWidth = container.offsetWidth;

    // When distance is reached OR if no scroll is needed
    if (scrollLeft === distance || scrollWidth - scrollLeft <= offsetWidth) {
      container.removeEventListener("scroll", onScroll);
      callback && callback();
    }
  };
  container.addEventListener("scroll", onScroll);
  onScroll();
  // ---

  container.scrollTo({
    top: 0,
    left: distance,
    behavior: "smooth",
  });
}

// debounce wrapped
/**
 * @type {DebouncedFuncLeading<(function(MutableRefObject<null>, component, number=, null=): React.MutableRefObject<null>)|*> | DebouncedFunc<(function(component, component, int=, null=): React.MutableRefObject<null>)|*>}
 */
export const alignMenuItem = debounce(debouncedAlignMenuItem, 100, {
  leading: true,
  trailing: true,
});
