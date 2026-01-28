// src/components/sample/epub/epubNavUtils.js

function clamp01(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

/**
 * Derive "book edges" robustly because epubjs loc.atStart/atEnd can be flaky
 * for certain cover/first spine items.
 *
 * loc.start.index should be the CURRENT spine index (number) when available.
 */
export function deriveBookEdgesFromLoc(loc, spineLen) {
  const lastSpineIdx = Math.max(0, Number(spineLen || 0) - 1);

  const currentSpineIdx =
    typeof loc?.start?.index === "number" ? loc.start.index : null;

  const fileIntra = clamp01(loc?.fileIntra ?? loc?.start?.percentage ?? 0);

  const derivedAtStart =
    (typeof currentSpineIdx === "number" &&
      currentSpineIdx <= 0 &&
      fileIntra <= 0.02) ||
    (!!loc?.atStart &&
      (typeof currentSpineIdx !== "number" || currentSpineIdx <= 0));

  const derivedAtEnd =
    (typeof currentSpineIdx === "number" &&
      currentSpineIdx >= lastSpineIdx &&
      fileIntra >= 0.98) ||
    (!!loc?.atEnd &&
      (typeof currentSpineIdx !== "number" || currentSpineIdx >= lastSpineIdx));

  return {
    firstSpineIdx: 0,
    lastSpineIdx,
    derivedAtStart,
    derivedAtEnd,
    // keep raw flags (sometimes useful for debug)
    locAtStart: !!loc?.atStart,
    locAtEnd: !!loc?.atEnd,
  };
}

/**
 * The "stuck prev" bug:
 * - epubjs prev() can trigger a reflow/relocation but still stay on SAME spine
 * - especially on first real section after cover
 *
 * If beforeIdx === afterIdx AND we're at start-of-file, then we should force
 * display(spineIdx - 1) when possible.
 */
export function shouldForceSpineJumpOnPrev({
  beforeSpineIdx,
  afterSpineIdx,
  beforeFileIntra,
  beforeAtStart,
}) {
  const b = beforeSpineIdx;
  const a = afterSpineIdx;

  if (typeof b !== "number" || typeof a !== "number") return false;
  if (b !== a) return false;
  if (b <= 0) return false;

  const intra = clamp01(beforeFileIntra);
  const atFileStart = !!beforeAtStart || intra <= 0.02;
  return atFileStart;
}

/**
 * Symmetric for next():
 * If beforeIdx === afterIdx AND we're at end-of-file, force display(spineIdx + 1)
 */
export function shouldForceSpineJumpOnNext({
  beforeSpineIdx,
  afterSpineIdx,
  beforeFileIntra,
  beforeAtEnd,
  lastSpineIdx,
}) {
  const b = beforeSpineIdx;
  const a = afterSpineIdx;

  if (typeof b !== "number" || typeof a !== "number") return false;
  if (b !== a) return false;

  const last = typeof lastSpineIdx === "number" ? lastSpineIdx : null;
  if (typeof last === "number" && b >= last) return false;

  const intra = clamp01(beforeFileIntra);
  const atFileEnd = !!beforeAtEnd || intra >= 0.98;
  return atFileEnd;
}
