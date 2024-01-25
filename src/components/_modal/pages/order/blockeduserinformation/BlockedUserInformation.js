import React, { memo } from "react";
import styles from "./BlockedUserInformation.module.css";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";

export const BlockedUserInformation = memo(function BlockedUserInformation({
  agencyName,
  branchOrAgencyUrl,
  explanation,
}) {
  const titleText = Translate({
    context: "order",
    label: "blocked-user-heading",
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

function translateStatusCode(statusCode) {
  let label;
  switch (statusCode) {
    case "BORCHK_USER_BLOCKED_BY_AGENCY":
      label = "blocked-user-explanation";
      break;
    case "UNKNOWN_USER":
      label = "unknown-user-explanation";
      break;
    case "BORCHK_USER_NO_LONGER_EXIST_ON_AGENCY":
      label = "user-no-longer-exists-on-agency";
      break;
    default:
      return statusCode;
  }
  return Translate({
    context: "order",
    label: label,
  });
}

export default function Wrap({ statusCode, branches }) {
  if (!branches) {
    return null;
  }

  let explanation;
  explanation = translateStatusCode(statusCode);

  return (
    <BlockedUserInformation
      agencyName={branches?.result?.[0]?.agencyName}
      branchOrAgencyUrl={
        branches?.result?.[0]?.branchWebsiteUrl || branches?.agencyUrl
      }
      explanation={explanation}
    />
  );
}
