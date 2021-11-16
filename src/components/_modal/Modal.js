import { useState, useEffect, useRef, createContext, useContext } from "react";

import { useInView } from "react-intersection-observer";

// modal utils
import { handleTab, scrollLock } from "./utils";

import useKeyPress from "@/components/hooks/useKeypress";

// context
export const ModalContext = createContext(null);

const LOCAL_STORAGE_KEY = "modal-v2";
const URL_PAGE_UID_KEY = "modal";

/**
 * Push page uid
 *
 * @param {string} uid
 */
function pushPageUID(uid, router) {
  router.push({
    pathname: router.pathname,
    query: {
      ...router.query,
      [URL_PAGE_UID_KEY]: uid,
    },
  });
}

/**
 * Replace page uid
 *
 * @param {string} uid
 */
function replacePageUID(uid, router) {
  router.replace({
    pathname: router.pathname,
    query: {
      ...router.query,
      [URL_PAGE_UID_KEY]: uid,
    },
  });
}

/**
 * Delete current page uid
 */
function deletePageUID(router) {
  const query = {
    ...router.query,
  };
  delete query[URL_PAGE_UID_KEY];

  router.replace({
    pathname: router.pathname,
    query,
  });
}

/**
 * Create uid for the page
 *
 * @returns {string}
 */
function createPageUID() {
  return Date.now() + "";
}

/**
 *
 * @param {obj} className
 * @param {string} className.dimmer
 * @param {string} className.modal
 * @param {string} className.content
 * @returns
 */
