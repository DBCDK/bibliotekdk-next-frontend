import debounce from "lodash/debounce";

// Get string by id
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

// Scroll to ref on select
export function handleScroll(container, section, offset = 0) {
  // Scroll to element position
  const distance = section.offsetTop;
  container.scrollTo({
    top: distance - offset,
    left: 0,
    behavior: "smooth",
  });
}

// Left align menu items on select
function debouncedAlignMenuItem(container, item, offset = 0, itemsWrap) {
  // Check that menu wrap exist
  if (!container.current) {
    return null;
  }

  // If item exist
  if (!item.current) {
    return null;
  }

  // Scroll to element position
  const distance = item.current.offsetLeft;
  itemsWrap.current.scrollTo({
    top: 0,
    left: distance - offset,
    behavior: "smooth",
  });
}

export const alignMenuItem = debounce(debouncedAlignMenuItem, 100, {
  leading: false,
  trailing: true,
});
