import React from "react";
import { useRouter } from "next/router";
import Error from "next/error";
import Header from "@/components/header/Header";
import { useData } from "@/lib/api/api";
import { fetchAll } from "@/lib/api/apiServerOnly";
import { infomediaArticle } from "@/lib/api/infomedia.fragments";
import useUser from "@/components/hooks/useUser";

import * as workFragments from "@/lib/api/work.fragments";

import {
  Content,
  ContentSkeleton,
} from "@/components/article/content/Content.js";

import { timestampToShortDate } from "@/utils/datetimeConverter";
import ArticleLoginPrompt from "@/components/login/prompt/ArticleLoginPrompt";

export function ReviewPage(props) {
  const { article, notFound, isLoading, articleId } = props;

  const router = useRouter();

  return (
    <React.Fragment>
      <Header router={router} />
      {notFound ? (
        <Error statusCode={404} />
      ) : isLoading ? (
        <ContentSkeleton />
      ) : (
        <>
          {article && <Content data={{ article }} />}

          <ArticleLoginPrompt articleId={articleId} />
        </>
      )}
    </React.Fragment>
  );
}

/**
 * Parse work/article data to a format the Content component likes
 */
function parseInfomediaArticle(publicReviewData, work, infomediaArticle) {
  return {
    creators: [{ name: publicReviewData?.author }],
    title: infomediaArticle?.headLine || work?.titles?.main?.[0],
    entityCreated:
      publicReviewData?.date && timestampToShortDate(publicReviewData?.date),
    subHeadLine:
      infomediaArticle?.subHeadLine !== infomediaArticle?.headLine &&
      infomediaArticle?.subHeadLine,
    fieldRubrik: infomediaArticle?.hedLine,
    body: {
      value: infomediaArticle?.text,
    },
    paper: infomediaArticle?.paper || publicReviewData?.origin,
    category: work?.subjects?.dbcVerified
      ?.filter((subject) => subject.type === "TOPIC")
      .map((subject) => subject.display),
    deliveredBy: "Infomedia",
    disclaimer: {
      logo: "/infomedia_logo.svg",
      text: infomediaArticle?.logo?.match(/<p>(.*?)<\/p>/)?.[1],
    },
    pages: publicReviewData?.periodica?.pages,
    rating: publicReviewData?.rating,
  };
}

export default function Wrap() {
  const router = useRouter();
  const { workId, articleId } = router.query;
  const user = useUser();
  const { data, isLoading: isLoadingWork } = useData(
    workFragments.reviews({ workId })
  );
  const publicReviewData = data?.work?.workReviews?.find(
    (review) => review.infomediaId === articleId || review.pid === articleId
  );
  const { data: infomediaArticleData, isLoading: isLoadingInfomedia } = useData(
    user.isAuthenticated && articleId && infomediaArticle({ id: articleId })
  );

  const article = parseInfomediaArticle(
    publicReviewData,
    data?.work,
    infomediaArticleData?.infomedia?.article
  );

  return (
    <ReviewPage
      article={article}
      notFound={data && !publicReviewData}
      isLoading={isLoadingWork || isLoadingInfomedia}
      articleId={articleId}
    />
  );
}

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
Wrap.getInitialProps = (ctx) => {
  return fetchAll([], ctx);
};
