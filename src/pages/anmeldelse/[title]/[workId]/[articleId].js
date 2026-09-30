import React from "react";
import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import { useData } from "@/lib/api/api";
import { fetchAll } from "@/lib/api/apiServerOnly";
import { retrieverArticle } from "@/lib/api/retriever.fragments";

import {
  dateToShortDate,
  numericToISO,
  timestampToShortDate,
} from "@/utils/datetimeConverter";

import * as workFragments from "@/lib/api/work.fragments";

import {
  Content,
  ContentSkeleton,
} from "@/components/article/content/Content.js";

import ArticleLoginPrompt from "@/components/login/prompt/ArticleLoginPrompt";
import Custom404 from "@/pages/404";
import { manifestationForLectorReview } from "@/lib/api/manifestation.fragments";
import LectorReviewPage from "@/components/article/lectorreview/LectorReviewPage";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

export function ReviewPage(props) {
  const { article, notFound, isLoading, articleId, material } = props;

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
          {article && (
            <>
              <Content
                data={{ article }}
                backToMaterial={material}
                renderHtml={true}
              />
            </>
          )}

          <ArticleLoginPrompt articleId={articleId} />
        </>
      )}
    </React.Fragment>
  );
}

/**
 * Parse work/article data to a format the Content component likes
 */
function parseRetrieverArticle(publicReviewData, work, retrieverArticle) {
  // Review creation date
  // if signed in, use the publishingDate
  // if public, use the hostPublication?.issue
  // fallbacks to prettify recordCreationDate
  const entityCreated =
    timestampToShortDate(retrieverArticle?.publishingDate) ||
    dateToShortDate(
      publicReviewData?.hostPublication?.issue ||
        (publicReviewData?.recordCreationDate &&
          numericToISO(publicReviewData?.recordCreationDate)),
      "d. "
    );

  return {
    creators: publicReviewData?.creators?.map((creator) => {
      return { name: creator?.display };
    }),
    title: retrieverArticle?.headline || work?.titles?.main?.[0],
    entityCreated,
    subHeadLine:
      retrieverArticle?.subHeadline !== retrieverArticle?.headline &&
      retrieverArticle?.subHeadline,
    body: {
      value: retrieverArticle?.fullTextHtml,
    },
    paper:
      retrieverArticle?.sourceName || publicReviewData?.hostPublication?.title,
    category: work?.subjects?.dbcVerified
      ?.filter((subject) => subject.type === "TOPIC")
      ?.filter((subject) => subject?.language?.isoCode === "dan")
      .map((subject) => subject.display),
    deliveredBy: "Retriever",
    disclaimer: {
      logo: "/retriever.png",
    },
    pages:
      retrieverArticle?.pages ||
      publicReviewData?.physicalDescription?.summaryFull,
    rating: publicReviewData?.review?.rating,
  };
}

export default function Wrap() {
  const router = useRouter();
  const { workId, articleId } = router.query;
  const { loanerInfo } = useLoanerInfo();

  const { data, isLoading: isLoadingWork } = useData(
    workId && workFragments.reviews({ workId })
  );

  const publicReviewData = data?.work?.relations?.hasReview?.filter((el) =>
    el.access?.find((access) => access.id === articleId)
  );

  const {
    data: lectorReviewData,
    isLoading: lectorReviewIsLoading,
    error: lectorReviewError,
  } = useData(articleId && manifestationForLectorReview({ pid: articleId }));

  const hasRetrieverAccess = loanerInfo?.rights?.infomedia;

  const {
    data: retrieverArticleData,
    isLoading: isLoadingRetriever,
    error: retrieverError,
  } = useData(
    hasRetrieverAccess && articleId && retrieverArticle({ id: articleId })
  );

  const article = parseRetrieverArticle(
    publicReviewData?.[0],
    data?.work,
    retrieverArticleData?.retriever?.article
  );

  if (lectorReviewError && retrieverError) {
    return <Custom404 />;
  }

  if (lectorReviewIsLoading || isLoadingWork || isLoadingRetriever) {
    return <ContentSkeleton></ContentSkeleton>;
  }

  if (lectorReviewData?.manifestation) {
    return (
      <LectorReviewPage
        workId={workId}
        review={lectorReviewData.manifestation}
      />
    );
  }

  // make a heading for retriever articles - just like librarians reviews
  const material = {
    pid: publicReviewData?.[0]?.pid,
    titles: { full: data?.work?.titles?.main },
    materialTypes: data?.work?.materialTypes,
    creators: data?.work?.creators,
    ownerWork: { workId: data?.work?.workId },
  };

  return (
    <ReviewPage
      material={material}
      article={article}
      notFound={data && !publicReviewData}
      isLoading={isLoadingWork || isLoadingRetriever}
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
