import React from 'react';
import Article from './Article';
import Articles from './Articles';

export default {
  title: 'Articles'
};

export const ArticleByPath = () => {
  return <Article path="/about/bibliotekdk" />;
};

export const NonExistingArticle = () => {
  return <Article path="/does-not-exist" />;
};

export const PromotedArticles = () => {
  return <Articles promotedOnly={true} />;
};

export const AllArticles = () => {
  return <Articles />;
};
