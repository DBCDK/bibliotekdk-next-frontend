import useMutationObserver from "@rooks/use-mutation-observer";
import { useState, useEffect, useRef, createRef, useMemo } from "react";
import PropTypes from "prop-types";
import throttle from "lodash/throttle";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
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
  // currently active section (window position)
  const [activeItemId, setActiveItemId] = useState(null);
  // Menu isScrolling
  const [isScrolling, setIsScrolling] = useState(false);
  // item clicked
  const [isClicked, setIsClicked] = useState(false);
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

  useEffect(() => {
    // active menu element
    const curActiveId = getActiveElement(items, scrollY, menuT, height);

    // force rerender if the active element has changed
    if (activeItemId !== curActiveId) {
      setActiveItemId(curActiveId);
    }
  });

  // Prevent render if not on client
  if (!mountedOnClient) {
    return null;
  }

  // window distance from top
  const scrollY = window.scrollY;

  // window Height
  const windowH = window.innerHeight;

  // Calc height for placeholder (used by the wrap while menu is fixed)
  const height =
    (menuWrap.current && menuWrap.current.children[0]?.clientHeight) || 56;

  // Menu distance from top
  const menuT = (menuWrap.current && menuWrap.current.offsetTop) || windowH;

  // Menu is sticky options
  const isStickyTop = stickyTop && scrollY > menuT;
  const isStickyBottom = stickyBottom && windowH < menuT + height - scrollY;

  // Is menu sticky
  const isSticky = isStickyTop || isStickyBottom;

  // Class writings (Global + dynamic/css modules)
  const stickyClass = isSticky ? `sticky ${styles.sticky}` : "";
  const stickyTopClass = isStickyTop ? `sticky-top ${styles.stickyTop}` : "";
  const stickyBottomClass = isStickyBottom
    ? `sticky-bottom ${styles.stickyBottom}`
    : "";

  // Menu is moving
  const isScrollingClass =
    isSticky && isScrolling ? `scrolling ${styles.isScrolling}` : "";

  return (
    <div
      className={styles.wrap}
      ref={menuWrap}
      style={{ height }}
      data-cy="anchor-menu-wrap"
    >
      <div
        className={`${styles.menu} ${isScrollingClass} ${stickyBottomClass} ${stickyTopClass} ${stickyClass}`}
        ref={itemsWrap}
        data-cy="anchor-menu-items"
      >
        <Container fluid>
          <Row>
            <Col xs={12} lg={{ offset: 3 }}>
              {Object.keys(items).map((id) => {
                // target section
                const section = getSectionById(id, items, menuT, height);

                // Remove sections which has returned null Or has no height
                if (!section || section.clientHeight === 0) {
                  return null;
                }

                // check if element is active
                const active = activeItemId === id;
                const activeClass = active ? `active ${styles.active}` : "";

                // Create menu item ref if not already exist
                itemRefs.current[id] = itemRefs.current[id] ?? createRef();

                // Set item ref
                const itemRef = itemRefs.current[id];

                const isClickedClass =
                  isClicked === id ? `clicked ${styles.isClicked}` : "";

                return (
                  <Link
                    tabIndex="-1"
                    key={`link-${id}`}
                    linkRef={itemRef}
                    className={`anchor-menu-item ${styles.item} ${activeClass} ${isClickedClass}`}
                    dataCy="anchor-menu-item"
                    tag="span"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsScrolling(true);
                      setIsClicked(id);

                      handleScroll(
                        window,
                        section.element,
                        section.offset,
                        // callback
                        () => {
                          setTimeout(() => {
                            setIsScrolling(false);
                            setIsClicked(false);
                          }, 100);
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
    <div
      id={id}
      data-cy="anchor-section"
      className="anchor-section"
      ref={sectionRef}
    >
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

export function getUniqueIdForAnchor(anchorLabel, idx) {
  if (!anchorLabel || !idx || idx < 0) {
    return "";
  }

  return `${encodeString(anchorLabel)}-${idx}`;
}

function getAnchorLabelForChild(child) {
  return child?.props?.["anchor-label"];
}

let theChildren = [];
export function getIndexForAnchor(anchorLabel, anchorChildren = theChildren) {
  return anchorChildren?.findIndex(
    (child) => getAnchorLabelForChild(child) === anchorLabel
  );
}

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
  const [sections] = useState(refs);
  const titles = {};
  theChildren = children;

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
        if (child.type === Menu) {
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

      const anchorLabel = getAnchorLabelForChild(child);
      // create uniq id
      const id = getUniqueIdForAnchor(anchorLabel, idx);

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

const ExportedAnchor = { Wrap, Menu };

export default ExportedAnchor;
