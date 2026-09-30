import React from "react";
import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import { useData } from "@/lib/api/api";
import { fetchAll } from "@/lib/api/apiServerOnly";
import * as workFragments from "@/lib/api/work.fragments";
import * as retrieverFragments from "@/lib/api/retriever.fragments";

import {
  Content,
  ContentSkeleton,
} from "@/components/article/content/Content.js";

import ArticleLoginPrompt from "@/components/login/prompt/ArticleLoginPrompt";
import { timestampToShortDate } from "@/utils/datetimeConverter";
import Error from "next/error";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

export function RetrieverArticle(props) {
  const { articleId, article, notFound, isLoading } = props;

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
          <Content data={{ article }} renderHtml={true} />

          <ArticleLoginPrompt articleId={articleId} />
        </>
      )}
    </React.Fragment>
  );
}

/**
 * Parse work/article data to a format the Content component likes
 */
function parseRetrieverArticle(work, retrieverArticle = {}) {
  const manifestation = work?.manifestations?.latest;
  return {
    creators: work?.creators?.map((creator) => {
      return { name: creator?.display };
    }),
    title: retrieverArticle?.headline || work?.titles?.main?.[0],
    entityCreated:
      timestampToShortDate(retrieverArticle?.publishingDate) ||
      (manifestation?.hostPublication?.issue &&
        timestampToShortDate(manifestation?.hostPublication?.issue)),
    subHeadLine:
      retrieverArticle?.subHeadline !== retrieverArticle?.headline &&
      retrieverArticle?.subHeadline,
    fieldRubrik: work?.abstract,
    body: {
      value: retrieverArticle?.fullTextHtml,
    },
    paper:
      retrieverArticle?.sourceName || manifestation?.hostPublication?.title,
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
      manifestation?.physicalDescription?.summaryFull,
  };
}

export default function Wrap() {
  const router = useRouter();
  const { workId, retrieverId } = router.query;
  const { loanerInfo } = useLoanerInfo();

  const hasRetrieverAccess = loanerInfo?.rights?.infomedia;

  const { data: retrieverPublicData, isLoading: isLoadingRetrieverPublic } =
    useData(workId && workFragments.retrieverArticlePublicInfo({ workId }));

  const { data: retrieverArticleData, isLoading: isLoadingRetriever } = useData(
    hasRetrieverAccess &&
      retrieverId &&
      retrieverFragments.retrieverArticle({ id: retrieverId })
  );

  const article = parseRetrieverArticle(
    retrieverPublicData?.work,
    retrieverArticleData?.retriever?.article
  );

  return (
    <RetrieverArticle
      article={article}
      notFound={retrieverPublicData && !retrieverPublicData.work}
      isLoading={isLoadingRetrieverPublic || isLoadingRetriever}
      articleId={retrieverId}
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
