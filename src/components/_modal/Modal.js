import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import { useInView } from "react-intersection-observer";
import { scrollLock } from "./utils";
import useKeyPress from "@/components/hooks/useKeypress";
import FocusLock from "react-focus-lock";

// context
export const ModalContext = createContext(null);

const LOCAL_STORAGE_KEY = "modal-v2";
const LOCAL_STORAGE_STORE_KEY = "modal-v2-store";
const URL_PAGE_UID_KEY = "modal";

/**
 * Push page uid
 *
 * @param {string} uid
 * @param router
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
 * @param router
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
  // Avoid store and stack items getting same UID
  // returns whole number between 0 and 100
  const random = Math.floor(Math.random() * 100 + 1);
  return Date.now() + random + "";
}

// Global stack object
let _stack = [];

// Global store object
// used to manage modals more flexibly
let _store = [];

/**
 *
 * @param {Object|Array} children
 * @param {Object} className
 * @param mock
 * @param {string} className.dimmer
 * @param {string} className.modal
 * @param {string} className.content
 * @returns
 */
function Container({ children, className = {}, mock = {} }) {
  if (!children) {
    children = [];
  } else if (!Array.isArray(children)) {
    // If container only has 1 child, children is object
    // We want children to always be handled as an array
    children = [children];
  }

  const _modal = useModal();

  // include mocked functions
  const modal = { ..._modal, ...mock };
  const currentPageUid = modal.currentPageUid;
  const [dialogStatus, setDialogStatus] = useState(
    modal.isVisible ? "open" : "closed"
  );
  const modalRef = useRef(null);

  // boolean stored in a ref, indicating if stack has been loaded from local storage
  const didLoad = useRef(false);

  // modal has content and should be visible
  const isVisible = modal.isVisible;

  // active/visible modal class
  const visibleClass = isVisible ? "modal_visible" : "";

  // Status is used as a class
  const dialogStatusClass = `modal_${dialogStatus}`;

  // Listen on escape keypress - will close the modal (accessibility)
  const escapeEvent = useKeyPress(isVisible && "Escape");

  /**
   * Remove an item from the store
   * @param {string} uid
   * @param {Object} store
   */
  function removeFromStore(uid, store) {
    const index = store.findIndex((obj) => obj.uid === uid);
    if (index > -1) {
      store.splice(index, 1);
      modal.setStore(store);
    }
  }

  async function moveModalFromStoreToStack(uid, stack) {
    const store = await modal.getStore();
    const activeModal = store?.find((entry) => entry.uid === uid);
    if (!activeModal) return;
    activeModal.active = true;
    activeModal.loaded = true;
    stack.push(activeModal);
    removeFromStore(uid, store);
  }

  // On mount, we try to load stack from local storage
  useEffect(() => {
    try {
      const uid = currentPageUid;
      if (!uid) {
        return;
      }

      // Load stack as string from local storage
      const stackStr = localStorage.getItem(LOCAL_STORAGE_KEY);
      // Parse stack
      const stack = JSON.parse(stackStr);
      let activeModalInStack = false;
      // Traverse the loadedstack
      stack.forEach((entry) => {
        // One page may be active
        const isActivePage = entry.uid === uid;
        entry.active = isActivePage;
        if (isActivePage) {
          activeModalInStack = true;
        }
        // Specify that the page has been loaded from local storage
        // This is used for determining how to navigate the URL history (go or replace)
        entry.loaded = true;
      });

      if (!activeModalInStack) {
        moveModalFromStoreToStack(uid, stack);
      }

      // And lets trigger a render of the loaded stack
      _stack = stack;
      modal.setStack(_stack);
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

  // force modal focus (accessibility)
  useEffect(() => {
    if (isVisible && modalRef.current) {
      // Wait for animation to finish
      setTimeout(() => {
        modalRef.current?.focus();
      }, 200);
    }
  }, [isVisible]);

  useEffect(() => {
    // Return immediately if dialogStatus is already assigned the correct state
    if (
      (!isVisible && dialogStatus === "closed") ||
      (isVisible && dialogStatus === "open")
    ) {
      return;
    }
    const dialog = modalRef.current;

    // isVisible just changed, hence we know a transition has just started
    if (isVisible) {
      setDialogStatus("opening");
    } else {
      setDialogStatus("closing");
    }

    // when transition is done we set the final dialog state
    function onTransitionEnd(event) {
      if (event.target === dialog) {
        if (isVisible) {
          setDialogStatus("open");
        } else {
          setDialogStatus("closed");
        }
      }
    }

    // add the listener
    dialog.addEventListener("transitionend", onTransitionEnd);

    // return the cleanup function that removes the listener
    return () => {
      dialog.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [isVisible]);

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
          document.activeElement.blur();
        }
      }
    }
  }, [modal.stack]);

  // Debug -> remove me in future
  if (typeof window !== "undefined") {
    console.debug("Debug: ", { stack: modal.stack });
  }

  if (children.length <= 0) {
    return null;
  }

  return (
    <>
      <div
        id="modal_dimmer"
        data-cy="modal-dimmer"
        className={`modal_dimmer ${className.dimmer || ""} ${visibleClass}`}
        onClick={() => modal.clear()}
      />
      <dialog
        id="modal_dialog"
        data-cy="modal-dialog"
        aria-modal="true"
        ref={modalRef}
        aria-hidden={!isVisible}
        className={`modal_dialog ${
          className.modal || ""
        } ${visibleClass} ${dialogStatusClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal_container">
          <FocusLock autoFocus disabled={dialogStatus === "closed"} returnFocus>
            {modal.stack.map((obj, index) => {
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

              /**
               * @TODO Rework this rendering.
               * We can't contain the focus if we render all the modal pages, The DOM would be full of hidden content.
               * This probably needs a rework
               */
              if (!obj.active) {
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
                key: `modal-page-${index}-${obj.id}`,
                dataCy: `modal-page-${index}`,
                mock: page.props.mock || {},
                props: page.props,
              });
            })}
          </FocusLock>
        </div>
      </dialog>
    </>
  );
}

/**
 * blah blah
 *
 * @param {Object} props
 * @param {string} props.index
 * @param {string} props.active
 * @param {string} props.modal
 * @param {string} props.className
 * @param {string} props.dataCy
 *
 * @returns {React.JSX.Element}
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
      <div className="content_shadow" />
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

let _hasBeenVisible = false;
export function useModal() {
  const {
    setStack: _setStack,
    setStore: _setStore,
    router,
  } = useContext(ModalContext);

  function setStack(stack) {
    _stack = stack;
    _setStack(_stack);
  }

  function setStore(store) {
    _store = store;
    _setStore(_store);
    localStorage.setItem(LOCAL_STORAGE_STORE_KEY, JSON.stringify(store));
  }

  /**
   * Returns the current store object
   * @returns current store object from browser
   */
  async function _getStore() {
    const storeStr = localStorage.getItem(LOCAL_STORAGE_STORE_KEY);
    return await JSON.parse(storeStr);
  }

  // modal is visible
  const _isVisible = _stack.length > 0 && _index() > -1;

  if (_isVisible) {
    _hasBeenVisible = true;
  }

  /**
   * Push
   */
  async function _push(id, context = {}) {
    if (id) {
      let copy = [..._stack];
      if (_stack.length > 0) {
        const activeIndex = _index();
        copy = copy.slice(0, activeIndex + 1);
        copy = copy.map((obj) => ({ ...obj, active: false }));
      }

      // Create entry

      const entry = {
        id,
        context,
        active: true,
        uid: createPageUID(),
      };

      // Push to stack
      copy.push(entry);

      // Push to history (URL)
      pushPageUID(entry.uid, router);

      // custom save
      // save && save(copy);
      // update locale state
      await setStack(copy);
    }
  }

  /**
   * Save a modal to the store, to be able to add it to the stack at a later time
   * @param {string} id
   * @param {Object} context
   */
  function _saveToStore(id, context = {}) {
    if (id) {
      let copy = [..._store];

      const idExists = copy.find((obj) => obj.id === id);

      if (idExists) {
        // Remove old entry with same id- it contains most likely outdated data
        copy = copy.filter((obj) => obj.id !== id);
      }

      // Create entry
      const entry = {
        id,
        context,
        active: false,
        uid: createPageUID(),
      };

      // Push to store
      copy.push(entry);

      // custom save
      // save && save(copy);
      // update locale state
      setStore(copy);
      return entry.uid;
    }
    return undefined;
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
   * Returns the index for the active element
   * To search for an index, an id can be passed to the function.
   *
   * OBS!!! If an ID is given, function will return the index of the first found element (from position 0) with the given id
   * @returns {number}
   */
  function _index(id = null) {
    if (id) {
      return _stack.findIndex((obj) => obj.id === id);
    }

    return _stack.findIndex((obj) => obj.active === true);
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
      if (_stack[i]?.loaded) {
        shouldReplace = true;
      }
    }
    if (shouldReplace) {
      if (_stack[index]) {
        replacePageUID(_stack[index].uid, router);
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
    let copy = [..._stack];
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
   * @returns {number}
   */
  function _next(id) {
    const active = _index();
    // No next element to select
    if (active + 1 === _stack.length) {
      return;
    }

    if (id) {
      let copy = [..._stack];
      copy = copy.slice(active, _stack.length);
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
   * @returns {number}
   */
  function _prev(id) {
    const active = _index();

    // No previous elements to select
    if (active === 0) {
      return;
    }

    if (id) {
      let copy = [..._stack];
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
   * @param {number} index
   * @param {Object} context
   */
  function _update(index = _index(), context) {
    let copy = [..._stack];
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
    // public constants
    isVisible: _isVisible,
    hasBeenVisible: _hasBeenVisible,
    currentPageUid: router.query[URL_PAGE_UID_KEY],
    // public functions
    push: _push,
    pop: _prev,
    update: _update,
    clear: _clear,
    index: _index,
    select: _select,
    next: _next,
    prev: _prev,
    saveToStore: _saveToStore,
    getStore: _getStore,
    setStack,
    setStore,
    stack: _stack,
    store: _store,
    // privat functions
    _doSelect,
    _router: router,
  };
}

/**
 * @param children
 * @param router
 * @returns {React.JSXElement}
 */
export function Provider({ children, router }) {
  const [stack, setStack] = useState([]);
  const [store, setStore] = useState([]);

  return (
    <ModalContext.Provider value={{ stack, setStack, store, setStore, router }}>
      {children}
    </ModalContext.Provider>
  );
}

const ModalObject = { Provider, Container, Page };

export default ModalObject;
