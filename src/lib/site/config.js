const sharedMetadata = {
  defaultDescription: "",
  canonicalBaseUrl: null,
  openGraphType: "website",
  referrer: "strict-origin-when-cross-origin",
  mobileWebAppCapable: "yes",
};

export const DEFAULT_SITE = "bibliotekdk";

export const SITE_CONFIGS = {
  bibliotekdk: {
    id: "bibliotekdk",
    label: "bibliotek.dk",
    logo: {
      variant: "bibliotekdk",
      ogImage: "/img/bibdk-default-img.png",
      faviconSvg: "/favicon/bibdk/favicon.svg",
      faviconIco: "/favicon/bibdk/favicon.ico",
    },
    hero: null,
    themeColor: "#3333ff",
    metadata: {
      ...sharedMetadata,
      siteName: "bibliotek.dk",
      defaultTitle: "bibliotek.dk",
      titleTemplate: "%s | bibliotek.dk",
    },
  },
  studiebib: {
    id: "studiebib",
    label: "studie.bibliotek.dk",
    logo: {
      variant: "studiebib",
      ogImage: "/img/bibdk-default-img.png",
      faviconSvg: "/favicon/studiebib/favicon.svg",
      faviconIco: "/favicon/studiebib/favicon.ico",
    },
    hero: {
      path: "/img/Studiebib_hero.jpg",
    },
    themeColor: "#d81b60",
    metadata: {
      ...sharedMetadata,
      siteName: "studie.bibliotek.dk",
      defaultTitle: "studie.bibliotek.dk",
      titleTemplate: "%s | studie.bibliotek.dk",
    },
  },
};
