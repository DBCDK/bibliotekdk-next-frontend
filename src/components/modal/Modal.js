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
  onClose = null,
  visible = false,
  template = "default",
  skeleton = false,
}) {
  // Listen on escape keypress
  const isEscape = useKeyPress("Escape");

  // Modal context state
  const [context, setContext] = useState({
    title: "",
    template: getTemplate(),
  });

  //  Update modal context
  useEffect(() => {
    if (template) {
      const copy = { ...context };
      copy.title = template;
      copy.template = getTemplate(template);
      setContext(copy);
    }
  }, [template]);

  //  Close chain on Escape key
  useEffect(() => {
    if (visible && isEscape) {
      handleClose();
    }
  }, [isEscape]);

  // Close functions
  function handleClose() {
    onClose();
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
          <context.template visible={visible} />
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
  let template = "";

  const onClose = function onClose() {
    if (router) {
      router.back();
    }
  };

  if (typeof window !== "undefined") {
    /* Search for "modal" props in url query
     if any found set modal active */
    shouldBeVisible =
      Object.keys(router.query).filter((k) => k.toLowerCase().includes("modal"))
        .length > 0;

    // Get template name from query
    template = get(router, "query.modal", null);
  }

  return (
    <Modal
      {...props}
      template={template}
      visible={shouldBeVisible}
      onClose={onClose}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  skeleton: PropTypes.bool,
  visible: PropTypes.bool,
  template: PropTypes.string,
};
