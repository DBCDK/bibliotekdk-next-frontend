import cx from "classnames";
import styles from "./BranchLocalizationItem.module.css";
import Text from "@/components/base/text/Text";
import LocalizationItemBase from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/LocalizationItemBase";
import { useSingleBranch } from "@/components/hooks/useHandleAgencyAccessData";
import BranchLocalizationItemStatus from "@/components/_modal/pages/branchLocalizations/branchLocalizationItem/branchLocalizationItemStatus/BranchLocalizationItemStatus";

const textProps = {
  className: cx(styles.text),
  clamp: true,
  lines: 2,
};

export default function BranchLocalizationItem({
  context,
  modal,
  branchId,
  pids,
}) {
  const { agenciesFlatSorted, agenciesIsLoading } = useSingleBranch({
    pids: pids,
    branchId: branchId,
  });

  const branch = agenciesFlatSorted?.[0]?.branches?.[0];

  const accumulatedAvailability = branch?.availabilityAccumulated;

  console.log("branch: ", branch);

  return (
    <LocalizationItemBase
      library={branch}
      itemLoading={agenciesIsLoading}
      modalPush={() =>
        modal.push("branchDetails", {
          ...context,
          title: branch?.branchName,
          pids: pids,
          branchId: branchId,
        })
      }
      accumulatedAvailability={accumulatedAvailability}
    >
      <Text {...textProps} type="text2">
        {branch?.branchName}
      </Text>
      <BranchLocalizationItemStatus library={branch} />
    </LocalizationItemBase>
  );
}
