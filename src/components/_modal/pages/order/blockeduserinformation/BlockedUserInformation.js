import React, { memo } from "react";
import styles from "./BlockedUserInformation.module.css";
import * as branchesFragments from "@/lib/api/branches.fragments";
import useUser from "@/components/hooks/useUser";
import { useData } from "@/lib/api/api";
import Skeleton from "@/components/base/skeleton";
import Text from "@/components/base/text/Text";
import BodyParser from "@/components/base/bodyparser";
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

  const body = `<p>
      <b>${titleText}</b>
      <br/>
      ${explanation}
      <br />
      <br />
      <a
        data-cy={"blocked-user-link"}
        href=${agencyUrl}
        target={"_blank"}
        rel={"noreferrer"}
      >
        ${url}
      </a>
      <span />
      ${alternativeSolution}
  </p>`;

  return (
    <Text tag={"div"} className={styles.redBorder} dataCy={"blocked-user"}>
      <BodyParser body={body} />
    </Text>
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

  const userNotLoggedIn = branches?.result?.every((res) => {
    return res.userIsBlocked === null;
  });

  if (
    !blockedUser ||
    userNotLoggedIn ||
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
