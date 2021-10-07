import { useState, useEffect, useRef, createContext, useContext } from "react";
import PropTypes from "prop-types";

// modal utils
import { handleTab } from "./utils";

// styles
import styles from "./Modal.modules.css";
import "./styles.css";

import useKeyPress from "@/components/hooks/useKeypress";

// context
const ModalContext = createContext(null);

/**
 *
 * @param {obj} className
 * @param {string} className.dimmer
 * @param {string} className.modal
 * @param {string} className.content
 * @returns
 */
function Container({ save, load, children, className = {} }) {
  const modal = useModal();

  // modal is visible
  const isVisible = modal.stack.length > 0;

  // active modal class
  const visibleClass = isVisible ? "visible" : "";

  // Listen on escape keypress
  const escapeEvent = useKeyPress(isVisible && "Escape");

  // Listen on tab keypress
  // const tabEvent = useKeyPress(isVisible && "Tab");

  // Modal ref
  const modalRef = useRef(null);

  // useEffect running on component mount
  useEffect(() => {
    if (load) {
      const loadedStack = load();
      modal.setStack(loadedStack);
    }
  }, []);

  // Add event listeners
  useEffect(() => {
    // If pressed key is our target key then set to true
    function downHandler(e) {
      if (e.key === "Tab") {
        handleTab(e, modalRef.current);
      }
    }

    // If released key is our target key then set to false
    function upHandler(e) {
      if (e.key === "Tab") {
      }
    }

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  //  Closes the modal on Escape key
  useEffect(() => {
    if (isVisible && escapeEvent) {
      modal.clear();
    }
  }, [escapeEvent]);

  // Update and handle target on tab key press
  // useEffect(() => {
  //   if (isVisible && modalRef.current) {
  //     handleTab(tabEvent, modalRef.current);
  //   }
  // }, [tabEvent]);

  // force modal focus (accessibility)
  useEffect(() => {
    if (isVisible && modalRef.current) {
      // Wait for animation to finish
      setTimeout(() => {
        modalRef.current.focus();
      }, 200);
    }
  }, [isVisible]);

  return (
    <div
      data-cy="modal-dimmer"
      aria-hidden={true}
      className={`modal_dimmer ${className.dimmer || ""} ${visibleClass}`}
      onClick={() => modal.clear()}
    >
      <dialog
        data-cy="modal-container"
        aria-modal="true"
        role="dialog"
        tabIndex={isVisible ? "0" : null}
        ref={modalRef}
        aria-hidden={!isVisible || null}
        className={`modal_dialog ${className.modal || ""} ${visibleClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal_wrap">
          {React.Children.map(children, (child, i) => {
            const id = child.props.id;
            // Child is the current active page
            const isCurrent = !!(id === modal.current()?.id);

            // Default status className
            let statusClass = "unStacked";
            // This is the current active page in modal
            if (isCurrent) {
              statusClass = "current";
            }
            // If not current check if id exist in stack
            else if (modal.index(id) >= 0) {
              statusClass = "stacked";
            }

            // Get context from stack by id
            const context = modal.get(id)?.context || {};

            return (
              <div
                className={`modal_page ${statusClass} ${className.page || ""}`}
              >
                {React.cloneElement(child, {
                  context,
                  modal,
                  active: isCurrent,
                  "data-cy": `modal-page-${i}`,
                  ...child.props,
                })}
              </div>
            );
          })}
        </div>
      </dialog>
    </div>
  );
}

function Page(props) {
  return <props.component {...props} />;
}

export function useModal() {
  const { stack, setStack, save } = useContext(ModalContext);

  /**
   * Push
   */
  function _push(id, context = {}) {
    if (id) {
      const copy = [...stack];
      copy.push({ id, context });
      // custom save
      save && save(copy);
      // update locale state
      setStack(copy);
    }
  }
  /**
   * Pop
   */
  function _pop() {
    const copy = [...stack];
    copy.pop();
    // custom save
    save && save(copy);
    // update locale state
    setStack(copy);
  }

  /**
   * Clear
   */
  function _clear() {
    // custom save
    save && save([]);
    // update locale state
    setStack([]);
  }

  /**
   * Current (active)
   * Returns the id and context for last (current/visible) element in stack
   *
   * @returns {obj}
   */
  function _current() {
    return stack.at(-1);
  }

  /**
   * Current (active)
   * returns the index for the component with the given id
   *
   * @param {string} id
   * @returns {int}
   */
  function _index(id) {
    return stack.findIndex((obj) => obj.id === id);
  }

  /**
   * Current (active)
   */
  function _get(id) {
    const i = _index(id);
    if (i >= 0) {
      return stack[i];
    }
  }

  return {
    push: _push,
    pop: _pop,
    clear: _clear,
    current: _current,
    index: _index,
    get: _get,
    setStack,
    stack,
  };
}

function Provider(props) {
  const [stack, setStack] = useState([]);

  return (
    <ModalContext.Provider value={{ stack, setStack, save: props.save }}>
      {props.children}
    </ModalContext.Provider>
  );
}

export default { Provider, Container, Page };
