import React from "react";
import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import { useData } from "@/lib/api/api";
import { fetchAll } from "@/lib/api/apiServerOnly";
import { infomediaArticle } from "@/lib/api/infomedia.fragments";
import useUser from "@/components/hooks/useUser";

import { dateToShortDate, numericToISO } from "@/utils/datetimeConverter";

import * as workFragments from "@/lib/api/work.fragments";

import {
  Content,
  ContentSkeleton,
} from "@/components/article/content/Content.js";

import ArticleLoginPrompt from "@/components/login/prompt/ArticleLoginPrompt";
import Custom404 from "@/pages/404";

export function ReviewPage(props) {
  const { article, notFound, isLoading, articleId } = props;

  const router = useRouter();

  return notFound ? (
    <Custom404 />
  ) : (
    <React.Fragment>
      <Header router={router} />
      {isLoading ? (
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
  // Review creation date
  // if signed in, use the dateLine
  // if public, use the hostPublication?.issue
  // fallbacks to prettify recordCreationDate
  const entityCreated =
    infomediaArticle?.dateLine ||
    dateToShortDate(
      publicReviewData?.hostPublication?.issue ||
        (publicReviewData?.recordCreationDate &&
          numericToISO(publicReviewData?.recordCreationDate)),
      "d. "
    );

  return {
    creators: publicReviewData?.creators,
    title: infomediaArticle?.headLine || work?.titles?.main?.[0],
    entityCreated,
    subHeadLine:
      infomediaArticle?.subHeadLine !== infomediaArticle?.headLine &&
      infomediaArticle?.subHeadLine,
    fieldRubrik: infomediaArticle?.hedLine,
    body: {
      value: infomediaArticle?.text,
    },
    paper: infomediaArticle?.paper || publicReviewData?.hostPublication?.title,
    category: work?.subjects?.dbcVerified
      ?.filter((subject) => subject.type === "TOPIC")
      .map((subject) => subject.display),
    deliveredBy: "Infomedia",
    disclaimer: {
      logo: "/infomedia_logo.svg",
      text: infomediaArticle?.logo?.match(/<p>(.*?)<\/p>/)?.[1],
    },
    pages: publicReviewData?.physicalDescriptions
      ?.map((d) => d.summary)
      ?.join(", "),
    rating: publicReviewData?.review?.rating,
  };
}

export default function Wrap() {
  const router = useRouter();
  const { workId, articleId } = router.query;
  const user = useUser();
  const {
    data,
    isLoading: isLoadingWork,
    error,
  } = useData(workFragments.reviews({ workId }));

  const publicReviewData = data?.work?.relations?.hasReview?.filter((el) =>
    el.access?.find((access) => access.id === articleId)
  );

  const { data: infomediaArticleData, isLoading: isLoadingInfomedia } = useData(
    user.isAuthenticated && articleId && infomediaArticle({ id: articleId })
  );

  const article = parseInfomediaArticle(
    publicReviewData?.[0],
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
