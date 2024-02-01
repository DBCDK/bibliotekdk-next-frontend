// this is for the material links in header
export const materials = [
  { label: "books", href: "/#!" },
  { label: "articles", href: "/#!" },
  { label: "film", href: "/#!" },
  { label: "ematerials", href: "/#!" },
  { label: "games", href: "/#!" },
  { label: "music", href: "/#!" },
  { label: "nodes", href: "/#!" },
];
//these are for various use - mostly the menu
// BETA-1 - hide elements from menu - notice the {hidden:true} in actions - remove it to show links again
export const actions = [
  { label: "frontpage", href: "/", hidden: false },
  { label: "scientificArticles", href: "/artikler", hidden: true },
  {
    label: "askLibrarian",
    href: "https://www.sprgbib.dk/bv/ask",
    target: "_blank",
  },
  { label: "becomeLoaner", href: "/artikel/bliv-laaner/43" },
  { label: "digitalOffers", href: "/artikel/digitale-bibliotekstilbud/5" },
  { label: "useTheLibraries", href: "/#!", hidden: true },
  { label: "mySearches", href: "/#!", hidden: true },
  { label: "helpCenter", href: "/hjaelp" },
  { label: "contactUs", href: "/hjaelp/kontakt-os/25" },
];
