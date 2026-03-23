# CMS Migration Plan: Drupal → Strapi

## Overview

This document covers migrating three features — **Notification**, **Article**, and **FAQ** — from the Drupal GraphQL CMS to the new Strapi CMS exposed under the `bibliotekdkCms` GraphQL namespace.

The new API entry point is:
```graphql
query {
  bibliotekdkCms {
    notifications(...) { ... }
    articles(...) { ... }
    faqs(...) { ... }
  }
}
```

---

## Field Mapping & Gap Analysis

### 1. Notification

#### Current Drupal fields
| Drupal field | Used in | Notes |
|---|---|---|
| `nodeQuery` (filter by type=notification) | query | Drupal entity query |
| `nid` | session storage key | node ID |
| `langcode.value` | filter by language | |
| `fieldNotificationText.value` | rendered HTML body | |
| `fieldNotificationType` | CSS class (warning/error/info/success) | |

#### New Strapi fields (`BibliotekdkCmsNotification`)
| Strapi field | Available | Maps to Drupal field |
|---|---|---|
| `documentId` | ✅ | replaces `nid` |
| `title` | ✅ | **NEW — not used currently** |
| `text` | ✅ | replaces `fieldNotificationText.value` |
| `type` | ✅ (enum: warning/error/info/success) | replaces `fieldNotificationType` |
| `locale` | ✅ | replaces `langcode.value` |
| `localizations` | ✅ | used for i18n |
| `publishedAt` | ✅ | Strapi handles published status automatically (use `status: PUBLISHED`) |

#### Missing / Changed fields
- `fieldNotificationText.value` → **`text`** (flat string, not a nested object with `.value`)
- `nid` → **`documentId`** (string ID, no longer an integer)
- Language filter changes: Drupal used `filter: {conditions: [{field:"langcode", value: $langcode}]}`; Strapi uses the `locale` parameter on the query itself

#### No missing fields — all data is present in Strapi ✅

---

### 2. Article

#### Current Drupal fields
| Drupal field | Used in | Notes |
|---|---|---|
| `nid` | URL route `[articleId]`, session key | numeric node ID |
| `title` | rendered | |
| `fieldRubrik` | rendered as subheadline | |
| `body.value` | rendered HTML, parseArticleBody() | nested object |
| `entityCreated` | rendered as date | Unix timestamp |
| `entityChanged` | fetched but not rendered | |
| `entityPublished` | filter flag | |
| `entityOwner.name` | fetched but not rendered | author name |
| `fieldImage.url` | image src | absolute Drupal URL |
| `fieldImage.alt` | image alt text | |
| `fieldImage.title` | image title | |
| `fieldImage.width` | orientation detection | |
| `fieldImage.height` | orientation detection | |
| `fieldTags[].entity.entityLabel` | category display | taxonomy terms |
| `fieldArticleSection` | frontpage section slot | e.g. `"section1"` |
| `fieldArticlePosition` | sort order within section | integer |
| `fieldAlternativeArticleUrl.uri` | optional redirect URL | Drupal `internal:` prefix |
| `fieldAlternativeArticleUrl.title` | link label | |

#### New Strapi fields (`BibliotekdkCmsArticle`)
| Strapi field | Available | Maps to Drupal field |
|---|---|---|
| `documentId` | ✅ | replaces `nid` |
| `title` | ✅ | `title` |
| `subheadline` | ✅ | replaces `fieldRubrik` |
| `image` (`BibliotekdkCmsUploadFile`) | ✅ | replaces `fieldImage` |
| `image.url` | ✅ | `fieldImage.url` |
| `image.alternativeText` | ✅ | replaces `fieldImage.alt` |
| `image.caption` | ✅ | replaces `fieldImage.title` |
| `image.width` | ✅ | `fieldImage.width` |
| `image.height` | ✅ | `fieldImage.height` |
| `body` | ✅ | replaces `body.value` (now a flat string, not nested) |
| `createdAt` | ✅ | replaces `entityCreated` (ISO datetime, not Unix timestamp) |
| `updatedAt` | ✅ | replaces `entityChanged` |
| `publishedAt` | ✅ | replaces `entityPublished` |
| `locale` | ✅ | replaces `langcode` |
| `localizations` | ✅ | i18n |

