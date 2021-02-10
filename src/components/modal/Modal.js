import { useState, useEffect, useRef } from "react";
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

/**
 * Function to trap Tab inside modal
 *
 * @param {obj} event // current target element (focused element)
 * @param {obj} container // container to trap Tab in (modal)
 *
 */
function handleTab(event, container) {
  // Search container for elements (tabindex prop)
  const sequence = Object.values(
    container.querySelectorAll('[tabindex]:not([tabindex="-1"])')
  );

  const backward = event.shiftKey;
  const first = sequence[0];
  const last = sequence[sequence.length - 1];

  // wrap around first to last, last to first
  const source = backward ? first : last;
  const target = backward ? last : first;

  if (source === event.target) {
    target.focus();
    return;
  }

  // find current position in tabsequence
  let currentIndex;
  const found = sequence.some(function (element, index) {
    if (element !== event.target) {
      return false;
    }

    currentIndex = index;
    return true;
  });

  if (!found) {
    // redirect to first as we're not in our tabsequence
    first.focus();
    return;
  }

  // shift focus to previous/next element in the sequence
  const offset = backward ? -1 : 1;
  sequence[currentIndex + offset].focus();
}

// kill-me
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

/**
 * Template selection function
 *
 * @param {string} template // name of template
 *
 * @returns {component}
 */
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
  template = null,
  skeleton = false,
}) {
  // modal is visible
  const isVisible = !!template;

  // active modal class
  const visibleClass = isVisible ? styles.visible : "";

  // Listen on escape keypress
  const isEscape = useKeyPress("Escape");

  // Listen on tab keypress
  const isTab = useKeyPress("Tab");

  // Modal ref
  const modalRef = useRef(null);

  // Modal context state
  const [context, setContext] = useState({
    title: "",
    template: getTemplate(),
  });

  // focus modal (accessibility)
  useEffect(() => {
    if (isVisible && modalRef.current) {
      setTimeout(() => {
        modalRef.current.focus();
      }, 200);
    }
  }, [isVisible, modalRef.current]);

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
    if (isVisible && isEscape) {
      handleClose();
    }
  }, [isEscape]);

  //  Close chain on Escape key
  useEffect(() => {
    if (isVisible && get(isTab, "target") && get(modalRef, "current")) {
      handleTab(isTab, modalRef.current);
    }
  }, [isTab, modalRef.current]);

  // Close functions
  function handleClose() {
    onClose();
    document.activeElement.blur();
  }

  return (
    <div
      aria-hidden={true}
      className={`${styles.dimmer} ${className} ${visibleClass}`}
      onClick={(e) => handleClose()}
    >
      <dialog
        aria-modal="true"
        role="dialog"
        tabindex={isVisible ? "0" : null}
        ref={isVisible ? modalRef : null}
        aria-hidden={!isVisible || null}
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
              tabIndex={isVisible ? "0" : "-1"}
              title={Translate({
                context: "modal",
                label: "close-modal-title",
              })}
              className={styles.close}
              src="close_white.svg"
              size={2}
              onClick={() => handleClose()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                  handleClose();
                }
              }}
            />
          </div>
        </div>
        <div className={styles.content}>
          <context.template isVisible={isVisible} />
        </div>
      </dialog>
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

  const onClose = function onClose() {
    if (router) {
      router.back();
    }
  };

  // Get template name from query
  const template = get(router, "query.modal", null);

  return <Modal {...props} template={template} onClose={onClose} />;
}

// PropTypes for component
Wrap.propTypes = {
  skeleton: PropTypes.bool,
  template: PropTypes.string,
  onClose: PropTypes.func,
};
