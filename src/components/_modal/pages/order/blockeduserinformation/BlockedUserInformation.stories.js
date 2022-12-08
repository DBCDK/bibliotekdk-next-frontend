import React from "react";
import { BlockedUserInformation as NamedBlockedUserInformation } from "./BlockedUserInformation";

const exportedObject = {
  title: "modal/Order/BlockedUserInformation",
};

export default exportedObject;

export function BlockedUser() {
  return (
    <NamedBlockedUserInformation
      agencyName={"BalleRipRapRups biblioteker"}
      branchOrAgencyUrl={"balleripsrapsrups.dekå"}
    />
  );
}

export function BlockedUserKK() {
  return (
    <NamedBlockedUserInformation
      agencyName={"Københavns Biblioteker"}
      branchOrAgencyUrl={"http://bibliotek.kk.dk/"}
    />
  );
}
export function BlockedUserNoBranchOrAgencyUrl() {
  return (
    <NamedBlockedUserInformation
      agencyName={"BalleRipRapRups biblioteker"}
      branchOrAgencyUrl={""}
    />
  );
}
