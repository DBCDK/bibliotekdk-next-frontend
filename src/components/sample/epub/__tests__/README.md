EPUB regression tests

This folder contains regression tests and helpers for the EPUB reader logic.

The goal is to ensure that improvements to EPUB parsing do not break previously working books, even though EPUB files vary greatly in structure.

What is tested?

We extract logic snapshots from real EPUB files and store them as JSON.

A snapshot represents:

detected sections / labels (for example: Cover, Title, Chapters, Content)

spine order

fallback decisions (for example collapsed “Indhold” mode)

other structural signals used by the reader

These snapshots are then used by Jest tests to detect regressions.

Fixtures

All test EPUBs live in:

src/components/sample/epub/tests/fixtures/epubs/

Rules:

Files must be .zip

You can freely add new EPUBs to this folder

Existing EPUBs must never be modified (snapshots rely on them)

Generating snapshots

To generate snapshots for all EPUBs:

node src/components/sample/epub/tests/extractEpubSnapshot.mjs

To generate a snapshot for one specific EPUB:

node src/components/sample/epub/tests/extractEpubSnapshot.mjs
src/components/sample/epub/tests/fixtures/epubs/<BOOK>.zip

Snapshots are written to:

src/components/sample/epub/tests/snapshots/

When to add a new EPUB

Add a new EPUB when:

a book renders incorrectly

progress behaves strangely

sections or chapters look wrong

a fallback mode is triggered unexpectedly

This allows us to improve detection heuristics, add coverage for new EPUB structures, and avoid breaking already-supported cases.

Important rule

Never “fix” a failing test by deleting a snapshot.

If a snapshot changes:

either the change is intentional and the snapshot is updated knowingly

or it is a regression and the logic must be fixed

Snapshots are the contract.