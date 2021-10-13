import { useState, useEffect, useRef, createContext, useContext } from "react";

// modal utils
import { handleTab } from "./utils";

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
  if (!children) {
    return null;
  }

  // If container only has 1 child, children is object
  // We want children to always be handled as an array
  if (!Array.isArray(children)) {
    children = [children];
  }

  const modal = useModal();

  // current status of the modal dialog
  const [dialogStatus, setDialogStatus] = useState("closed");

  // modal ref
  const modalRef = useRef(null);

  // modal has content and should be visible
  const isVisible = modal.stack.length > 0;

  // active/visible modal class
  const visibleClass = isVisible ? "modal_visible" : "";

  // Status is used as a class
  const dialogStatusClass = `modal_${dialogStatus}`;

  // Listen on escape keypress - will close the modal (accessibility)
  const escapeEvent = useKeyPress(isVisible && "Escape");

  // Tab key handle (locks tab in visible modal)
  useEffect(() => {
    // If tab key is pressed down
    function downHandler(e) {
      if (e.key === "Tab") {
        handleTab(e, modalRef.current);
      }
    }

    // Add event listeners
    window.addEventListener("keydown", downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, []);

  useEffect(() => {
    const dialog = modalRef.current;

    if (dialog) {
      // listener on dialog transition start
      dialog.addEventListener("transitionstart", (event) => {
        // only trigger on dialog transition
        if (event.target === dialog) {
          // Check current state
          const isOpen = dialog.classList.contains("modal_open");
          // set new dialog status state
          setDialogStatus(isOpen ? "closing" : "opening");
        }
      });
      // listener on dialog transition finished
      dialog.addEventListener("transitionend", (event) => {
        // only trigger on dialog transition
        if (event.target === dialog) {
          // Check current state
          const isOpening = dialog.classList.contains("modal_opening");
          // set new dialog status state
          setDialogStatus(isOpening ? "open" : "closed");
        }
      });
    }
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
      id="modal_dimmer"
      data-cy="modal-dimmer"
      aria-hidden={true}
      className={`modal_dimmer ${className.dimmer || ""} ${visibleClass}`}
      onClick={() => modal.clear()}
    >
      <dialog
        id="modal_dialog"
        data-cy="modal-container"
        aria-modal="true"
        role="dialog"
        tabIndex={isVisible ? "0" : null}
        ref={modalRef}
        aria-hidden={!isVisible || null}
        className={`modal_dialog ${
          className.modal || ""
        } ${visibleClass} ${dialogStatusClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal_wrap">
          {modal.stack.map((obj, index) => {
            // Find component by id in container children
            const page = children.find((child) => {
              if (child.props.id === obj.id) {
                return child;
              }
            });
            // Enrich page components with props
            return React.cloneElement(page, {
              modal,
              // stack index
              index,
              context: obj.context,
              active: obj.active,
              className: className.page || "",
              key: `modal-page-${index}`,
              dataCy: `modal-page-${index}`,
              props: page.props,
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
 * @param {obj} props
 * @param {string} props.index
 * @param {string} props.active
 * @param {string} props.modal
 * @param {string} props.className
 * @param {string} props.dataCy
 *
 * @returns {component}
 *
 */

function Page(props) {
  // page class status
  const [status, setStatus] = useState("page-after");
  // props used on page
  const { index, active, modal, className, dataCy } = props;
  // props we will pass to the component living on the page
  const passedProps = { active, modal, context: props.context, ...props.props };

  // Update the page position status
  // This will positioning the pages left, right og in the center of the modal view.
  useEffect(() => {
    // Active will be true, if page is the current active in stack (center)
    if (active) {
      setStatus("page-current");
    }
    // If not current check if index is lower than the active index in stack (left)
    else if (index < modal.index()) {
      setStatus("page-before");
    }

    // Pages will mount right, and on onmount be repositioned right
    return () => setStatus("page-after");
  }, [modal.stack]);

  return (
    <div className={`modal_page ${status} ${className}`} data-cy={dataCy}>
      <props.component {...passedProps} />
    </div>
  );
}

/**
 * UseModal hook
 * contains the stack and utility functions to read and handle stack changes
 *
 * util help functions:
 * push()
 * pop()
 * clear()
 * index()
 * select()
 * next()
 * prev()
 *
 * @returns object
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
    // Remove all elements after active (Note the splice() func.)
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