#### ⚠️ Missing fields in Strapi
| Drupal field | Status | Impact |
|---|---|---|
| `fieldTags` / category taxonomy | ❌ **MISSING** | FAQ grouping by category breaks; article category display shows fallback `"Nyhed"` |
| `fieldArticleSection` | ❌ **MISSING** | Frontpage `ArticleSection` slots cannot be assigned; promoted articles will not render |
| `fieldArticlePosition` | ❌ **MISSING** | Within-section sort order is lost |
| `fieldAlternativeArticleUrl` | ❌ **MISSING** | Alternative/external article URLs cannot be configured; `articlePathAndTarget()` and `sortArticles()` will break silently |
| `entityOwner` / author name | ❌ **MISSING** | Not currently rendered, low priority |
| `promote` flag | ❌ **MISSING** | Strapi uses `status: PUBLISHED` + filters; there is no "promote to front page" boolean |

> **Content management impact**: The `fieldArticleSection` + `fieldArticlePosition` + `promote` + `fieldAlternativeArticleUrl` fields are structural fields that controlled the frontpage layout from Drupal. These need to be added to the Strapi Article content type, or an alternative layout strategy must be agreed upon with the CMS editors.

---

### 3. FAQ

#### Current Drupal fields
| Drupal field | Used in | Notes |
|---|---|---|
| `nid` | ID reference | |
| `title` | accordion heading | |
| `body.value` | accordion content HTML | nested object |
| `body.processed` | fetched but `body.value` is used | Drupal's sanitised version |
| `promote` | filter for "promoted FAQs" | boolean flag |
| `langcode.value` | language filter | |
| `fieldTags[0].entity.entityLabel` | group/category label | used by `groupSortData()` |

#### New Strapi fields (`BibliotekdkCmsFaq`)
| Strapi field | Available | Maps to Drupal field |
|---|---|---|
| `documentId` | ✅ | replaces `nid` |
| `title` | ✅ | `title` |
| `body` | ✅ | replaces `body.value` (flat string now) |
| `publishedAt` | ✅ | replaces `promote`+`status` (partially) |
| `createdAt` | ✅ | |
| `updatedAt` | ✅ | |

#### ⚠️ Missing fields in Strapi
| Drupal field | Status | Impact |
|---|---|---|
| `fieldTags` / category | ❌ **MISSING** | `groupSortData()` in `faq/utils.js` will break — all FAQs land in the fallback "Other" group with no categories |
| `promote` flag | ❌ **MISSING** | `promotedFaqs` query cannot distinguish promoted from non-promoted FAQs; promoted section on help landing will show all FAQs |
| `body.processed` | ❌ not needed | Not used in rendering — `body.value` was used; Strapi's `body` is equivalent |

> **Note on FAQ locale**: The Strapi `BibliotekdkCmsFaq` type does **not** have `locale` or `localizations`. FAQ is not localised in Strapi. If multilingual FAQ is needed, this must be added to the Strapi content type.

---

## Migration Steps

### Phase 1 — Strapi Content Type Extensions (Backend / CMS work)

Before frontend changes can be complete, the following fields need to be added to the Strapi content types:

#### Article content type
1. Add `fieldArticleSection` (enum or string) — frontpage section slot identifier
2. Add `fieldArticlePosition` (integer) — sort order within section
3. Add `fieldAlternativeArticleUrl` (component with `url` string + `isExternal` boolean, or just a URL string) — replaces Drupal's `internal:` prefix convention
4. Add `tags` (relation or string array) — replaces `fieldTags` for category display

> If adding `fieldArticleSection` / `fieldArticlePosition` is not desired, an alternative layout strategy must be designed (e.g. using a dedicated "Featured" relation field, a separate "Frontpage Layout" content type, or hardcoded section slots with article relations).

#### FAQ content type
5. Add `tags` (relation or string array) — replaces `fieldTags` for grouping FAQs by category
6. Add `promoted` (boolean) — replaces Drupal's "Promoted to front page" flag, used to distinguish the short promoted FAQ list from the full list

Once these are added, the GraphQL schema / allowlist (`src/schema/external/bibliotekdkCms.js`) must be updated to expose the new fields.

---

### Phase 2 — GraphQL Query Rewrites

All three query files need to switch from the `FBI_API` Drupal endpoint to the new `bibliotekdkCms` namespace. Depending on the gateway setup, this may mean changing `apiUrl` to a new `ApiEnums` value or using the same endpoint with restructured query paths.

#### 2a. Notification — `src/lib/api/notification.fragment.js`

**Replace** the entire file content with:

