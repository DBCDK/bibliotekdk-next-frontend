# Missing Fields in Strapi — Article & FAQ

These fields exist in the old Drupal CMS but are not yet in Strapi. They need to be added via the **Content-Type Builder** before the frontend migration can be completed.

---

## Article — Missing Fields

### 1. `tags` (relation / text)
**Purpose:** Categorises the article. Shown as a label on the article page (e.g. "Nyhed", "Tema"). If missing, all articles fall back to the default label "Nyhed".

### 2. `promoted` (boolean)
**Purpose:** Marks an article to appear in the frontpage section slots. Only promoted articles are fetched for the frontpage. Without this, no articles will appear on the frontpage.

### 3. `articleSection` (string / enum)
**Purpose:** Determines *which* frontpage section the article belongs to (e.g. `"section1"`, `"section2"`). The frontpage has multiple named slots and each article is assigned to one.

### 4. `articlePosition` (integer)
**Purpose:** Controls the display order of articles *within* a section. Lower number = shown first. Without this, ordering within a section is undefined.

### 5. `alternativeUrl` (string)
**Purpose:** An optional override URL for the article link. If set, clicking the article card navigates to this URL instead of the article's own page. Used for linking to external pages or other internal routes. If the URL is external, it opens in a new tab.

---

## FAQ — Missing Fields

### 1. `tags` (relation / text)
**Purpose:** Groups FAQ items into categories on the FAQ page. The FAQ page renders as a nested accordion: category name → list of questions. Without tags, all FAQs are dumped into a single "Other" group with no structure.

### 2. `promoted` (boolean)
**Purpose:** Marks a FAQ item to appear in the short promoted FAQ section on the help landing page (`/hjaelp`). The full FAQ page (`/hjaelp/faq`) shows all published FAQs regardless. Without this flag, the promoted section cannot be filtered and will either show nothing or show everything.

---

## How to Add Fields in Strapi Content-Type Builder

1. Go to **Strapi Admin → Content-Type Builder**
2. Select the content type (**Article** or **FAQ**)
3. Click **"Add another field"**
4. Choose the field type (see table below) and fill in the name and settings
5. Click **Save** — Strapi will restart and apply the schema change
6. Remember to also **expose the new fields** in the GraphQL allowlist at `src/schema/external/bibliotekdkCms.js`

### Field types to use

| Field | Content type | Strapi field type | Notes |
|---|---|---|---|
| `tags` | Article | **Text** (short text) or **Relation** to a Tag content type | Use plain Text if categories are simple strings; use Relation if you want a managed list of categories |
| `promoted` | Article | **Boolean** | Default: `false` |
| `articleSection` | Article | **Enumeration** | Add values: `section1`, `section2`, `section3` (match whatever section names the frontend uses) |
| `articlePosition` | Article | **Number** (integer) | Used for sort order; lower = first |
| `alternativeUrl` | Article | **Text** (short text) | Store a full URL; leave empty if not needed |
| `tags` | FAQ | **Text** (short text) or **Relation** to a Tag content type | Same approach as Article tags |
| `promoted` | FAQ | **Boolean** | Default: `false` |

### Note on `tags` — Text vs Relation

- **Text field**: Simpler to set up. Editors type the category name directly on each entry. Risk of typos creating duplicate groups (e.g. "Lån" vs "lån").
- **Relation to a Tag content type**: More work to set up but gives editors a managed dropdown of categories, preventing duplicates. Recommended if there are many FAQs or articles.
