# AGENTS.md

Frontend for [bibliotek.dk](https://bibliotek.dk): Next.js, React, GraphQL. Storybook for components, Jest in `src/`, Cypress in `e2e/`.

- Before changing code: briefly explain how you will solve the request, list every file you plan to change, create, or delete (with a one-line why), then wait for the developer to approve. Do not implement until they say so.
- Make the smallest change that solves the problem. No extra refactors, files, comments, or unrelated edits.
- Match existing style, naming, and patterns in nearby code.
- Prefer editing existing files over creating new ones.
- Keep components self-contained and reusable anywhere, with as little prop drilling as possible. Fetch data in a `Wrap` function (default export); keep the presentational component dumb and props-driven.
- Style with colocated CSS modules (`Component.module.css`, `import styles from "./…"`). Keep modules short and clean: few classes, existing CSS variables, no unused rules.
