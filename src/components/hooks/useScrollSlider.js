import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useScrollRestorationForElement from "@/components/hooks/useScrollRestorationForElement";

function useScrollSlider({
  sliderId = "slide",
  parentRef: parentRef,
  disableScrollRestoration = false,
}) {
  const [index, setIndex] = useState(0);
  const [visibleElement, setVisibleElement] = useState(0);
  const router = useRouter();

  useScrollRestorationForElement(
    router,
    sliderId,
    parentRef,
    disableScrollRestoration
  );

  useEffect(() => {
    if (visibleElement !== index) {
      setIndex(visibleElement);
    }
  }, [visibleElement]);

  function sliderElementId(idx, sliderId) {
    return `${sliderId}-${idx}`;
  }

  return {
    index: index,
    visibleElement: visibleElement,
    setVisibleElement: setVisibleElement,
    parentRef: parentRef,
    sliderElementId: (idx) => sliderElementId(idx, sliderId),
  };
}

export default useScrollSlider;