function Container({ children, className = {}, mock = {} }) {
  if (!children) {
    return null;
  }

  // If container only has 1 child, children is object
  // We want children to always be handled as an array
  if (!Array.isArray(children)) {
    children = [children];
  }

  const _modal = useModal();

  // include mocked functions
  const modal = { ..._modal, ...mock };

  const currentPageUid = modal.currentPageUid;

  // current status of the modal dialog
  const [dialogStatus, setDialogStatus] = useState("closed");

  // modal ref
  const modalRef = useRef(null);

  // boolean stored in a ref, indicating if stack has been loaded from local storage
  const didLoad = useRef(false);

  // modal has content and should be visible
  const isVisible = modal.stack.length > 0 && modal.index() > -1;

  // active/visible modal class
  const visibleClass = isVisible ? "modal_visible" : "";

  // Status is used as a class
  const dialogStatusClass = `modal_${dialogStatus}`;

  // Listen on escape keypress - will close the modal (accessibility)
  const escapeEvent = useKeyPress(isVisible && "Escape");

  // On mount, we try to load stack from local storage
  useEffect(() => {
    try {
      // Load stack as string from local storage
      const stackStr = localStorage.getItem(LOCAL_STORAGE_KEY);

      // Parse stack
      const stack = JSON.parse(stackStr);

      // Get page uid
      const uid = currentPageUid;

      // Traverse the loadedstack
      stack.forEach((entry, index) => {
        // One page may be active
        entry.active = entry.uid === uid;

        // Specify that the page has been loaded from local storage
        // This is used for determining how to navigate the URL history (go or replace)
        entry.loaded = true;
      });

      // And lets trigger a render of the loaded stack
      modal.setStack(stack);
    } catch (e) {
      // catch error
      // will not be handled for now
    } finally {
      // Queue updating the didLoad ref
      setTimeout(() => {
        didLoad.current = true;
      }, 0);
    }
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

  // Listen for changes to the stack, and store it in local storage
  useEffect(() => {
    if (didLoad.current) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(modal.stack));
    }
  }, [modal.stack]);

  // Listen for history popstate events
  useEffect(() => {
    if (!didLoad.current) {
      return;
    }
    // If not found doSelect is called with -1 (which will close the modal)
    const index = modal.stack.findIndex(
      (entry) => entry.uid === currentPageUid
    );
    modal._doSelect(index);
  }, [currentPageUid]);

  // Tab key handle (locks tab in visible modal)
  useEffect(() => {
    // If tab key is pressed down
    function downHandler(e) {
      const modalTarget = !!modalRef.current.contains(e.target);

      if (e.key === "Tab") {
        isVisible && modalTarget && handleTab(e, modalRef.current);
      }
    }
    // if (isVisible) {
    // Add event listeners
    window.addEventListener("keydown", downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
    // }
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

  // check if body should lock on stack changes
  useEffect(() => {
    scrollLock(isVisible);
  }, [modal.stack]);

  // Blur foucs on modal stack change
  // Prevents enter click on a focused element on previous modal page
  useEffect(() => {
    if (isVisible && modalRef.current) {
      if (modal.stack.length > 1) {
        if (document) {
          // setTimeout(() => {
          document.activeElement.blur();
          // }, 200);
        }
      }
    }
  }, [modal.stack]);

  // Debug -> remove me in future
  console.log("Debug: ", { stack: modal.stack });

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
        data-cy="modal-dialog"
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
        <div className="modal_container">
          {modal.stack.map((obj, index) => {
            // prevent render if modal/component is not visible
            // if (!obj.active) {
            //   return null;
            // }

            // Find component by id in container children
            const page = children.find((child) => {
              if (child.props.id === obj.id) {
                return child;
              }
            });

            // No matching page was found
            if (!page) {
              return null;
            }

            // Enrich page components with props
            return React.cloneElement(page, {
              modal: { ...modal, ...mock },
              // stack index
              index,
              context: obj.context,
              active: obj.active,
              className: className.page || "",
              key: `modal-page-${index}`,
              dataCy: `modal-page-${index}`,
              mock: page.props.mock || {},
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
  const { index, active, modal, className, dataCy, mock } = props;
  // props we will pass to the component living on the page
  const passedProps = {
    active,
    modal: { ...modal, ...mock },
    context: props.context,
    ...props.props,
  };

  // Observe when bottom of list i visible
  const [ref, inView] = useInView({
    /* Optional options */
    threshold: 0,
  });

  // Add shadow to bottom of scroll area, if last element is not visible
  const shadowClass = inView ? "" : "page-shadow";

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
    <div
      className={`modal_page ${shadowClass} ${status} ${className}`}
      data-cy={dataCy}
      aria-hidden={!active}
    >
      <div className={`page_content`}>
        <props.component {...passedProps} />
        <div ref={ref} className="page_bottom" />
      </div>
    </div>
  );
}

/**
 * UseModal hook
 * contains the stack and utility functions to read and handle stack changes
 *
 * utils help functions:
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
  const { stack, setStack, save, router } = useContext(ModalContext);

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

      // Create entry
      const entry = { id, context, active: true, uid: createPageUID() };

      // Push to stack
      copy.push(entry);

      // Push to history (URL)
      pushPageUID(entry.uid, router);

      // custom save
      // save && save(copy);
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
  // function _pop() {
  //   _select()
  //   let copy = [...stack];
  //   const active = _index();
  //   // Remove all elements after active (Note the splice() func.)
  //   copy.splice(active, stack.length);
  //   //  If none items left, run clear function
  //   if (copy.length === 0) {
  //     _clear();
  //     return;
  //   }

  //   // Make previous item active
  //   const lastIndex = copy.length - 1;
  //   copy = copy.map((obj, i) => ({ ...obj, active: lastIndex === i }));
  //   // custom save
  //   save && save(copy);
  //   // update locale stack state
  //   setStack(copy);
  // }

  /**
   * clear
   *
   * Clears the stack
   */
  function _clear() {
    _select(-1);

    // // custom save
    // save && save([]);
    // // // update locale stack state
    // setStack([]);
  }

  /**
   * index
   *
   * Returns the index for the active element
   * To search for an index, an id can passed to the function.
   *
   * OBS!!! If an ID is given, function will return the index of the first found element (from position 0) with the given id
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
    const prevActive = _index();

    let shouldReplace = false;

    // Check if some of the path is loaded from localstorage
    // The path is every page located between "index" and "prevActive"
    for (
      let i = Math.min(prevActive, index);
      i <= Math.max(prevActive, index);
      i++
    ) {
      if (stack[i]?.loaded) {
        shouldReplace = true;
      }
    }
    if (shouldReplace) {
      if (stack[index]) {
        replacePageUID(stack[index].uid, router);
      } else {
        deletePageUID(router);
      }
      _doSelect(index);
    } else {
      // Update history
      // This will trigger _doSelect
      const delta = index - prevActive;
      router.go(delta);
    }
  }

  /**
   * Update the actual stack to match current URL
   *
   *
   */
  function _doSelect(index) {
    let copy = [...stack];
    // set active true on index match, others false.
    copy = copy.map((obj, i) => ({ ...obj, active: index === i }));
    // custom save
    // save && save(copy);
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
      const index = copy.map((page) => page.id).lastIndexOf(id);

      // index will be -1 on no match
      if (index >= 0) {
        _select(index);
      }
      return;
    }

    // select previous element
    _select(active - 1);
  }

  /**
   * update a stack element context
   *
   * OBS!!!! skal der opdateres i localstorage stakken her?
   *
   * @param {*} index
   * @param {*} context
   */
  function _update(index = _index(), context) {
    let copy = [...stack];
    copy = copy.map((obj, i) => {
      if (index === i) {
        return {
          ...obj,
          context: { ...obj.context, ...context, _update: true },
        };
      }
      return obj;
    });

    // save && save(copy);
    // update locale stack state
    setStack(copy);
  }

  return {
    currentPageUid: router.query[URL_PAGE_UID_KEY],
    push: _push,
    pop: _prev,
    update: _update,
    clear: _clear,
    index: _index,
    select: _select,
    next: _next,
    prev: _prev,
    setStack,
    stack,
    _doSelect,
    _router: router,
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

export function Provider({ children, router }) {
  const [stack, setStack] = useState([]);

  return (
    <ModalContext.Provider value={{ stack, setStack, router }}>
      {children}
    </ModalContext.Provider>
  );
}

export default { Provider, Container, Page };
