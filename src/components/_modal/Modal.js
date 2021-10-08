import { useState, useEffect, useRef, createContext, useContext } from "react";
import PropTypes from "prop-types";

// modal utils
import { handleTab } from "./utils";

// styles
// import styles from "./Modal.modules.css";
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
function Container({ children, className = {} }) {
  const modal = useModal();

  // modal is visible
  const isVisible = modal.stack.length > 0;

  // active modal class
  const visibleClass = isVisible ? "visible" : "";

  // Listen on escape keypress
  const escapeEvent = useKeyPress(isVisible && "Escape");

  // Modal ref
  const modalRef = useRef(null);

  // Tab key handle (locks tab in visible modal)
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
    // Add event listeners
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  // force modal focus (accessibility)
  useEffect(() => {
    if (isVisible && modalRef.current) {
      // Wait for animation to finish
      setTimeout(() => {
        modalRef.current.focus();
      }, 200);
    }
  }, [isVisible]);

  //  Closes the modal on Escape key
  useEffect(() => {
    if (isVisible && escapeEvent) {
      modal.clear();
    }
  }, [escapeEvent]);

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
          {modal.stack.map((obj, i) => {
            const id = obj.id;

            const page = children.find((child) => {
              if (child.props.id === id) {
                return child;
              }
            });

            return React.cloneElement(page, {
              modal,
              context: obj.context,
              active: obj.active,
              className: className.page || "",
              dataCy: `modal-page-${i}`,
              ...page.props,
            });
          })}
        </div>
      </dialog>
    </div>
  );
}

/**
 * blah blah
 *
 * @param {obj} name
 * @param {string} name.key
 *
 * @returns
 *
 */

function Page(props) {
  const [status, setStatus] = useState("page-after");
  const { id, active, modal, className, dataCy } = props;

  console.log("zzz index", modal.index(id), modal.index());

  useEffect(() => {
    // This is the current active page in modal
    if (active) {
      setStatus("page-current");
    }
    // If not current check if id exist in stack
    else if (modal.index(id) >= modal.index()) {
      setStatus("page-before");
    }
    // on component unmount
    return () => setStatus("page-after");
  }, [modal.stack]);

  return (
    <div className={`modal_page ${status} ${className}`} data-cy={dataCy}>
      <props.component {...props} />
    </div>
  );
}

/**
 * blah blah
 *
 * @param {obj} name
 * @param {string} name.key
 *
 * @returns
 *
 */

export function useModal() {
  const { stack, setStack, save } = useContext(ModalContext);

  /**
   * Push
   */
  function _push(id, context = {}) {
    if (id) {
      let copy = [...stack];
      // Skip "reset" on empty stack
      if (stack.length > 0) {
        const active = _index();
        copy = copy.slice(0, active + 1);
        copy = copy.map((obj) => ({ ...obj, active: false }));
      }
      // Push to stack
      copy.push({ id, context, active: true });
      // custom save
      save && save(copy);
      // update locale state
      setStack(copy);
    }
  }

  /**
   * pop
   *
   * Removes itself and all items after
   * Automatically sets a new active item (the item before the popped element)
   *
   */
  function _pop() {
    let copy = [...stack];
    const active = _index();

    copy.splice(active, stack.length);

    //  If none items left, run clear function
    if (copy.length === 0) {
      _clear();
      return;
    }

    // Make previous item active
    const lastIndex = copy.length - 1;
    copy = copy.map((obj, i) => ({ ...obj, active: lastIndex === i }));

    // custom save
    save && save(copy);
    // update locale stack state
    setStack(copy);
  }

  /**
   * clear
   *
   * Clears the stack
   */
  function _clear() {
    // custom save
    save && save([]);
    // update locale stack state
    setStack([]);
  }

  /**
   * current
   *
   * Returns the active item in stack
   *
   * @returns {obj}
   */
  function _current() {
    const active = _index();
    return stack[active];
  }

  /**
   * index
   *
   * Returns the index for the active element
   * To search for an index, an id can passed to the function.
   *
   * @returns {int}
   */
  function _index(id) {
    if (id) {
      stack.findIndex((obj) => obj.id === id);
    }

    return stack.findIndex((obj) => obj.active === true);
  }

  /**
   * select
   *
   *
   */
  function _select(index) {
    let copy = [...stack];
    // set active true on index match, others false.
    copy = copy.map((obj, i) => ({ ...obj, active: index === i }));

    // custom save
    save && save(copy);
    // update locale stack state
    setStack(copy);
  }

  /**
   * Selects the next element in stack
   * An id can be passed to the function. next() will then try
   * to select the next element in stack matching the id.
   *
   * @param {string} id (optional)
   * @returns {int}
   */
  function _next(id) {
    const active = _index();

    // No next element to select
    if (active + 1 === stack.length) {
      return;
    }

    if (id) {
      let copy = [...stack];
      copy = copy.slice(active, stack.length);

      // findIndex returns the first matching id || -1 if none found
      const index = copy.findIndex((obj) => obj.id === id);

      // index will be -1 on no match
      if (index >= 0) {
        _select(index);
      }
    }

    // select next element
    _select(active + 1);
  }

  /**
   * Selects the previous element in stack
   * An id can be passed to the function. prev() will then try
   * to select the previous element in stack matching the id.
   *
   * @param {string} id (optional)
   * @returns {int}
   */
  function _prev(id) {
    const active = _index();

    // No previous elements to select
    if (active === 0) {
      return;
    }

    if (id) {
      let copy = [...stack];
      copy = copy.slice(0, active);

      // findIndex returns the first matching id || -1 if none found
      // NOTE: reverse() flips the array order.
      const index = copy.reverse().findIndex((obj) => obj.id === id);

      // index will be -1 on no match
      if (index >= 0) {
        _select(index);
      }
    }

    // select previous element
    _select(active - 1);
  }

  return {
    push: _push,
    pop: _pop,
    clear: _clear,
    current: _current,
    index: _index,
    select: _select,
    next: _next,
    prev: _prev,
    setStack,
    stack,
  };
}

/**
 * blah blah
 *
 * @param {obj} name
 * @param {string} name.key
 *
 * @returns
 *
 */

function Provider({ children, load, save }) {
  const [stack, setStack] = useState([]);

  // useEffect running on component mount
  useEffect(() => {
    if (load) {
      const loadedStack = load();
      setStack(loadedStack);
    }
  }, []);

  return (
    <ModalContext.Provider value={{ stack, setStack, save }}>
      {children}
    </ModalContext.Provider>
  );
}

export default { Provider, Container, Page };
