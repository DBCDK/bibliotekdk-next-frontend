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

export function InfomediaArticle(infomediaData) {
  const {
    publicInf: publicData,
    privateInf: privateData,
    agencies,
    user,
  } = { ...infomediaData };

  const router = useRouter();
  const workPublic = publicData?.data?.work;
  const manifestationPublic = publicData?.data?.work?.manifestations?.[0];
  const article = privateData?.data?.infomediaContent[0];
  const agencyName = agencies?.data?.user?.agency?.result?.[0]?.agencyName;

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
      ) : publicData.isLoadingPublic || privateData.isLoadingPrivate ? (
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

function parseForPid(workId) {
  const parts = workId.split(":");
  return `${parts[1]}:${parts[2]}`;
}

export default function wrap() {
  const router = useRouter();
  const { workId } = router.query;
  const pid = parseForPid(workId);
  const user = useUser();

  const infomediaPublic = useData(
    workId && infomediaArticlePublicInfo({ workId })
  );
  const infomediaPrivate = useData(
    user.isAuthenticated && workId && infomediaArticle({ pid })
  );
  const userAgencise = useData(user.isAuthenticated && branchesForUser());

  const infomediaData = {
    privateInf: infomediaPrivate,
    publicInf: infomediaPublic,
    agencies: userAgencise,
    user,
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
