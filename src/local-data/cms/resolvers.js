import articlesDa from "./articles.da.json";
import articlesEn from "./articles.en.json";
import promotedArticlesDa from "./promoted-articles.da.json";
import promotedArticlesEn from "./promoted-articles.en.json";
import helptextsDa from "./helptexts.da.json";
import helptextsEn from "./helptexts.en.json";
import faqsDa from "./faqs.da.json";
import faqsEn from "./faqs.en.json";
import promotedFaqsDa from "./promoted-faqs.da.json";
import promotedFaqsEn from "./promoted-faqs.en.json";
import notificationsDa from "./notifications.da.json";
import notificationsEn from "./notifications.en.json";

const snapshots = {
  da: {
    articles: articlesDa,
    promotedArticles: promotedArticlesDa,
    helptexts: helptextsDa,
    faqs: faqsDa,
    promotedFaqs: promotedFaqsDa,
    notifications: notificationsDa,
  },
  en: {
    articles: articlesEn,
    promotedArticles: promotedArticlesEn,
    helptexts: helptextsEn,
    faqs: faqsEn,
    promotedFaqs: promotedFaqsEn,
    notifications: notificationsEn,
  },
};

function localeFromLanguage(language) {
  return language === "EN_GB" || language === "en" ? "en" : "da";
}

function snapshotFor(type, language) {
  return snapshots[localeFromLanguage(language)][type];
}

function entitiesFor(type, language) {
  return snapshotFor(type, language).entities || [];
}

function byNidFor(type, language) {
  return snapshotFor(type, language).byNid || {};
}

function normalizeId(id) {
  return String(id || "");
}

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesQuery(value, query) {
  return value.toLowerCase().includes(query);
}

export function getAllArticles(language) {
  return entitiesFor("articles", language);
}

export function getArticleById(articleId, language) {
  return byNidFor("articles", language)[normalizeId(articleId)] || null;
}

export function getPromotedArticles(language) {
  return entitiesFor("promotedArticles", language);
}

export function getPublishedHelptexts(language) {
  return entitiesFor("helptexts", language);
}

export function getHelpTextById(helpTextId, language) {
  return byNidFor("helptexts", language)[normalizeId(helpTextId)] || null;
}

export function searchHelptexts(query, language) {
  const normalizedQuery = String(query || "")
    .trim()
    .toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return getPublishedHelptexts(language)
    .filter((helptext) => {
      const body = stripHtml(
        helptext?.body?.processed || helptext?.body?.value
      );
      return (
        includesQuery(helptext.title || "", normalizedQuery) ||
        includesQuery(helptext.fieldHelpTextGroup || "", normalizedQuery) ||
        includesQuery(body, normalizedQuery)
      );
    })
    .map((helptext) => ({
      body: stripHtml(helptext?.body?.processed || helptext?.body?.value),
      group: helptext.fieldHelpTextGroup,
      nid: helptext.nid,
      orgTitle: helptext.title,
      title: helptext.title,
    }));
}

export function getPublishedFaqs(language) {
  return entitiesFor("faqs", language);
}

export function getPromotedFaqs(language) {
  return entitiesFor("promotedFaqs", language);
}

export function getNotifications(language) {
  return entitiesFor("notifications", language);
}
