# EPUB regression tests

This folder contains **regression tests + snapshot tooling** for the EPUB reader logic.

EPUB files vary _a lot_ in structure (EPUB2/EPUB3, nav vs ncx, broken metadata, weird TOCs, duplicate anchors, etc.).  
The purpose of this setup is to let us improve parsing heuristics **without breaking books that already worked**.

---

## The big idea

1. **Collect real EPUB examples** (fixtures)
2. **Generate snapshots** (`.json`) that capture what our logic _thinks_ the structure is
3. **Run Jest tests** that compare current behavior against the snapshots

When we improve the logic, we regenerate snapshots _only when the change is intentional_ and then commit them.  
That gives us a clean “contract” of expected behavior.

---

## What is a snapshot?

Snapshots are JSON files extracted from real EPUBs using `extractEpubSnapshot.mjs`.

A snapshot typically contains:

- **Spine**: the ordered reading list of content documents (`spineLen`, hrefs, order)
- **TOC (flattened)**: the navigation entries we can detect (labels + hrefs)
- **Heuristics**: what our scoring logic decides about structure
- **Pipeline output** (if enabled): intermediate results (deduped TOC, frontmatter prepends, final TOC)

In practice, snapshots represent:

- detected sections / labels (e.g. _Forside, Titelblad, Kolofon, Kapitel, Indhold_)
- deduping rules (e.g. multiple anchors inside the same HTML file should not become multiple sections)
- fallback decisions (collapsed “Indhold” mode)
- structural metrics that drive the decision (spine/TOC mapping, weak labels, “page-like chapters”, etc.)

---

## Chapter mode vs fallback mode

### Chapter mode (`mode="chapter"`)

We trust the TOC enough to show multiple sections/chapters.

Typical indicators:

- TOC labels look meaningful
- TOC maps well to spine
- label variety is reasonable

### Fallback mode (`mode="fallback"`)

We do **not** trust the TOC enough to expose it as chapters.  
Instead we collapse everything after frontmatter into a single section:

- Keep frontmatter (Forside/Titelblad/Kolofon etc.) when detectable
- Add one section: **Indhold** (the rest of the book)

Fallback is used for “ugly” or misleading books, for example:

- TOC is missing/empty
- TOC hrefs don’t map to the spine
- TOC labels are weak/junk (e.g. `-`, `•`, `index1`, etc.)
- **page-like chapter TOCs**: lots of entries named “Kapitel 1…Kapitel 57” where each “chapter” is basically a page fragment, causing too many sections/progress bars

---

## Scoring, reasons, and metrics

Our logic computes a structure score:

- `score`: **0–100**
- `reasons`: human-readable flags explaining _why_ points were added
- `metrics`: values that drive the reasons

A simplified mental model:

- Some signals add points toward **fallback**
- If the total crosses a threshold, we use fallback

Typical reasons include:

- `small-toc`
- `many-toc-hrefs-not-in-spine`
- `weak-or-index-like-labels`
- `low-label-uniqueness`
- `chapter-like-labels`
- `page-like-chapter-toc` (important: triggers fallback for books like _Skyggen foran mig_)

### What is `collapse`?

`collapse` is the decision to actually collapse the sections in the UI.

**Rule of thumb:** `collapse === (mode === "fallback")`

If you ever see `mode="chapter"` but `collapse=true`, that means scoring and UI logic have diverged.
We fixed this by ensuring page-like chapter patterns affect the **score/mode**, so the system stays consistent.

---

## Fixtures

All test EPUBs live in:

```
src/components/sample/epub/__tests__/fixtures/epubs/
```

Rules:

- Files must be **`.zip`**
- You can freely add new EPUBs
- Existing EPUBs must never be modified (snapshots rely on exact bytes)

Snapshots are written to:

```
src/components/sample/epub/__tests__/fixtures/snapshots/
```

---

## Generating snapshots

Generate snapshots for all EPUBs:

```bash
node src/components/sample/epub/__tests__/extractEpubSnapshot.mjs
```

With debug logging:

```bash
node src/components/sample/epub/__tests__/extractEpubSnapshot.mjs --debug
```

---

## Running tests

```bash
npm test -- src/components/sample/epub/__tests__/epubLogic.test.js
```

---

## When to add a new EPUB

Add a new EPUB fixture when:

- a book renders incorrectly
- progress behaves strangely (too many sections / wrong section changes)
- sections/chapters look wrong (e.g. lots of `-` labels)
- fallback mode is triggered unexpectedly (or not triggered when it should be)

This lets us:

- improve detection heuristics
- add coverage for new EPUB structures
- keep already-supported books stable

---

## The most important rule

Never “fix” a failing test by deleting a snapshot.

If a snapshot changes:

- either the change is intentional and snapshots are updated knowingly
- or it is a regression and the logic must be fixed

**Snapshots are the contract.**
