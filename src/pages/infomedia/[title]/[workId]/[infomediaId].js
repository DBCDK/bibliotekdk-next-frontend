import React from "react";
import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import { useData } from "@/lib/api/api";
import { fetchAll } from "@/lib/api/apiServerOnly";
import * as workFragments from "@/lib/api/work.fragments";
import * as infomediaFragments from "@/lib/api/infomedia.fragments";
import useUser from "@/components/hooks/useUser";

import {
  Content,
  ContentSkeleton,
} from "@/components/article/content/Content.js";

import ArticleLoginPrompt from "@/components/login/prompt/ArticleLoginPrompt";
import { timestampToShortDate } from "@/utils/datetimeConverter";
import Custom404 from "@/pages/404";

export function InfomediaArticle(props) {
  const { articleId, article, notFound, isLoading, noAccess } = props;

  const router = useRouter();

  return notFound ? (
    <Custom404 />
  ) : (
    <React.Fragment>
      <Header router={router} />
      {noAccess ? (
        <ArticleLoginPrompt articleId={articleId} />
      ) : notFound ? (
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
function parseInfomediaArticle(work, infomediaArticle) {
  const manifestation = work?.manifestations?.latest;
  return {
    creators: [
      {
        name: work?.creators?.[0]?.display,
      },
    ],
    title: infomediaArticle?.headLine || work?.titles?.main?.[0],
    entityCreated:
      infomediaArticle?.dateLine ||
      (manifestation?.hostPublication?.issue &&
        timestampToShortDate(manifestation?.hostPublication?.issue)),
    subHeadLine:
      infomediaArticle?.subHeadLine !== infomediaArticle?.headLine &&
      infomediaArticle?.subHeadLine,
    fieldRubrik: infomediaArticle?.hedLine,
    body: {
      value: infomediaArticle?.text,
    },
    paper: infomediaArticle?.paper || manifestation?.hostPublication?.title,
    category: work?.subjects?.dbcVerified
      ?.filter((subject) => subject.type === "TOPIC")
      .map((subject) => subject.display),
    deliveredBy: "Infomedia",
    disclaimer: {
      logo: "/infomedia_logo.svg",
      text: infomediaArticle?.logo?.match(/<p>(.*?)<\/p>/)?.[1],
    },
    pages: manifestation?.physicalDescriptions
      ?.map((d) => d.summary)
      ?.join(", "),
  };
}

export default function Wrap() {
  const router = useRouter();
  const { workId, infomediaId } = router.query;

  const user = useUser();

  const { data: infomediaPublicData, isLoading: isLoadingInfomediaPublic } =
    useData(workId && workFragments.infomediaArticlePublicInfo({ workId }));

  const { data: infomediaArticleData, isLoadingInfomedia } = useData(
    user.isAuthenticated &&
      infomediaId &&
      infomediaFragments.infomediaArticle({ id: infomediaId })
  );

  const article = parseInfomediaArticle(
    infomediaPublicData?.work,
    infomediaArticleData?.infomedia?.article
  );

  return (
    <InfomediaArticle
      article={article}
      notFound={
        (infomediaPublicData && !infomediaPublicData.work) ||
        (infomediaArticleData && !infomediaArticleData?.infomedia?.article)
      }
      noAccess={infomediaArticleData?.infomedia?.error === "BORROWER_NOT_FOUND"}
      isLoading={isLoadingInfomediaPublic || isLoadingInfomedia}
      articleId={infomediaId}
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
