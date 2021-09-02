import { useRouter } from "next/router";
import { signIn } from "@dbcdk/login-nextjs/client";
import Error from "next/error";
import Header from "@/components/header/Header";
import { fetchAll, useData } from "@/lib/api/api";
import { infomediaArticlePublicInfo } from "@/lib/api/work.fragments";
import { infomediaArticle } from "@/lib/api/infomedia.fragments";
import useUser from "@/components/hooks/useUser";

import {
  Content,
  ContentSkeleton,
} from "@/components/article/content/Content.js";

import Translate from "@/components/base/translate";

import LoginPrompt from "@/components/login/prompt";
import { branchesForUser } from "@/lib/api/user.fragments";

export default function InfomediaArticle() {
  const router = useRouter();
  const { workId } = router.query;

  const user = useUser();

  const { data: publicData, isLoading: isLoadingPublic } = useData(
    workId && infomediaArticlePublicInfo({ workId })
  );
  const { data: privateData, error, isLoading: isLoadingPrivate } = useData(
    user.isAuthenticated && workId && infomediaArticle({ workId })
  );
  const { data: userData } = useData(user.isAuthenticated && branchesForUser());

  const workPublic = publicData?.work;
  const manifestationPublic = publicData?.work?.manifestations?.[0];
  const article = privateData?.work?.manifestations?.[0].onlineAccess?.find(
    (article) => article.origin === "infomedia"
  );
  const agencyName = userData?.user?.agency?.[0]?.agencyName;

  // Set the public fields to be shown when not logged in/no access
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
    parsed.article = {
      ...parsed.article,
      subHeadLine:
        article?.subHeadLine !== article?.headLine && article?.subHeadLine,
      fieldRubrik: article?.hedLine,
      body: {
        value: article?.text,
      },
      paper: article?.paper,
      disclaimer: {
        logo: "/infomedia_logo.svg",
        text: article?.logo,
      },
    };
  }

  return (
    <React.Fragment>
      <Header router={router} />
      {workPublic === null ? (
        <Error statusCode={404} />
      ) : isLoadingPublic || isLoadingPrivate ? (
        <ContentSkeleton />
      ) : (
        <>
          <Content data={parsed} />
          {!user.isAuthenticated && (
            <LoginPrompt
              title={Translate({ context: "articles", label: "getAccess" })}
              description={Translate({
                context: "articles",
                label: "accessWarning",
              })}
              signIn={signIn}
            />
          )}
          {user.isAuthenticated && workPublic && !article && (
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
              signIn={signIn}
            />
          )}
        </>
      )}
    </React.Fragment>
  );
}

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
InfomediaArticle.getInitialProps = (ctx) => {
  return fetchAll([], ctx);
};
