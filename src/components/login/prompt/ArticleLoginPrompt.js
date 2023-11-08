import PropTypes from "prop-types";
import Translate from "@/components/base/translate";
import useUser from "@/components/hooks/useUser";
import { useModal } from "@/components/_modal";
import { LOGIN_MODE } from "@/components/_modal/pages/login/utils";
import { useData } from "@/lib/api/api";
import { infomediaArticle } from "@/lib/api/infomedia.fragments";
import LoginPrompt from "./Prompt";
import { openLoginModal } from "@/components/_modal/pages/login/utils";
import * as branchesFragments from "@/lib/api/branches.fragments";

/**
 * Prompt the user for log in / change library, when user is not granted access
 * to the article
 *
 */
export default function ArticleLoginPrompt({ articleId }) {
  const modal = useModal();
  const { authUser: user } = useUser();

  const hasInfomediaAccess = user?.rights?.infomedia;

  const { data, isLoading } = useData(
    hasInfomediaAccess && articleId && infomediaArticle({ id: articleId })
  );

  // Select the loggedInBranch from users agencies list
  let branch = {};
  user?.agencies?.forEach((agency) => {
    branch = agency?.result?.find(
      (branch) => branch.branchId === user.loggedInBranchId
    );
  });

  const agencyName = branch.agencyName || "";

  // Not logged in, no access
  if (!hasInfomediaAccess) {
    return (
      <LoginPrompt
        title={Translate({ context: "articles", label: "getAccess" })}
        description={Translate({
          context: "articles",
          label: "accessWarning",
        })}
        signIn={() => openLoginModal({ modal, mode: LOGIN_MODE.INFOMEDIA })}
      />
    );
  }

  // Logged in, library does not have access
  if (!isLoading && !data?.infomedia?.article) {
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
        buttonText={Translate({
          context: "order",
          label: "change-pickup-digital-copy-link",
        })}
        linkHref={linkHref}
        signIn={openLoginModal}
      />
    );
  }

  // All good, no login prompt needed
  return null;
}

ArticleLoginPrompt.propTypes = {
  articleId: PropTypes.string,
};