```js
import { ApiEnums } from "@/lib/api/api";

export function notificationsQuery({ language }) {
  return {
    apiUrl: ApiEnums.FBI_API, // update if CMS API has its own enum value
    query: `
      query NotificationsQuery($locale: BibliotekdkCmsI18NLocaleCode) {
        bibliotekdkCms {
          notifications(
            status: PUBLISHED
            filters: { locale: { eq: $locale } }
          ) {
            documentId
            title
            text
            type
            locale
          }
        }
      }
    `,
    variables: { locale: language },
    slowThreshold: 3000,
  };
}
```

> **Note**: Check whether the `locale` filter via `BibliotekdkCmsNotificationFiltersInput` is the right approach or whether the top-level `locale` argument on the `notifications` query is available (the schema shows `locale: BibliotekdkCmsI18NLocaleCode` as a query argument).

#### 2b. Article — `src/lib/api/article.fragments.js`

Replace all three query functions:

**`article` (single by ID):**
```js
export function article({ articleId, language }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
      query ArticleQuery($documentId: ID!, $locale: BibliotekdkCmsI18NLocaleCode) {
        bibliotekdkCms {
          article(documentId: $documentId, locale: $locale) {
            documentId
            title
            subheadline
            body
            createdAt
            updatedAt
            image {
              url
              alternativeText
              caption
              width
              height
            }
          }
        }
      }
    `,
    variables: { documentId: articleId, locale: language },
    slowThreshold: 3000,
  };
}
```

**`promotedArticles`** (once Strapi fields are added):
```js
export function promotedArticles({ language }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
      query PromotedArticlesQuery($locale: BibliotekdkCmsI18NLocaleCode) {
        bibliotekdkCms {
          articles(
            status: PUBLISHED
            locale: $locale
            # filters: { promoted: { eq: true } }  <- once "promoted" field exists in Strapi
          ) {
            documentId
            title
            subheadline
            body
            publishedAt
            image {
              url
              alternativeText
              caption
              width
              height
            }
            # fieldArticleSection  <- once added to Strapi
            # fieldArticlePosition <- once added to Strapi
            # alternativeUrl       <- once added to Strapi
          }
        }
      }
    `,
    variables: { locale: language },
    slowThreshold: 3000,
  };
}
```

**`allArticles`**:
```js
export function allArticles({ language }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
      query AllArticlesQuery($locale: BibliotekdkCmsI18NLocaleCode) {
        bibliotekdkCms {
          articles(status: PUBLISHED, locale: $locale) {
            documentId
            title
            subheadline
            createdAt
            image {
              url
              alternativeText
              caption
            }
            # alternativeUrl <- once added to Strapi
          }
        }
      }
    `,
    variables: { locale: language },
    slowThreshold: 3000,
  };
}
```

#### 2c. FAQ — `src/lib/api/faq.fragments.js`

**`promotedFaqs`** (once `promoted` field exists in Strapi):
```js
export function promotedFaqs(language) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
      query PromotedFaqsQuery {
        bibliotekdkCms {
          faqs(
            status: PUBLISHED
            # filters: { promoted: { eq: true } }  <- once field exists
          ) {
            documentId
            title
            body
            # tags { name }  <- once tags field exists
          }
        }
      }
    `,
    slowThreshold: 3000,
  };
}
```

