import PropTypes from "prop-types";
import Translate from "@/components/base/translate";
import { useModal } from "@/components/_modal";
import { LOGIN_MODE } from "@/components/_modal/pages/login/utils";
import { useData } from "@/lib/api/api";
import { infomediaArticle } from "@/lib/api/infomedia.fragments";
import LoginPrompt from "./Prompt";
import { openLoginModal } from "@/components/_modal/pages/login/utils";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import useAuthentication from "@/components/hooks/user/useAuthentication";

/**
 * Prompt the user for log in when not authenticated or
 * to explains how to obtain access, when user is not granted access
 * to the article
 *
 */
export default function ArticleLoginPrompt({ articleId }) {
  const { loanerInfo } = useLoanerInfo();
  const { isAuthenticated, loggedInAgencyId } = useAuthentication();
  const modal = useModal();
  const hasInfomediaAccess = loanerInfo?.rights?.infomedia;

  const { data, isLoading } = useData(
    isAuthenticated && articleId && infomediaArticle({ id: articleId })
  );

  // Select the loggedInBranch from users agencies list
  let branch = {};
  loanerInfo?.agencies?.forEach((agency) => {
    branch = agency?.result?.find(
      (branch) => branch.agencyId === loggedInAgencyId
    );
  });

  // Not logged in, no access
  const agencyName = branch?.agencyName || "";

  //NOT AUTHENTICATED --> Show login button and reminder that not all libraries give access to infomedia
  if (!isAuthenticated) {
    return (
      <LoginPrompt
        title={Translate({ context: "articles", label: "getAccess" })}
        description={Translate({
          context: "articles",
          label: "accessWarning",
        })}
        signIn={() => openLoginModal({ modal, mode: LOGIN_MODE.INFOMEDIA })}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  //AUTHENTICATED AND NO ACCESS either because, we couldnt fetch article (shoudl we show error instead?)
  // OR bc user doesnt have access rights
  // --> Show library name and explain how to obtain access
  if (!isLoading && (!data?.infomedia?.article || !hasInfomediaAccess)) {
    const linkHref = {
      href: "https://slks.dk/omraader/kulturinstitutioner/biblioteker",
      text: Translate({ context: "articles", label: "libraryAccessReadMore" }),
    };
    return (
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
        description2={Translate({
          context: "articles",
          label: "accessOpportunity3",
        })}
        linkHref={linkHref}
        signIn={openLoginModal}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  // All good, no login prompt needed
  return null;
}

ArticleLoginPrompt.propTypes = {
  articleId: PropTypes.string,
};
