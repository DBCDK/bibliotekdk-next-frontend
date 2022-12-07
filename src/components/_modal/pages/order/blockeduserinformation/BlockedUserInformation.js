import React, { memo } from "react";
import styles from "./BlockedUserInformation.module.css";
import * as branchesFragments from "@/lib/api/branches.fragments";
import useUser from "@/components/hooks/useUser";
import { useData } from "@/lib/api/api";
import Skeleton from "@/components/base/skeleton";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";

export const BlockedUserInformation = memo(function BlockedUserInformation({
  agencyName,
  agencyUrl,
}) {
  const titleText = Translate({
    context: "order",
    label: "blocked-user-heading",
  });
  const explanation = Translate({
    context: "order",
    label: "blocked-user-explanation",
  });
  const url = Translate({
    context: "order",
    label: "blocked-user-link",
    vars: [agencyName],
  });
  const alternativeSolution = Translate({
    context: "order",
    label: "blocked-user-alternative-solution",
  });

  return (
    <div className={styles.varContainer}>
      <Text tag={"div"} className={styles.redBorder} dataCy={"blocked-user"}>
        <span>{titleText}</span>
        <br />
        {explanation}
        <br />
        <br />
        <a
          className={styles.blockedLink}
          data-cy={"blocked-user-link"}
          href={agencyUrl}
          target={"_blank"}
          rel={"noreferrer"}
        >
          {url}
        </a>
        &nbsp;
        {alternativeSolution}
      </Text>
    </div>
  );
});

export default function Wrap() {
  const { authUser, loanerInfo, isAuthenticated, isGuestUser, isLoggedIn } =
    useUser();

  const blockedUserResponse = useData(
    loanerInfo?.pickupBranch &&
      branchesFragments.checkBlockedUser({ branchId: loanerInfo.pickupBranch })
  );

  const branches = blockedUserResponse?.data?.branches;

  if (blockedUserResponse?.isLoading) {
    return <Skeleton lines={2} isSlow={blockedUserResponse?.isSlow} />;
  }

  const blockedUser =
    branches?.result
      ?.map((res) => res.userIsBlocked)
      .filter((singleUserIsBlocked) => singleUserIsBlocked === true).length > 0;

  if (
    !blockedUser ||
    !authUser ||
    isGuestUser ||
    !isAuthenticated ||
    !isLoggedIn
  ) {
    return null;
  }

  return (
    <BlockedUserInformation
      agencyName={branches?.result?.[0]?.agencyName}
      agencyUrl={branches?.agencyUrl}
    />
  );
}
