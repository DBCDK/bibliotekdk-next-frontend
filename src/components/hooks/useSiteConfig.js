import getConfig from "next/config";

import { DEFAULT_SITE, SITE_CONFIGS } from "@/lib/site/config";

export default function useSiteConfig() {
  const site = getSite();
  const siteConfig = getSiteConfig(site);

  return {
    site,
    ...siteConfig,
    metadata: siteConfig.metadata,
    buildMetadata: (props) =>
      buildSiteMetadata({
        siteConfig,
        ...props,
      }),
  };
}

export function normalizeSite(site) {
  if (!site) {
    return DEFAULT_SITE;
  }

  const normalizedSite = String(site).trim().toLowerCase();
  return SITE_CONFIGS[normalizedSite] ? normalizedSite : DEFAULT_SITE;
}

export function getRuntimeSite() {
  return getConfig()?.publicRuntimeConfig?.app?.site;
}

export function getSite(site = getRuntimeSite()) {
  return normalizeSite(site);
}

export function getSiteConfig(site = getRuntimeSite()) {
  return SITE_CONFIGS[getSite(site)];
}

export function buildSiteMetadata({
  siteConfig = getSiteConfig(),
  title,
  description,
  image,
} = {}) {
  const metadata = siteConfig?.metadata || {};
  const appUrl = getConfig()?.publicRuntimeConfig?.app?.url || null;
  const titleTemplate = metadata.titleTemplate || "%s";
  const defaultTitle = metadata.defaultTitle || "";
  const resolvedTitle = title || defaultTitle;
  const useTitleTemplate = resolvedTitle && resolvedTitle !== defaultTitle;
  const titleAlreadyContainsSiteName =
    resolvedTitle && metadata.siteName
      ? resolvedTitle
          .toLocaleLowerCase()
          .includes(metadata.siteName.toLocaleLowerCase())
      : false;

  return {
    title: useTitleTemplate
      ? titleAlreadyContainsSiteName
        ? resolvedTitle
        : titleTemplate.replace("%s", resolvedTitle)
      : resolvedTitle,
    description: description || metadata.defaultDescription || "",
    image: image || siteConfig?.logo?.ogImage || "/img/bibdk-default-img.png",
    faviconSvg: siteConfig?.logo?.faviconSvg || "/favicon.svg",
    faviconIco: siteConfig?.logo?.faviconIco || "/favicon.ico",
    siteName: metadata.siteName || defaultTitle,
    themeColor: siteConfig?.themeColor || null,
    canonicalBaseUrl: metadata.canonicalBaseUrl || appUrl,
    openGraphType: metadata.openGraphType || "website",
    referrer: metadata.referrer || "strict-origin-when-cross-origin",
    mobileWebAppCapable: metadata.mobileWebAppCapable || "yes",
  };
}
