import PropTypes from "prop-types";
import Translate from "@/components/base/translate";
import { useModal } from "@/components/_modal";
import { LOGIN_MODE } from "@/components/_modal/pages/loanerform/LoanerForm";
import { useData } from "@/lib/api/api";
import { infomediaArticle } from "@/lib/api/infomedia.fragments";
import LoginPrompt from "./Prompt";
import * as branchesFragments from "@/lib/api/branches.fragments";
import { useAuthentication } from "@/components/hooks/user/useAuthentication";
import { useLoanerInfo } from "@/components/hooks/user/useLoanerInfo";

/**
 * Prompt the user for log in / change library, when user is not granted access
 * to the article
 *
 */
export default function ArticleLoginPrompt({ articleId }) {
  const { isAuthenticated, isLoggedIn } = useAuthentication();
  const { loanerInfo } = useLoanerInfo();
  const modal = useModal();
  const { data, isLoading } = useData(
    isAuthenticated && articleId && infomediaArticle({ id: articleId })
  );
  const pickupBranch = loanerInfo?.pickupBranch;

  const branchRes = useData(
    pickupBranch &&
      branchesFragments.branchUserParameters({ branchId: pickupBranch })
  );
  const agencyName = branchRes?.data?.branches?.result?.[0]?.agencyName || "";

  // Not logged in, no access
  if (!isLoggedIn) {
    return (
      <LoginPrompt
        title={Translate({ context: "articles", label: "getAccess" })}
        description={Translate({
          context: "articles",
          label: "accessWarning",
        })}
        signIn={() => modal.push("login", { mode: LOGIN_MODE.INFOMEDIA })}
      />
    );
  }

  // Logged in, library does not have access
  if (!isLoading && !data?.infomedia?.article) {
    const linkHref = {
      href: "https://slks.dk/soeg?q=danske+biblioteker",
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
          label: "accessOpportunity2",
        })}
        buttonText={Translate({
          context: "order",
          label: "change-pickup-digital-copy-link",
        })}
        linkHref={linkHref}
        signIn={() => modal.push("login", { mode: LOGIN_MODE.INFOMEDIA })}
      />
    );
  }

  // All good, no login prompt needed
  return null;
}
ArticleLoginPrompt.propTypes = {
  articleId: PropTypes.string,
};
