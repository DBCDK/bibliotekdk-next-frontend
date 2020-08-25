import React from "react";
import Article from "./Article";
import ArticleList from "./ArticleList";

export default {
  title: "Prototype:Articles",
};

export const ArticleByPath = () => {
  return <Article path="/about/bibliotekdk" />;
};

export const NonExistingArticle = () => {
  return <Article path="/does-not-exist" />;
};

export const PromotedArticles = () => {
  return <ArticleList promotedOnly={true} />;
};

export const AllArticles = () => {
  return <ArticleList />;
};
