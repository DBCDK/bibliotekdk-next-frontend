import debounce from "lodash/debounce";

/**
 * Get section by id
 *
 * @param {string} id
 * @param {object} items
 * @param {int} menuT
 * @param {int} height
 *
 * @returns {object}
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
 * @param {object} items
 * @param {string} scrollY
 * @param {int} menuT
 * @param {int} height
 *
 * @returns {string}
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
      scrollY + section.offset >= section.offsetTop &&
      scrollY + section.offset < section.offsetTop + section.clientHeight;

    if (active) {
      activeId = id;
    }
  });

  return activeId;
}

/**
 * Get id of the active section (visible in users viewport)
 *
 * @param {component} container
 * @param {component} section
 * @param {int} offset
 *
 */
export function handleScroll(container, section, offset = 0, callback = null) {
  // Scroll to element position
  const distance = section.offsetTop - offset;

  // Callback trigger on scroll finish
  const onScroll = function () {
    if (container.scrollY === distance) {
      container.removeEventListener("scroll", onScroll);
      callback && callback();
    }
  };

  container.addEventListener("scroll", onScroll);
  onScroll();
  //  ---

  container.scrollTo({
    top: distance,
    left: 0,
    behavior: "smooth",
  });
}

/**
 * Align active menu item to the left on active change
 *
 * @param {component} container
 * @param {component} item
 *
 * @param {int} offset
 *
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
export const alignMenuItem = debounce(debouncedAlignMenuItem, 100, {
  leading: true,
  trailing: true,
});
