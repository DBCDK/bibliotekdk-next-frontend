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
import { branchesForUser } from "@/lib/api/user.fragments";
import { useModal } from "@/components/_modal";

export function InfomediaArticle(infomediaData) {
  const {
    publicInf: publicData,
    privateInf: privateData,
    agencies,
    rating,
    user,
    modal,
  } = infomediaData;

  const router = useRouter();
  const workPublic = publicData?.data?.work;
  const manifestationPublic = publicData?.data?.work?.manifestations?.[0];
  const hasArticle = privateData?.data?.infomediaContent?.length > 0;
  const agencyName = agencies?.data?.user?.agency?.result?.[0]?.agencyName;

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
                data={{ ...article, rating }}
              />
            );
          })}

          {!user.isAuthenticated && (
            <LoginPrompt
              title={Translate({ context: "articles", label: "getAccess" })}
              description={Translate({
                context: "articles",
                label: "accessWarning",
              })}
              signIn={() => modal.push("login")}
            />
          )}
          {user.isAuthenticated && workPublic && !hasArticle && (
            <LoginPrompt
              title={Translate({
                context: "articles",
                label: "libraryNoAccess",
                vars: [agencyName],
              })}
              description={Translate({
                context: "articles",
                label: "accessOpportunity",
              })}
              signIn={() => modal.push("login")}
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
  const article = privateData?.data?.infomediaContent;

  const returnArticles = [];
  let articleindex = 0;
  do {
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
      let currentArticle = article[articleindex];
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
  } while (article && article?.length > articleindex);

  return returnArticles;
}

function parseForPid(workId) {
  const parts = workId.split(":");
  return `${parts[1]}:${parts[2]}`;
}

export default function wrap() {
  const modal = useModal();
  const router = useRouter();
  const { workId, review: reviewPid } = router.query;
  const pid = reviewPid ? reviewPid : parseForPid(workId);

  const user = useUser();

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

  const infomediaPrivate = useData(
    user.isAuthenticated && workId && infomediaArticle({ pid })
  );
  const userAgencise = useData(user.isAuthenticated && branchesForUser());

  const infomediaData = {
    privateInf: infomediaPrivate,
    publicInf: infomediaPublic,
    agencies: userAgencise,
    rating: rating || null,
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
