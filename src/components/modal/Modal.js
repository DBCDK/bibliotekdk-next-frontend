import { useState, useEffect } from "react";
import { get } from "lodash";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import useKeyPress from "@/components/hooks/useKeypress";

import Translate from "@/components/base/translate";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";

// templates
import Menu from "./templates/menu";
import Basket from "./templates/basket";
import Filter from "./templates/filter";

import styles from "./Modal.module.css";

export const deleteQueryParam = (path, router, paramKey) => {
  const pathname = path || router.pathname;
  let queryStr = "";
  const org = parseQuery(router);
  Object.entries(org)
    .filter(([key]) => key !== paramKey)
    .forEach(([key, val], id) => {
      queryStr += `${id === 0 ? "?" : "&"}${key}=${encodeURIComponent(
        JSON.stringify(val)
      )}`;
    });
  router.replace(`${pathname}${queryStr}`);
};

function getTemplate(template) {
  switch (template) {
    case "menu":
      return Menu;
    case "basket":
      return Basket;
    case "filter":
      return Filter;
    default:
      return Menu;
  }
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Modal({
  className = "",
  visible = false,
  template = null,
  skeleton = false,
}) {
  if (typeof window === "undefined") {
    return "hest";
  }

  const router = useRouter();

  // Listen on escape keypress
  const isEscape = useKeyPress("Escape");

  // Modal context state
  const [context, setContext] = useState({
    title: "",
    template: getTemplate(),
  });

  // Get title from template (forced mode) or query
  const title = template || get(router, "query.modal", false);

  //  Update modal context
  useEffect(() => {
    if (title) {
      const copy = { ...context };
      copy.title = title;
      copy.template = getTemplate(title);
      setContext(copy);
    }
  }, [title]);

  //  Close chain on Escape key
  useEffect(() => {
    if (visible && isEscape) {
      handleClose();
    }
  }, [isEscape]);

  // Close functions
  function handleClose() {
    if (router) {
      router.back();
    }
  }

  // active modal class
  const visibleClass = visible ? styles.visible : "";

  return (
    <div
      className={`${styles.dimmer} ${className} ${visibleClass}`}
      onClick={(e) => handleClose()}
    >
      <div
        className={`${styles.modal} ${visibleClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.top}>
          <div className={styles.wrap}>
            <Title type="title4" className={styles.title}>
              {context.title &&
                Translate({
                  context: "modal",
                  label: `title-${context.title}`,
                })}
            </Title>
            <Icon
              className={styles.close}
              src="close_white.svg"
              size={2}
              onClick={() => handleClose()}
            />
          </div>
        </div>
        <div className={styles.content}>
          <context.template />
        </div>
      </div>
    </div>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
 */
export function ModalSkeleton(props) {
  return (
    <Modal
      {...props}
      className={`${props.className} ${styles.skeleton}`}
      skeleton={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  const router = useRouter();
  let shouldBeVisible = false;

  //   const [visible, setVisible] = useState(false);

  if (typeof window !== "undefined") {
    /* Search for "modal" props in url query
     if any found set modal active */
    shouldBeVisible =
      Object.keys(router.query).filter((k) => k.toLowerCase().includes("modal"))
        .length > 0;

    // if (visible !== shouldBeVisible) {
    //   setVisible(shouldBeVisible);
    // }
  }

  return <Modal {...props} visible={shouldBeVisible} />;
}

// PropTypes for component
Wrap.propTypes = {
  skeleton: PropTypes.bool,
  visible: PropTypes.bool,
  template: PropTypes.string,
};
