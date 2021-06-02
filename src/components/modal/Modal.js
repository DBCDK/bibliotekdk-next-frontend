import { useState, useEffect, useRef } from "react";
import { get } from "lodash";
import PropTypes from "prop-types";

import useKeyPress from "@/components/hooks/useKeypress";

import Translate from "@/components/base/translate";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";

// templates
import Menu from "./templates/menu";
import Basket from "./templates/basket";
import Filter from "./templates/filter";
import Order from "./templates/order";

import CloseSvg from "@/public/icons/close.svg";

import styles from "./Modal.module.css";

/**
 * Function to trap Tab inside modal
 *
 * @param {obj} event current target element (focused element)
 * @param {obj} container container to trap Tab in (modal)
 *
 * https://medium.com/@islam.sayed8/trap-focus-inside-a-modal-aa5230326c1b
 * https://medium.com/@seif_ghezala/how-to-create-an-accessible-react-modal-5b87e6a27503
 */
function handleTab(event, container) {
  // Search container for elements (tabindex prop)
  const sequence = Object.values(
    container.querySelectorAll('[tabindex]:not([tabindex="-1"])')
  );

  if (sequence.length < 1) {
    console.log("UNDEFINED");
    return;
  }

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

/**
 * Template selection function
 *
 * @param {string} template name of template
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
    case "order":
      return Order;
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
  onLang = null,
  template = null,
  skeleton = false,
  children = false,
}) {
  // modal is visible
  const isVisible = !!template;

  // active modal class
  const visibleClass = isVisible ? styles.visible : "";

  // Listen on escape keypress
  const escapeEvent = useKeyPress(isVisible && "Escape");

  // Listen on tab keypress
  const tabEvent = useKeyPress(isVisible && "Tab");

  // Modal ref
  const modalRef = useRef(null);

  // Modal context state
  const [context, setContext] = useState({
    title: "",
    template: getTemplate(),
  });

  // force modal focus (accessibility)
  useEffect(() => {
    if (isVisible && modalRef.current) {
      // Wait for animation to finish
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
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
    if (isVisible && escapeEvent) {
      handleClose();
    }
  }, [escapeEvent]);

  // Update and handle target on tab key press
  useEffect(() => {
    if (isVisible && get(tabEvent, "target") && get(modalRef, "current")) {
      handleTab(tabEvent, modalRef.current);
    }
  }, [tabEvent, modalRef.current]);

  // Close functions
  function handleClose() {
    onClose && onClose();
    document.activeElement.blur();
  }

  // Custom modal theme class
  const themeClass = styles[`${context.title}-theme`] || "";

  return (
    <div
      data-cy="modal-dimmer"
      aria-hidden={true}
      className={`${styles.dimmer} ${className} ${visibleClass}`}
      onClick={(e) => handleClose()}
    >
      <dialog
        data-cy="modal-container"
        aria-modal="true"
        role="dialog"
        tabIndex={isVisible ? "0" : null}
        ref={isVisible ? modalRef : null}
        aria-hidden={!isVisible || null}
        className={`${styles.modal} ${themeClass} ${visibleClass}`}
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
              dataCy="close-modal"
              tabIndex={isVisible ? "0" : "-1"}
              title={Translate({
                context: "general",
                label: "close-modal-title",
              })}
              className={styles.close}
              // src="close_white.svg"
              size={2}
              onClick={() => handleClose()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                  handleClose();
                }
              }}
            >
              <CloseSvg />
            </Icon>
          </div>
        </div>
        <div className={styles.content}>
          {(children &&
            React.cloneElement(children, {
              isVisible,
              onClose,
              onLang,
              ...children.props,
            })) || (
            <context.template
              isVisible={isVisible}
              onClose={onClose}
              onLang={onLang}
            />
          )}
        </div>
      </dialog>
    </div>
  );
}

// PropTypes for Modal component
Modal.propTypes = {
  skeleton: PropTypes.bool,
  template: PropTypes.string,
  onClose: PropTypes.func,
  onLang: PropTypes.func,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

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
export default function Wrap({ router, children = false }) {
  // Get template name from query
  const param = get(router, "query.modal", null);
  // use only first level of modal name ("-"" seperated names is for modal layers)
  const template = param && param.split("-")[0];

  // We only allow a modal to be open, when user has explicitly
  // performed an action to open the modal.
  // Following a deep link into the site with open modal,
  // will result in a router.replace
  useEffect(() => {
    if (template && router.isSsr) {
      const query = { ...router.query };
      delete query.modal;
      router.replace({ pathname: router.pathname, query });
    }
  }, []);

  // If content is rendered on server (or it is rendered for the first time in the browser),
  // we know the user followed a deep link to a page with an open modal; we do not show it.
  if (template && (typeof window === "undefined" || router.isSsr)) {
    return null;
  }

  // On modal close
  const onClose = function onClose() {
    if (router) {
      router.back();
    }
  };

  // On language select
  const onLang = function onLang() {
    if (router) {
      const locale = router.locale === "da" ? "en" : "da";
      const pathname = router.pathname;
      const query = router.query;

      // Force modal close on lang select
      delete query.modal;

      router.replace({ pathname, query }, null, { locale });
    }
  };

  return (
    <Modal template={template} onClose={onClose} onLang={onLang}>
      {children && children}
    </Modal>
  );
}

// PropTypes for component
Wrap.propTypes = {
  router: PropTypes.object,
};
