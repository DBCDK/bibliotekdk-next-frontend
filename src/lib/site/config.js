const sharedBranding = {
  logo: {
    variant: "default",
    ogImage: "/img/bibdk-default-img.png",
    faviconSvg: "/favicon.svg",
    faviconIco: "/favicon.ico",
  },
  colors: {
    primary: "#3333ff",
    primaryContrast: "#ffffff",
    themeColor: "#3333ff",
  },
};

const sharedMetadata = {
  defaultDescription: "",
};

export const DEFAULT_SITE = "bibliotek";

export const SITE_CONFIGS = {
  bibliotek: {
    id: "bibliotek",
    label: "bibliotek.dk",
    branding: sharedBranding,
    metadata: {
      ...sharedMetadata,
      siteName: "bibliotek.dk",
      defaultTitle: "bibliotek.dk",
      titleTemplate: "%s | bibliotek.dk",
    },
  },
  studie: {
    id: "studie",
    label: "studie.bibliotek.dk",
    branding: sharedBranding,
    metadata: {
      ...sharedMetadata,
      siteName: "studie.bibliotek.dk",
      defaultTitle: "studie.bibliotek.dk",
      titleTemplate: "%s | studie.bibliotek.dk",
    },
  },
};
