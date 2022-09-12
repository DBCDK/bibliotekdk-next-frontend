import React from "react";
import { useRouter } from "next/router";
import Error from "next/error";
import Header from "@/components/header/Header";
import { useData } from "@/lib/api/api";
import { fetchAll } from "@/lib/api/apiServerOnly";
import { infomediaArticlePublicInfo, reviews } from "@/lib/api/work.fragments";
import { infomediaArticle } from "@/lib/api/infomedia.fragments";
import useUser from "@/components/hooks/useUser";

import {
  Content,
  ContentSkeleton,
} from "@/components/article/content/Content.js";

import Translate from "@/components/base/translate";

import LoginPrompt from "@/components/login/prompt";
import { useModal } from "@/components/_modal";
import { branchUserParameters } from "@/lib/api/branches.fragments";
import { LOGIN_MODE } from "@/components/_modal/pages/loanerform/LoanerForm";

export function InfomediaArticle(infomediaData) {
  const {
    publicInf: publicData,
    privateInf: privateData,
    agencyName,
    rating,
    user,
    modal,
    reviewAuthor,
  } = infomediaData;

  const router = useRouter();
  const workPublic = publicData?.data?.work;
  const manifestationPublic = publicData?.data?.work?.manifestations?.[0];
  const hasArticle = privateData?.data?.infomedia?.article;

  const articles = parseArticles(manifestationPublic, workPublic, privateData);

  return (
    <React.Fragment>
      <Header router={router} />
      {workPublic === null ? (
        <Error statusCode={404} />
      ) : publicData.isLoading || privateData.isLoading ? (
        <ContentSkeleton />
      ) : (
        <>
          {articles.map((article, idx) => {
            return (
              <Content
                key={`${article?.title}_${idx}`}
                data={{ ...article, rating, reviewAuthor }}
              />
            );
          })}

          {!user.isLoggedIn && (
            <LoginPrompt
              title={Translate({ context: "articles", label: "getAccess" })}
              description={Translate({
                context: "articles",
                label: "accessWarning",
              })}
              signIn={() => modal.push("login", { mode: LOGIN_MODE.INFOMEDIA })}
            />
          )}
          {user.isLoggedIn && workPublic && !hasArticle && (
            <LoginPrompt
              title={Translate({
                context: "articles",
                label: "libraryNoAccess",
                vars: [agencyName],
              })}
              description={Translate({
                context: "articles",
                label: "accessOpportunity2",
              })}
              buttonText={Translate({
                context: "order",
                label: "change-pickup-digital-copy-link",
              })}
              signIn={() =>
                modal.push("login", { mode: LOGIN_MODE.SUBSCRIPTION })
              }
            />
          )}
        </>
      )}
    </React.Fragment>
  );
}

/**
 * Parse given manifestation for articles - always set metadata for article.
 * If one or more infomedia articles are given -> merge it into the metadata.
 *
 * @param manifestationPublic
 * @param workPublic
 * @param privateData
 * @return {*[]}
 *  array of parsed articles
 */
function parseArticles(manifestationPublic, workPublic, privateData) {
  const article = privateData?.data?.infomedia?.article;

  const returnArticles = [];
  let articleindex = 0;

  const parsed = {
    article: {
      creators: manifestationPublic?.creators,
      title: manifestationPublic?.title,
      entityCreated: manifestationPublic?.datePublished,
      category: workPublic?.subjects
        .filter(
          (subject) => subject.type === "DBCO" || subject.type === "genre"
        )
        .map((subject) => subject.value),

      deliveredBy: "Infomedia",
    },
  };

  // If has access to article
  if (article) {
    let currentArticle = article;
    parsed.article = {
      ...parsed.article,
      subHeadLine:
        currentArticle?.subHeadLine !== currentArticle?.headLine &&
        currentArticle?.subHeadLine,
      fieldRubrik: currentArticle?.hedLine,
      body: {
        value: currentArticle?.text,
      },
      paper: currentArticle?.paper,
      disclaimer: {
        logo: "/infomedia_logo.svg",
        text: currentArticle?.logo,
      },
    };
  }
  articleindex++;
  returnArticles.push(parsed);

  return returnArticles;
}

export default function wrap() {
  const modal = useModal();
  const router = useRouter();
  const { workId, infomediaId, review: reviewPid } = router.query;

  const user = useUser();
  const pickupBranch = user?.loanerInfo?.pickupBranch;

  const infomediaPublic = useData(
    workId && infomediaArticlePublicInfo({ workId })
  );

  // This article may be a review, so we fetch the rating
  const allReviews = useData(reviewPid && workId && reviews({ workId }));
  const review = allReviews?.data?.work?.reviews?.find(
    (review) =>
      !!review?.reference?.find((reference) => reference.pid === reviewPid)
  );

  const rating = review?.rating;
  const reviewAuther = review?.author;

  const infomediaPrivate = useData(
    user.isAuthenticated && infomediaId && infomediaArticle({ id: infomediaId })
  );

  const branchRes = useData(
    pickupBranch && branchUserParameters({ branchId: pickupBranch })
  );

  const infomediaData = {
    privateInf: infomediaPrivate,
    publicInf: infomediaPublic,
    agencyName: branchRes?.data?.branches?.result?.[0]?.agencyName,
    rating: rating || null,
    reviewAuthor: reviewAuther || null,
    user,
    modal,
  };

  return InfomediaArticle(infomediaData);
}

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
wrap.getInitialProps = (ctx) => {
  return fetchAll([], ctx);
};
