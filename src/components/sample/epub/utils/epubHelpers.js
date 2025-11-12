// components/sample/epub/utils/epubHelpers.js
import { spineIndexOfDebug } from "./epubDebug";

/** Heuristik: find cover-href i spine (selv hvis linear="no") */
export function getCoverHref(book) {
  try {
    const items = book?.spine?.spineItems || [];
    const byProp = items.find(
      (it) =>
        /\bcover\b/i.test(it?.properties || "") ||
        /\bcover-image\b/i.test(it?.properties || "") ||
        /\bpage-spread-center\b/i.test(it?.properties || "")
    );
    if (byProp?.href) return byProp.href;

    const byName = items.find(
      (it) => /cover/i.test(it?.idref || "") || /cover/i.test(it?.href || "")
    );
    if (byName?.href) return byName.href;

    const nav = book?.navigation?.toc || [];
    const flatten = (nodes) =>
      nodes.flatMap((n) => [
        n,
        ...(Array.isArray(n?.subitems) ? flatten(n.subitems) : []),
      ]);
    const hit = flatten(nav).find((n) => /cover|forside/i.test(n?.label || ""));
    if (hit?.href) {
      const test = spineIndexOfDebug(book, hit.href);
      if (typeof test.idx === "number") return test.hit || hit.href;
    }
  } catch {}
  return null;
}

/** Første spine der er displaybar: helst linear="yes"; hvis ingen, så første med href */
export function getFirstLinearHref(book) {
  try {
    const items = book?.spine?.spineItems || [];
    const linearYes = items.find(
      (it) => (it?.linear || "").toLowerCase() !== "no" && it?.href
    );
    if (linearYes?.href) return linearYes.href;
    const any = items.find((it) => it?.href);
    if (any?.href) return any.href;
  } catch {}
  return null;
}

/** Vent på epub + layout */
export async function waitForBookAndLayout(rendition, hostEl) {
  const book = rendition?.book;
  if (!book) return;
  try {
    await book.ready;
  } catch {}
  try {
    await book.loaded?.spine;
  } catch {}
  try {
    await book.loaded?.navigation;
  } catch {}

  const hasSize = () => {
    if (!hostEl) return false;
    const rect = hostEl.getBoundingClientRect();
    return rect.width > 16 && rect.height > 16;
  };
  if (!hasSize()) {
    await new Promise((resolve) => {
      const ro = new ResizeObserver(() => {
        if (hasSize()) {
          try {
            ro.disconnect();
          } catch {}
          resolve();
        }
      });
      ro.observe(hostEl);
      setTimeout(() => {
        try {
          ro.disconnect();
        } catch {}
        resolve();
      }, 1200);
    });
  }
}

export const isHttp = (href) => /^https?:\/\//i.test(href || "");
export const splitHash = (href = "") => {
  const i = href.indexOf("#");
  return i === -1 ? [href, ""] : [href.slice(0, i), href.slice(i + 1)];
};
