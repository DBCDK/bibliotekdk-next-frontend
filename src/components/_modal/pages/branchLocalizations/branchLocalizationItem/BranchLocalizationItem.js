import cx from "classnames";
import styles from "./BranchLocalizationItem.module.css";
import Text from "@/components/base/text/Text";
import LocalizationItemBase from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/LocalizationItemBase";
import { AvailabilityEnum } from "@/components/hooks/useAgencyAccessFactory";

const textProps = {
  className: cx(styles.text),
  clamp: true,
  lines: 2,
};

export default function BranchLocalizationItem({
  context,
  branch,
  query,
  modal,
}) {
  return (
    <LocalizationItemBase
      library={branch}
      modalPush={() =>
        modal.push("branchDetails", {
          ...context,
          title: branch?.branchName,
          libraries: branch,
        })
      }
    >
      <Text {...textProps} type="text2">
        {branch?.branchName}
      </Text>
      <Text {...textProps}>
        Hjemme på {branch?.availability[AvailabilityEnum.NOW]}
      </Text>
      <Text {...textProps}>
        Væk på {branch?.availability[AvailabilityEnum.LATER]}
      </Text>
      <Text {...textProps}>
        Mærkelig på {branch?.availability[AvailabilityEnum.UNKNOWN]}
      </Text>
    </LocalizationItemBase>
  );
}
