import useMutationObserver from "@rooks/use-mutation-observer";
import { useState, useEffect, useRef, createRef, useMemo } from "react";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
// import useWindowSize from "@/lib/useWindowSize";

import { Container, Row, Col } from "react-bootstrap";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Link from "@/components/base/link";

import { encodeString } from "@/lib/utils";

import styles from "./Anchor.module.css";

function Menu({ items, onMount }) {
  const refresh = useState()[1];
  // Menu wrapper ref
  const menuWrap = useRef(null);
  // Menu Items ref
  const itemsWrap = useRef(null);
  // menu item container ref
  const itemRefs = useRef({});

  useEffect(() => {
    onMount(() => refresh({}));
  }, []);

  // Scroll to ref on select
  function handleScroll(section, offset = 0) {
    // Scroll to element position
    const count = section.offsetTop;
    window.scrollTo({
      top: count - offset,
      left: 0,
      behavior: "smooth",
    });
  }

  // Strip id to get section name (anchor-label prop)
  function getName(id) {
    id = id.replace(/-\d+/g, "");
    id = id.replace(/-/g, " ");
    return id;
  }

  // Left align menu items on select
  function alignMenuItem(item, offset = 0) {
    // Check that menu wrap exist
    if (!itemsWrap.current) {
      return null;
    }
    // If item exist
    if (!item.current) {
      return null;
    }

    // Scroll to element position
    const count = item.current.offsetLeft;
    itemsWrap.current.scrollTo({
      top: 0,
      left: count - offset,
      behavior: "smooth",
    });
  }

  // window Y distance from top
  const scrollY = window.scrollY;

  // Calc height for placeholder (used by the wrap while menu is fixed)
  const height =
    (menuWrap.current && menuWrap.current.children[0]?.clientHeight) || 0;

  // Menu distance from top
  const menuT = menuWrap.current && menuWrap.current.offsetTop;

  // Menu is sticky
  const isSticky = scrollY > menuT;
  const stickyClass = isSticky ? styles.sticky : "";

  return (
    <div className={styles.wrap} ref={menuWrap} style={{ height }}>
      <div className={`${styles.menu} ${stickyClass}`} ref={itemsWrap}>
        <Container fluid>
          <Row>
            <Col xs={12} lg={{ offset: 3 }}>
              {Object.keys(items).map((item) => {
                // target section
                const section = items[item].current;

                if (!section || section.children.length === 0) {
                  return null;
                }

                // Check scroll position for active section
                const sectionH = section.clientHeight;
                const sectionT = section.offsetTop;

                // Set offset according to menu is above or underneath section
                const offset = sectionT + sectionH > menuT ? height : 0;

                // Active section calculation
                const active =
                  scrollY + offset >= sectionT &&
                  scrollY + offset < sectionT + sectionH;
                const activeClass = active ? styles.active : "";

                // Create menu item ref if not already exist
                itemRefs.current[item] = itemRefs.current[item] ?? createRef();

                // Set item ref
                const itemRef = itemRefs.current[item];

                // If item ref exist
                if (itemRef) {
                  // if element is active
                  if (active) {
                    alignMenuItem(itemRef, 16);
                  }
                }
                return (
                  <Link
                    key={`link-${item}`}
                    linkRef={itemRef}
                    // border={{ bottom: { keepVisible: active } }}
                    className={`${styles.item} ${activeClass}`}
                    dataCy="anchor-menu-item"
                    tag="span"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScroll(section, offset);
                      alignMenuItem(e);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleScroll(section, offset);
                        alignMenuItem(e);
                      }
                    }}
                  >
                    <Text type={"text2"}>{getName(item)}</Text>
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
  // clientside render
  if (typeof window === "undefined") {
    return null;
  }

  // Object to collect all section refs by id
  const menu = useRef();
  const refs = useRef({});
  const [sections, setSections] = useState(refs);

  const onChange = useMemo(
    () => throttle(() => menu.current && menu.current.updateMenu(), 50),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", onChange);
    // clenup on unMount
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
