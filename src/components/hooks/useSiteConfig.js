import getConfig from "next/config";

import { DEFAULT_SITE, SITE_CONFIGS } from "@/lib/site/config";

const SITE_ALIASES = {
  studiebib: "studie",
};

export default function useSiteConfig() {
  const site = getSite();
  const siteConfig = getSiteConfig(site);

  return {
    site,
    ...siteConfig,
    branding: siteConfig.branding,
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
  const resolvedSite = SITE_ALIASES[normalizedSite] || normalizedSite;

  return SITE_CONFIGS[resolvedSite] ? resolvedSite : DEFAULT_SITE;
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
  const branding = siteConfig?.branding || {};
  const titleTemplate = metadata.titleTemplate || "%s";
  const defaultTitle = metadata.defaultTitle || "";
  const resolvedTitle = title || defaultTitle;
  const useTitleTemplate = resolvedTitle && resolvedTitle !== defaultTitle;
  const titleAlreadyContainsSiteName =
    resolvedTitle && metadata.siteName
      ? resolvedTitle.includes(metadata.siteName)
      : false;

  return {
    title: useTitleTemplate
      ? titleAlreadyContainsSiteName
        ? resolvedTitle
        : titleTemplate.replace("%s", resolvedTitle)
      : resolvedTitle,
    description: description || metadata.defaultDescription || "",
    image: image || branding?.logo?.ogImage || "/img/bibdk-default-img.png",
    faviconSvg: branding?.logo?.faviconSvg || "/favicon.svg",
    faviconIco: branding?.logo?.faviconIco || "/favicon.ico",
    siteName: metadata.siteName || defaultTitle,
    themeColor: branding?.colors?.themeColor || null,
  };
}
