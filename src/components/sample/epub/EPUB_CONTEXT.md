# EPUB reader & regression test context

## Problem space

EPUB files vary wildly:

- broken or synthetic TOCs
- multiple TOC entries per spine file
- internal file names used as chapters
- missing or misleading labels

The reader therefore relies on heuristics, not assumptions.

---

## Spine vs TOC

- The spine defines reading order
- The TOC provides labels (often unreliable)
- One spine file must never create multiple progress sections

---

## Fallback mode

Fallback collapses the book to:

- frontmatter (Forside / Titelblad / Kolofon when detectable)
- one single section: Indhold

Fallback is not an error. It is a safe rendering mode.

---

## Structure scoring

Signals include:

- TOC size vs spine size
- invalid TOC hrefs
- duplicate spine mappings
- weak or repeated labels
- chapter-like labels with low uniqueness

If the score crosses a threshold, fallback is triggered.

---

## Regression testing

Real EPUBs are stored as fixtures.
Snapshots capture structure decisions.
Tests assert that previously-fixed books stay fixed.

Snapshots are the contract.