**`publishedFaqs`**:
```js
export function publishedFaqs(language) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
      query PublishedFaqsQuery {
        bibliotekdkCms {
          faqs(status: PUBLISHED) {
            documentId
            title
            body
            # tags { name }  <- once tags field exists
          }
        }
      }
    `,
    slowThreshold: 3000,
  };
}
```

**Remove `FaqById`** — Strapi supports `faq(documentId: ID!)` but this function is not currently used in any rendered component. Remove or keep dormant.

---

### Phase 3 — Component / Data Mapping Updates

#### 3a. Notifications — `src/components/base/notifications/Notifications.js`

| Change | Detail |
|---|---|
| `notificationsFilter()` | Change `data.nodeQuery.entities` → `data.bibliotekdkCms.notifications` |
| `notification.fieldNotificationText.value` | Change to `notification.text` (flat string) |
| `notification.fieldNotificationType` | Change to `notification.type` |
| Session storage key | Change `showme_${index}` to `showme_${notification.documentId}` (more stable than index) |
| React key | Change `${notification.fieldNotificationText}_${index}` to `notification.documentId` |

#### 3b. Article — multiple files

**`src/components/article/content/Content.js`**
| Change | Detail |
|---|---|
| `article.fieldImage` | Change to `article.image` |
| `article.fieldImage.url` | Change to `article.image.url` |
| `article.fieldImage.alt` | Change to `article.image.alternativeText` |
| `article.fieldImage.title` | Change to `article.image.caption` |
| `article.fieldRubrik` | Change to `article.subheadline` |
| `article.body?.value` | Change to `article.body` (flat string) |
| `article.fieldTags` → category | Change to `article.tags` once added; fallback to `"Nyhed"` in the meantime |
| `article.entityCreated` | Change to `article.createdAt` — note: ISO datetime string not Unix timestamp; update `timestampToShortDate()` call or use a new date formatter |

**`src/components/article/content/utils.js` — `parseArticleBody()`**

The function currently replaces an old Drupal absolute image hostname. With Strapi:
- Image URLs come from `BibliotekdkCmsUploadFile.url` — this is a proper URL from the Strapi media server, not the old Drupal hostname.
- The hardcoded `bibdk-backend-www-master.frontend-prod.svc.cloud.dbc.dk` regex replacement can be removed.
- The rest of the function (wrapping `<img>` in `<figure>` with `<figcaption>`) can remain if the Strapi `body` field still contains inline `<img>` tags. Verify with actual Strapi body content first.

**`src/components/article/preview/Preview.js`**
| Change | Detail |
|---|---|
| `article.fieldImage` | Change to `article.image` |
| `article.fieldImage.url` | Change to `article.image.url` |
| `article.fieldImage.alt` | Change to `article.image.alternativeText` |
| `article.fieldRubrik` | Change to `article.subheadline` |

**`src/components/article/section/ArticleSection.js`**
| Change | Detail |
|---|---|
| `getArticleData()` | Change `data.nodeQuery.entities` → `data.bibliotekdkCms.articles`; remove `__typename === "NodeArticle"` filter |
| `parseArticles()` | Change `article.fieldArticleSection` → new field name once added to Strapi; `article.fieldArticlePosition` → new field name |

**`src/components/articles/utils.js`**
| Change | Detail |
|---|---|
| `sortArticles()` | Change `fieldAlternativeArticleUrl` check → new field name once added; change `entityCreated` sort key → `createdAt` |
| `articlePathAndTarget()` | Change `fieldAlternativeArticleUrl.uri` → new field; remove `internal:` prefix stripping logic (Strapi URLs won't use Drupal's internal prefix convention); change `article.nid` → `article.documentId` in query object |

**`src/pages/artikel/[title]/[articleId].js`**
| Change | Detail |
|---|---|
| `articleId` URL parameter | Currently carries the Drupal `nid` (integer). With Strapi, `documentId` is a string (UUID-like). URL slugs will change for all existing articles — evaluate if redirects are needed. |
| `query.articleId` → `query.documentId` | Update variable name passed to the article query |

**`src/lib/jsonld/article.js`**

Check this file for any field references to `nid`, `entityCreated`, `fieldImage`, `fieldRubrik`, or `fieldTags` — update field names to match Strapi equivalents.

#### 3c. FAQ — multiple files

**`src/components/help/faq/utils.js`**
| Change | Detail |
|---|---|
| `groupData()` / `groupSortData()` | Currently groups by `e?.fieldTags[0]?.entity?.entityLabel`. Once `tags` field is added to Strapi, change to `e?.tags?.[0]?.name` (or equivalent depending on the Strapi field shape). Until then, all FAQs will fall into the "Other" fallback group. |
| `sortData()` | No changes needed — uses `title` and `body.value`; change `body.value` → `body` |

**`src/components/help/faq/published/Published.js`**
| Change | Detail |
|---|---|
| `data.faq.entities` | Change to `data.bibliotekdkCms.faqs` |

**`src/components/help/faq/promoted/Promoted.js`**
| Change | Detail |
|---|---|
| `data?.faq?.entities` | Change to `data?.bibliotekdkCms?.faqs` |

---

### Phase 4 — URL / Routing Changes

The article page route is `/artikel/[title]/[articleId]`. Currently `articleId` is the Drupal `nid` (an integer like `123`). In Strapi, `documentId` is a string like `abc123xyz`.

**Options:**
1. **Keep the same URL shape** — rename the route param internally to `documentId` but keep the URL path as-is. All existing URLs will 404 or return the wrong article unless Strapi also stores the old Drupal `nid` for lookup.
2. **Add redirects** — if Strapi content retains original Drupal node IDs as a metadata field, add Next.js `redirects` in `next.config.js` from old `/artikel/[title]/[nid]` paths to new `/artikel/[title]/[documentId]` paths.
3. **Use title-only slugs** — migrate to slug-based routing (`/artikel/[slug]`) with `title` as the slug. Requires adding a `slug` field to the Strapi Article content type.

**Recommendation**: Option 3 (slug-based) is the cleanest long-term approach but requires adding a `slug` field to Strapi. Option 2 is the safest for SEO continuity during migration. Option 1 breaks all existing article links.

---

### Phase 5 — Language / Locale Handling

The Drupal queries used `$language: LanguageId!` (a Drupal-specific enum) and `$langcode: [String]` (used in `filter.conditions`).

Strapi uses:
- `locale: BibliotekdkCmsI18NLocaleCode` — a scalar (locale string like `"da"` or `"en"`)
- Filtering on `locale` is done via the `locale` query argument, not via a conditions array

**Changes needed:**
- Remove `getLangcode()` calls in article and FAQ fragments (this function converts language codes to Drupal's langcode format — it will likely not be needed)
- Pass `locale` directly from `getLanguage()` — verify that the locale codes returned by `getLanguage()` match what Strapi expects (e.g. `"da"` vs `"DA"`)
- FAQ currently has no `locale` / `localizations` in the Strapi schema — FAQ is treated as locale-neutral. Confirm with CMS team if this is intentional.

---

### Phase 6 — Testing Checklist

- [ ] Notification renders correctly in Danish and English
- [ ] Notification dismiss (sessionStorage) works with `documentId` as key
- [ ] Single article page loads by `documentId`
- [ ] Article body HTML renders correctly (images, links, captions)
- [ ] Article date displays correctly (ISO → formatted date, not Unix timestamp)
- [ ] Article category/tag displays (or graceful fallback if tags not yet in Strapi)
- [ ] Frontpage article sections render (blocked until `fieldArticleSection` / `fieldArticlePosition` added to Strapi)
- [ ] Alternative article URL redirects work (blocked until field added to Strapi)
- [ ] All-articles listing page (`/artikler`) loads and sorts correctly
- [ ] Article preview cards render image, title, subheadline
- [ ] FAQ full page (`/hjaelp/faq`) loads and groups correctly (blocked until `tags` added to Strapi)
- [ ] Promoted FAQ section on help landing loads
- [ ] JSON-LD / SEO meta tags on article pages are correct
- [ ] Storybook stories still work (may need mock data shape updates)
- [ ] Cypress/e2e tests pass

---

## Summary of Blocked Items (Requires Strapi Content Type Changes First)

| Feature | Blocked on |
|---|---|
| Article: frontpage sections | Add `fieldArticleSection` + `fieldArticlePosition` to Strapi Article |
| Article: promoted filter | Add `promoted` boolean to Strapi Article |
| Article: alternative URL | Add `alternativeUrl` field to Strapi Article |
| Article: category display | Add `tags` relation to Strapi Article |
| FAQ: category grouping | Add `tags` relation to Strapi FAQ |
| FAQ: promoted subset | Add `promoted` boolean to Strapi FAQ |
| Article: URL continuity | Decide on routing strategy (slugs / redirects / documentId) |

## Files to Change (Frontend)

| File | Change type |
|---|---|
| `src/lib/api/notification.fragment.js` | Full rewrite |
| `src/lib/api/article.fragments.js` | Full rewrite |
| `src/lib/api/faq.fragments.js` | Full rewrite |
| `src/components/base/notifications/Notifications.js` | Field name updates, data path update |
| `src/components/article/content/Content.js` | Field name updates, date handling |
| `src/components/article/content/utils.js` | Remove old Drupal URL regex; verify `body` field structure |
| `src/components/article/preview/Preview.js` | Field name updates |
| `src/components/article/section/ArticleSection.js` | Data path update, field name updates |
| `src/components/articles/utils.js` | Field name updates (`nid`→`documentId`, `entityCreated`→`createdAt`, etc.) |
| `src/components/help/faq/utils.js` | Update `fieldTags` path once tags added to Strapi |
| `src/components/help/faq/published/Published.js` | Data path update |
| `src/components/help/faq/promoted/Promoted.js` | Data path update |
| `src/pages/artikel/[title]/[articleId].js` | `articleId` → `documentId` variable name |
| `src/lib/jsonld/article.js` | Field name updates |
