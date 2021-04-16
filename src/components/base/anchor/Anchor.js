import useMutationObserver from "@rooks/use-mutation-observer";
import { useState, useEffect, useRef, createRef, useMemo } from "react";
import throttle from "lodash/throttle";
// import useWindowSize from "@/lib/useWindowSize";

import { Container, Row, Col } from "react-bootstrap";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Link from "@/components/base/link";

import { encodeString } from "@/lib/utils";

import {
  getSectionById,
  getActiveElement,
  handleScroll,
  getName,
  alignMenuItem,
} from "./utils";

import styles from "./Anchor.module.css";

let activeItemId = null;

function Menu({ items, onMount }) {
  const [hest, setHest] = useState(activeItemId);

  const [mountedOnClient, setMountedOnClient] = useState(false);

  const refresh = useState()[1];
  // Menu wrapper ref
  const menuWrap = useRef(null);
  // Menu Items ref
  const itemsWrap = useRef(null);
  // menu item container ref
  const itemRefs = useRef({});

  // Handle mounting + clientside render menu
  useEffect(() => {
    onMount(() => refresh({}));
    setMountedOnClient(true);
  }, []);

  // Handles scroll to active menu item
  useEffect(() => {
    if (activeItemId) {
      const item = itemRefs.current[activeItemId];
      alignMenuItem(menuWrap, item, 16, itemsWrap);
    }
  }, [activeItemId]);

  // Prevent render if not on client
  if (!mountedOnClient) {
    return null;
  }

  // window Y distance from top
  const scrollY = window.scrollY;

  // Calc height for placeholder (used by the wrap while menu is fixed)
  const height =
    (menuWrap.current && menuWrap.current.children[0]?.clientHeight) || 0;

  // Menu distance from top
  const menuT = menuWrap.current && menuWrap.current.offsetTop;

  // active menu element
  activeItemId = getActiveElement(items, scrollY, menuT, height);

  if (hest !== activeItemId) {
    setHest(activeItemId);
  }

  // Menu is sticky
  const isSticky = scrollY > menuT;
  const stickyClass = isSticky ? styles.sticky : "";

  return (
    <div className={styles.wrap} ref={menuWrap} style={{ height }}>
      <div className={`${styles.menu} ${stickyClass}`} ref={itemsWrap}>
        <Container fluid>
          <Row>
            <Col xs={12} lg={{ offset: 3 }}>
              {Object.keys(items).map((id) => {
                // target section
                const section = getSectionById(id, items, menuT, height);

                if (!section) {
                  return null;
                }

                // check if element is active
                const active = activeItemId === id;
                const activeClass = active ? styles.active : "";

                // Create menu item ref if not already exist
                itemRefs.current[id] = itemRefs.current[id] ?? createRef();

                // Set item ref
                const itemRef = itemRefs.current[id];

                return (
                  <Link
                    key={`link-${id}`}
                    linkRef={itemRef}
                    // border={{ bottom: { keepVisible: active } }}
                    className={`${styles.item} ${activeClass}`}
                    dataCy="anchor-menu-item"
                    tag="span"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScroll(window, section.element, section.offset);
                      // alignMenuItem(
                      //   menuWrap,
                      //   itemRefs.current[id],
                      //   16,
                      //   itemsWrap
                      // );
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleScroll(window, section.element, section.offset);
                        // alignMenuItem(
                        //   menuWrap,
                        //   itemRefs.current[id],
                        //   16,
                        //   itemsWrap
                        // );
                      }
                    }}
                  >
                    <Text type={"text2"}>{getName(id)}</Text>
                  </Link>
                );
              })}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

function Element({ id, children, sectionRef, onChange }) {
  useMutationObserver(sectionRef, () => onChange(sectionRef));

  return (
    <div id={id} className="anchor-section" ref={sectionRef}>
      {children}
    </div>
  );
}

function Wrap({ children }) {
  // Object to collect all section refs by id
  const menu = useRef();
  const refs = useRef({});
  const [sections, setSections] = useState(refs);

  const onChange = useMemo(
    () => throttle(() => menu.current && menu.current.updateMenu(), 10),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", onChange);
    // cleanup on unMount
    return () => window.removeEventListener("scroll", onChange);
  }, []);

  return children
    .map((child, idx) => {
      if (!child.props["anchor-label"]) {
        // Only allow the component Menu to not have anchor-label
        if (child.type?.name === "Menu") {
          return (
            <Menu
              key="items-menu"
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
        <Element
          key={id}
          id={id}
          sectionRef={sections.current[id]}
          onChange={onChange}
        >
          {child}
        </Element>
      );
    })
    .filter((c) => c);
}

export default { Wrap, Menu, Element };
