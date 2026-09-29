# Migrate Infomedia integration to Retriever

Replace the frontend's Infomedia integration with the FBI API's Retriever
integration. Keep existing authentication and library-rights behavior; the
right is still exposed as `loanerInfo.rights.infomedia`.

## API and access model

- Replace GraphQL type `InfomediaService` with `RetrieverService` everywhere,
  including fragments, enums, access sorting/enrichment, review detection,
  fixtures, stories, and tests.
- Rename Infomedia-specific helpers and variables to Retriever equivalents.
  Generated access metadata must be:
  - URL: `/retriever/{encodedTitle}/{workId}/{retrieverId}`
  - `origin: "retriever"`
  - `accessType: "retriever"`
- Preserve the current access priority: `AccessUrl`, `RetrieverService`,
  `Ereol`, `DigitalArticleService`, then `InterLibraryLoan`.
- Replace `infomedia.fragments.js` with `retriever.fragments.js` and query:
  - `manifestation.access ... on RetrieverService { id }`
  - `retriever(id: $id) { error article { id headline subHeadline byLine
    publishingDate pages sourceName fullTextHtml } }`
  - Use monitor name `bibdknext_work_retriever`.

## Routes and pages

- Replace `/infomedia/[title]/[workId]/...` pages with equivalent
  `/retriever/[title]/[workId]/...` pages and rename `infomediaId` to
  `retrieverId`.
- Add a permanent Next.js redirect from `/infomedia/:path*` to
  `/retriever/:path*`.
- Update all generated links to use `/retriever`.
- Keep the ID-resolution page behavior: when an authenticated user has exactly
  one Retriever ID, append it to the current route; otherwise show the 404.

Map Retriever article data into the existing `Content` model:

- `headline` -> title
- `subHeadline` -> subtitle, unless equal to the headline
- `publishingDate` -> formatted creation date
- `fullTextHtml` -> HTML body
- `sourceName` -> publication/paper
- `pages` -> pages
- Keep existing public work/manifestation values as fallbacks.

Apply the same Retriever query and field mapping to `/anmeldelse` review pages.
Do not render the old Infomedia `hedLine`, `text`, `paper`, `dateLine`, or
`logo` response fields.

## Branding

The file `public/retriever.png` will already be provided before implementation.
Use it on both the Retriever article page and the `/anmeldelse` review page:

- Set `deliveredBy` to `Retriever`.
- Set `disclaimer.logo` to `/retriever.png`.
- Do not extract disclaimer text from an API `logo` HTML field.
- Style the disclaimer image with `width: 297px` and `height: auto`.

## Components and tests

- Update login prompts, reservation buttons, option templates, creator
  favorites, and review links/type detection to recognize `RetrieverService`.
- Rename relevant Infomedia story/test labels, fixtures, selectors, and
  variables to Retriever, and change expected URLs and logo paths.
- Update Retriever review fixtures to use the new API field names. Dates should
  be formatted from `publishingDate`; pages should prefer the Retriever value.
- Keep existing behavior unrelated to the provider migration unchanged.

## Expected file changes

Modify:

- `next.config.js`
- `cypress/e2e/loginFlow.cy.js`
- `cypress/e2e/old/articlePage.cy.js`
- `cypress/e2e/old/options.cy.js`
- `cypress/e2e/reviews.cy.js`
- `cypress/fixtures/articlepublicdata.json`
- `src/components/_modal/pages/options/Options.helper.js`
- `src/components/_modal/pages/options/Options.stories.js`
- `src/components/_modal/pages/options/dummy_data.fixture.json`
- `src/components/article/ArticlePage.stories.js`
- `src/components/article/content/Content.module.css`
- `src/components/creator/Favorites.js`
- `src/components/hooks/useManifestationAccess.js`
- `src/components/login/prompt/ArticleLoginPrompt.js`
- `src/components/work/overview/alternatives/Alternatives.stories.js`
- `src/components/work/reservationbutton/ReservationButton.js`
- `src/components/work/reservationbutton/ReservationButton.stories.js`
- `src/components/work/reservationbutton/orderbuttontextbelow/OrderButtonTextBelow.js`
- `src/components/work/reservationbutton/utils.js`
- `src/components/work/reviews/Reviews.stories.js`
- `src/components/work/reviews/utils.js`
- `src/components/work/series/Series.stories.js`
- `src/lib/__tests__/accessFactoryUtils.test.js`
- `src/lib/accessFactoryUtils.js`
- `src/lib/api/access.fragments.js`
- `src/lib/api/creator.fragments.js`
- `src/lib/api/manifestation.fragments.js`
- `src/lib/api/work.fragments.js`
- `src/lib/automock_utils.fixture.js`
- `src/lib/enums.js`
- `src/lib/utils.js`
- `src/pages/anmeldelse/[title]/[workId]/[articleId].js`

Replace:

- `src/lib/api/infomedia.fragments.js` with
  `src/lib/api/retriever.fragments.js`
- `src/pages/infomedia/[title]/[workId]/[infomediaId].js` with
  `src/pages/retriever/[title]/[workId]/[retrieverId].js`
- `src/pages/infomedia/[title]/[workId]/index.js` with
  `src/pages/retriever/[title]/[workId]/index.js`

`public/retriever.png` is a prerequisite supplied by the developer, not a file
the implementation agent needs to create or edit.
