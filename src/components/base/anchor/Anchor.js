import { encodeString } from "@/lib/utils";
import { useState, useEffect, useRef, createRef, useMemo } from "react";
import throttle from "lodash/throttle";

// import useWindowSize from "@/lib/useWindowSize";

import useMutationObserver from "@rooks/use-mutation-observer";

import styles from "./Anchor.module.css";

function Menu({ items, onMount }) {
  const refresh = useState()[1];

  // Scroll to ref
  function handleScroll(id) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    items[id].current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  useEffect(() => {
    onMount(() => refresh({}));
  }, []);

  return (
    <div>
      <div className={styles.menu}>
        {Object.keys(items).map((item) => {
          console.log("menu items", items[item]);

          if (items[item].current?.children.length === 0) {
            console.log(item + " is null");
            return null;
          }

          return <span onClick={() => handleScroll(item)}>{item}</span>;
        })}
      </div>
      <div>hest</div>
      <div>hest</div>
      <div>hest</div>
      <div>hest</div>
      <div>hest</div>
    </div>
  );
}

function Element({ children, sectionRef, onChange }) {
  // Copy props
  // let newProps = children.props;

  // Remove anchor related props from children
  //  delete newProps["anchor-label"];

  useMutationObserver(sectionRef, () => onChange(sectionRef));

  return (
    <div className="hest" ref={sectionRef}>
      {children}
    </div>
  );
}

let hest = null;

function Wrap({ children }) {
  // Object to collect all section refs by id
  const menu = useRef();
  const refs = useRef({});
  const [sections, setSections] = useState(refs);

  const onChange = useMemo(
    () => throttle(() => menu.current && menu.current.updateMenu(), 100),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", onChange);
    // clenup on unMount
    return () => window.removeEventListener("scroll", onChange);
  }, []);

  //   const windowSize = useWindowSize();
  //   console.log("Wrap => windowSize", windowSize);

  //   useEffect(() => {
  //     console.log(
  //       "useEffect =>",
  //       sections.current["beskrivelse-3"]?.current?.clientHeight
  //     );
  //     setSections(sections);
  //   }, [sections.current]);

  console.log("render wrap...");

  return children
    .map((child, idx) => {
      if (!child.props["anchor-label"]) {
        // Only allow the component Menu to not have anchor-label
        if (child.type?.name === "Menu") {
          return (
            <Menu
              items={sections.current}
              onMount={(updateMenu) => (menu.current = { updateMenu })}
            />
          );
        }
        return null;
      }

      // create uniq id
      const id = `${encodeString(child.props["anchor-label"])}-${idx}`;

      // Create ref if not already exist
      sections.current[id] = sections.current[id] ?? createRef();

      return (
        <Element key={id} sectionRef={sections.current[id]} onChange={onChange}>
          {child}
        </Element>
      );
    })
    .filter((c) => c);
}

export default { Wrap, Menu, Element };
