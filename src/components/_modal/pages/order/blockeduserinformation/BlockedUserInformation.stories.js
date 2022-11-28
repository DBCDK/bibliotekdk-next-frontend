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
      agencyUrl={"balleripsrapsrups.dekå"}
    />
  );
}
