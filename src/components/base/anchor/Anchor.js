import useMutationObserver from "@rooks/use-mutation-observer";
import { useState, useEffect, useRef, createRef, useMemo } from "react";
import PropTypes from "prop-types";
import throttle from "lodash/throttle";

import { Container, Row, Col } from "react-bootstrap";
import Text from "@/components/base/text";
import Link from "@/components/base/link";

import { encodeString } from "@/lib/utils";
import {
  getSectionById,
  getActiveElement,
  handleScroll,
  alignMenuItem,
} from "./utils";

import styles from "./Anchor.module.css";

// Global active element
let globalActiveItemId = null;
const globalDynamicClassList = [styles.scrolling];

/**
 * Menu function - to generate the menu
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */

function Menu({
  items,
  titles,
  onMount,
  stickyTop = true,
  stickyBottom = false,
}) {
  const [activeItemId, setActiveItemId] = useState(globalActiveItemId);

  // mount
  const [mountedOnClient, setMountedOnClient] = useState(false);
  // force update
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
      alignMenuItem(itemsWrap, item, 16);
    }
  }, [activeItemId]);

  // Prevent render if not on client
  if (!mountedOnClient) {
    return null;
  }

  // window Y distance from top
  const scrollY = window.scrollY;

  const windowH = window.innerHeight;

  // Calc height for placeholder (used by the wrap while menu is fixed)
  const height =
    (menuWrap.current && menuWrap.current.children[0]?.clientHeight) || 56;

  // Menu distance from top
  const menuT = (menuWrap.current && menuWrap.current.offsetTop) || windowH;

  // active menu element
  globalActiveItemId = getActiveElement(items, scrollY, menuT, height);

  // force rerender if the active element has changed
  if (activeItemId !== globalActiveItemId) {
    setActiveItemId(globalActiveItemId);
  }

  // Menu is sticky options
  const isStickyTop = stickyTop && scrollY > menuT;
  const isStickyBottom = stickyBottom && windowH < menuT + height - scrollY;

  const isSticky = isStickyTop || isStickyBottom;

  const stickyTopClass = isStickyTop ? styles.stickyTop : "";
  const stickyBottomClass = isStickyBottom ? styles.stickyBottom : "";
  const stickyClass = isSticky ? styles.sticky : "";

  // Reuse dynamically added styles from menuItemsWrap rerender
  const dynamicClassList = [...(itemsWrap.current?.classList || [])];
  const dynamicStyles = dynamicClassList.filter((c) =>
    globalDynamicClassList.includes(c)
  );

  return (
    <div className={styles.wrap} ref={menuWrap} style={{ height }}>
      <div
        className={`${styles.menu} ${dynamicStyles} ${stickyBottomClass} ${stickyTopClass} ${stickyClass}`}
        ref={itemsWrap}
      >
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
                    tabIndex="-1"
                    key={`link-${id}`}
                    linkRef={itemRef}
                    className={`anchor-menu-item ${styles.item} ${activeClass}`}
                    dataCy="anchor-menu-item"
                    tag="span"
                    onClick={(e) => {
                      e.preventDefault();
                      const target = itemRef.current;
                      const wrap = itemsWrap.current;
                      wrap.classList.add(styles.scrolling);
                      target.classList.add(styles.clicked);

                      handleScroll(
                        window,
                        section.element,
                        section.offset,
                        // callback
                        () => {
                          target.classList.remove(styles.clicked);
                          wrap.classList.remove(styles.scrolling);
                          alignMenuItem(itemsWrap, itemRefs.current[id], 16);
                        }
                      );
                    }}
                  >
                    <Text type={"text2"}>{titles[id]}</Text>
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

Menu.propTypes = {
  items: PropTypes.object,
  titles: PropTypes.object,
  onMount: PropTypes.func,
  stickyTop: PropTypes.bool,
  stickyBottom: PropTypes.bool,
};

/**
 * Element function - wraps all children in a div container (ref)
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */

function Element({ id, children, sectionRef, onChange }) {
  useMutationObserver(sectionRef, () => onChange(sectionRef));

  return (
    <div id={id} className="anchor-section" ref={sectionRef}>
      {children}
    </div>
  );
}

Element.propTypes = {
  id: PropTypes.string,
  sectionRef: PropTypes.object,
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

/**
 * The Component function
 *
 * [!] 'anchor-label' prop is required on all children to generate the menu
 *
 * @param {obj} props
 * @param {obj} props.children
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Wrap({ children }) {
  // Object to collect all section refs by id
  const menu = useRef();
  const refs = useRef({});
  const [sections, setSections] = useState(refs);
  const titles = {};

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
              titles={titles}
              items={sections.current}
              onMount={(updateMenu) => (menu.current = { updateMenu })}
              {...child.props}
            />
          );
        }
        return null;
      }

      // create uniq id
      const id = `${encodeString(child.props["anchor-label"])}-${idx}`;

      // Create ref if not already exist
      sections.current[id] = sections.current[id] ?? createRef();

      titles[id] = child.props["anchor-label"];

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

Wrap.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default { Wrap, Menu };
