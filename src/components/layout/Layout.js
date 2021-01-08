import styles from "./Layout.module.css";

function getScrollYPos() {
  // Get scrollY (all browsers)
  var doc = document.documentElement;
  var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  return top;
}

let scrollY = 0;
function scrollLock(shouldLockScroll) {
  const body = document.body;

  if (!body) {
    return;
  }

  // Add "lock" class and add "fake" scrollY position to body
  if (shouldLockScroll) {
    scrollY = getScrollYPos();
    body.style.top = `-${scrollY}px`;
    body.classList.add(styles.lockScroll);
  }
  // Remove "lock", remove "fake" scrollY position
  // + Scroll back to the scrollY position - same as before the modal was triggered
  else if (body.classList.contains(styles.lockScroll)) {
    body.classList.remove(styles.lockScroll);
    window.scrollTo(0, scrollY);
  }
}

export default function Layout({ children, router }) {
  if (typeof window !== "undefined") {
    /* Search for "modal" props in url query
     if any found lock body scroll */
    const shouldLockScroll =
      Object.keys(router.query).filter((k) => k.toLowerCase().includes("modal"))
        .length > 0;

    scrollLock(shouldLockScroll);
  }

  return children;
}
