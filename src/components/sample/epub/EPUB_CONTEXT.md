# EPUB Reader – Context & Mental Model

## What this project is about

This project implements **robust EPUB reader logic** for handling chapters, navigation, and progress bars
across a wide range of real-world EPUB files — including badly structured ones.

EPUB files vary wildly:
- Some have clean, meaningful TOCs
- Some have TOCs that *look* fine but represent page splits, not real chapters
- Some have multiple headings per file (`#h1`, `#h2`, `#h3`)
- Some have missing or broken TOCs altogether

The goal is **stable, predictable UI behavior**, not blind trust in EPUB metadata.

---

## Core problem

Without heuristics:
- One physical file can become multiple “chapters”
- Progress bars multiply incorrectly
- Chapters get labels like `-`
- Users get confusing navigation

We must decide:
> Is this EPUB structured enough for real chapters — or should we collapse everything into “Indhold”?

---

## The solution: heuristic-driven pipeline

The logic lives in `epubLogic.js` and follows this pipeline:

1. Extract raw TOC (`tocRaw`)
2. **Deduplicate TOC entries by spine item**
   - One spine href = max one section
3. Prepend missing frontmatter
   - Forside
   - Titelblad
   - Kolofon
4. **Score the EPUB structure**
5. Decide rendering mode:
   - `chapter` → real chapters
   - `fallback` → collapse content into one section
6. If fallback:
   - Keep frontmatter
   - Collapse all content into **Indhold**

---

## Heuristics & scoring

`computeEpubStructureScore()` returns:

```
{
  mode: "chapter" | "fallback",
  score: number,
  reasons: string[],
  metrics: { ... }
}
```

### Important signals

- TOC size vs spine size
- Label uniqueness (e.g. “Kapitel 1..12” is suspicious)
- Chapter-like labels with low variation
- Invalid or missing TOC hrefs
- Weak or junk labels

High score = unreliable structure → **fallback**

`collapse === true` means:
> UI must show Forside / Titel / Kolofon + a single “Indhold” section

---

## Snapshots & regression testing

We use **real EPUB files** as regression fixtures.

### Snapshot extraction

`extractEpubSnapshot.mjs`:
- Loads EPUB via epubjs (or manual ZIP fallback)
- Writes deterministic JSON snapshots containing:
  - spine
  - tocFlat
  - heuristics (mode, score, reasons)

### Tests

Jest tests:
- Re-run logic against snapshots
- Ensure structure decisions do not regress

**Snapshots are the contract.**

Never delete or “fix” snapshots casually.

If a snapshot changes:
- Either the change is intentional
- Or the logic is broken

---

## Known reference case

**“Skyggen foran mig”**
- TOC matches spine 1:1
- But chapters are actually page splits
- Must always resolve to **fallback**
- UI, snapshots, and tests are now aligned

This book acts as a critical regression anchor.

---

## Long-term goal

The system is intentionally *trainable*:

When a new broken EPUB appears:
1. Add EPUB
2. Generate snapshot
3. Adjust heuristics
4. Ensure existing snapshots still pass

This creates a **self-hardening EPUB reader** that improves over time without regressions.
