import React, { memo } from "react";
import styles from "./BlockedUserInformation.module.css";
import * as branchesFragments from "@/lib/api/branches.fragments";
import { useData } from "@/lib/api/api";
import Skeleton from "@/components/base/skeleton";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import { useLoanerInfo } from "@/components/hooks/user/useLoanerInfo";

export const BlockedUserInformation = memo(function BlockedUserInformation({
  agencyName,
  branchOrAgencyUrl,
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
    <Text tag={"div"} className={styles.redBorder} dataCy={"blocked-user"}>
      <span>{titleText}</span>
      <br />
      {explanation}
      <br />
      <br />
      <Link
        dataCy={"blocked-user-link"}
        href={branchOrAgencyUrl}
        target={"_blank"}
        border={{ top: false, bottom: { keepVisible: true } }}
        disabled={!Boolean(branchOrAgencyUrl)}
        className={`${styles.underlineContainer__colors} ${styles.display_inline}`}
      >
        {url}
      </Link>
      &nbsp;
      {alternativeSolution}
    </Text>
  );
});

export default function Wrap() {
  const { loanerInfo } = useLoanerInfo();

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
      .filter((singleUserIsBlocked) => singleUserIsBlocked === true).length >
      0 || false;

  if (!blockedUser) {
    return null;
  }

  return (
    <BlockedUserInformation
      agencyName={branches?.result?.[0]?.agencyName}
      branchOrAgencyUrl={
        branches?.result?.[0]?.branchWebsiteUrl || branches?.agencyUrl
      }
    />
  );
}
