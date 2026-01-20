# Snapshot workflow (EPUB regression)

## Goal

We keep a small set of real EPUBs as fixtures and generate JSON snapshots that capture:

- spine order
- toc / labels
- score + fallback decisions (collapse)
- other structural metrics used by the UI pipeline

Jest tests then verify that changes to heuristics don’t regress previously-fixed books.

---

## Safety rule: snapshots are append-only by default

Snapshots are the “contract”. A new run must not silently rewrite existing snapshots.

### Default behavior (safe)

- If `fixtures/snapshots/<isbn>.json` already exists → skip
- This ensures you can re-run the extractor without changing tests

### Intentional updates

Use the flag:

- `--overwrite`

to regenerate snapshots on purpose (for example after a deliberate heuristic change).

---

## Commands

Generate snapshots for all EPUBs (safe):

```bash
node src/components/sample/epub/__tests__/extractEpubSnapshot.mjs
```

Overwrite existing snapshots intentionally:

```bash
node src/components/sample/epub/__tests__/extractEpubSnapshot.mjs --overwrite
```

---

## Team conventions

- Add new EPUB `.zip` files freely
- Never modify existing EPUB fixtures
- Never “fix” failing tests by deleting snapshots
- If a snapshot changes, it must be intentional and reviewed

Snapshots are the contract.