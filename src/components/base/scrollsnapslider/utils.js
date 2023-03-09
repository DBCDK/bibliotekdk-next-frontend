export function scrollToElement(sliderElementId) {
  document.querySelector(`#${sliderElementId}`).scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}

export function scrollDistance(sliderId, slideTranslation) {
  document.querySelector(`#${sliderId}`).scrollBy({
    left: slideTranslation,
    top: 0,
    behavior: "smooth",
  });
}

export function getScrollToNextCoveredChild(
  orientation = "left",
  childScroll,
  containerScroll
) {
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
    xGap: getGaps(target.childNodes).xGap,
    yGap: getGaps(target.childNodes).yGap,
  };
}

export function childSetter(childNodes) {
  const childWidths = [];
  // Everything is slightly offset. I noticed 15px at one point
  // TODO: Please fix this if you know how to
  const offset = childNodes?.[0]?.clientLeft;

  childNodes.forEach((child) =>
    childWidths.push({
      width: child.offsetWidth,
      posLeft: child.offsetLeft - offset,
      posRight: child.offsetLeft + child.offsetWidth - offset,
    })
  );
  return childWidths;
}
