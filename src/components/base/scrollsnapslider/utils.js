import range from "lodash/range";

export function scrollToElement(sliderElementId) {
  document.querySelector(`#${CSS.escape(sliderElementId)}`).scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}

export function getElementById(elementId) {
  return elementId && document.querySelector(`#${elementId}`);
}

export function scrollToElementWithOffset(
  sliderElementId,
  orientation = "y",
  offset = -64 // --pt8 fra spacing.css
) {
  const element = getElementById(sliderElementId);

  if (!element) {
    return;
  }
  const elementPosition =
    orientation === "x" ? element.offsetLeft : element.offsetTop;

  window.scrollTo({
    top: elementPosition + offset,
    behavior: "smooth",
  });
}

export function scrollDistance(sliderId, slideTranslation) {
  document.querySelector(`#${CSS.escape(sliderId)}`).scrollBy({
    left: slideTranslation,
    top: 0,
    behavior: "smooth",
  });
}

export function getScrollToNextCoveredChild({
  orientation = "left",
  childScroll,
  containerScroll,
}) {
  const nextCoveredChildLeft = childScroll
    .filter((child) => child.posLeft < containerScroll.x)
    .slice(-2)[0];

  const nextCoveredChildRight = childScroll
    .filter(
      (child) => child.posRight > containerScroll.x + containerScroll.xOffset
    )
    .slice(0)[0];

  const nextCoveredChild =
    orientation === "left" ? nextCoveredChildLeft : nextCoveredChildRight;

  return !nextCoveredChild
    ? false
    : nextCoveredChild.posLeft - (containerScroll.x + containerScroll.xGap / 2);
}

export function getScrollToNextFullWidth({
  orientation = "left",
  containerScroll,
}) {
  const anchorPoints = getAnchors(containerScroll);

  const nextFullWidthLeft = -(
    containerScroll.x -
    anchorPoints.filter((anchor) => anchor < containerScroll.x).at(-1)
  );

  const nextFullWidthRight =
    anchorPoints.filter((anchor) => anchor > containerScroll.x).at(0) -
    containerScroll.x;

  const nextFullWidth =
    orientation === "left" ? nextFullWidthLeft : nextFullWidthRight;

  return !nextFullWidth ? false : nextFullWidth;
}

function getGaps(childNodes) {
  if (childNodes.length < 2) {
    return { xGap: 0, yGap: 0 };
  }

  const xGap = childNodes[1].offsetLeft - childNodes[0].offsetWidth;
  const yGap = childNodes[1].offsetTop - childNodes[0].offsetHeight;

  return { xGap: xGap, yGap: yGap };
}

export function scrollSetter(target) {
  return {
    x: target.scrollLeft,
    y: target.scrollTop,
    xOffset: target.offsetWidth,
    yOffset: target.offsetHeight,
    xScrollable: target.scrollWidth - target.offsetWidth,
    yScrollable: target.scrollHeight - target.offsetHeight,
    xScrollWidth: target.scrollWidth,
    yScrollHeight: target.scrollHeight,
    xClient: target.clientWidth,
    yClient: target.clientHeight,
    xGap: getGaps(target.childNodes).xGap,
    yGap: getGaps(target.childNodes).yGap,
  };
}

export function childSetter(childNodes, ignoreElements = []) {
  const childWidths = [];
  // Everything is slightly offset. I noticed 15px at one point
  // TODO: Please fix this if you know how to
  const offset = childNodes?.[0]?.offsetLeft;

  childNodes.forEach((child) => {
    if (!ignoreElements.includes(child.localName)) {
      return childWidths.push({
        width: child.offsetWidth,
        posLeft: child.offsetLeft - offset,
        posRight: child.offsetLeft + child.offsetWidth - offset,
      });
    }
  });
  return childWidths;
}

export function getAnchors(containerScroll) {
  const fullPages = Math.floor(
    containerScroll.xScrollWidth / containerScroll.xClient
  );

  const scrollAreas = range(0, fullPages, 0).map(
    (value, index) => containerScroll.xClient * index
  );

  return [...scrollAreas, containerScroll?.xScrollable];
}
