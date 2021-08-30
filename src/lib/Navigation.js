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
    href: "https://adm.biblioteksvagten.dk/embed/ask-question?agency_id=bibliotek.dk&agency_mail=servicedesk%40dbc.dk&require_postal_code=true&popup=n&url=https%3A%2F%2Fbibliotek.dk",
    target: "_blank",
  },
  { label: "becomeLoaner", href: "/artikel/bliv-laaner/43" },
  { label: "digitalOffers", href: "/artikel/digitale-bibliotekstilbud/5" },
  { label: "forStudents", href: "/artikel/er-du-studerende%3F/9" },
  { label: "useTheLibraries", href: "/#!", hidden: true },
  { label: "mySearches", href: "/#!", hidden: true },
  { label: "helpCenter", href: "/hjaelp" },
];

export const externalUrls = {
  askLibrarianUrl:
    "https://adm.biblioteksvagten.dk/embed/ask-question?agency_id=bibliotek.dk&agency_mail=servicedesk%40dbc.dk&require_postal_code=true&popup=n&url=https%3A%2F%2Fbibliotek.dk",
};
