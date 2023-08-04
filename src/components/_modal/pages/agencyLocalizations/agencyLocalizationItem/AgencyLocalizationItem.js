import cx from "classnames";
import styles from "./AgencyLocalizationItem.module.css";
import Text from "@/components/base/text/Text";
import LocalizationItemBase from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/LocalizationItemBase";
import { AvailabilityEnum } from "@/components/hooks/useAgencyAccessFactory";

const textProps = {
  className: cx(styles.text),
  clamp: true,
  lines: 2,
};

export default function AgencyLocalizationItem({
  context,
  agency,
  query,
  modal,
}) {
  return (
    <LocalizationItemBase
      library={agency}
      query={query}
      modalPush={() =>
        modal.push("branchLocalizations", {
          ...context,
          title: agency?.agencyName,
          libraries: agency,
        })
      }
    >
      <Text {...textProps} type="text2">
        {agency?.agencyName}
      </Text>
      <Text {...textProps}>
        Hjemme på {agency?.availability[AvailabilityEnum.NOW]}
      </Text>
      <Text {...textProps}>
        Væk på {agency?.availability[AvailabilityEnum.LATER]}
      </Text>
      <Text {...textProps}>
        Mærkelig på {agency?.availability[AvailabilityEnum.UNKNOWN]}
      </Text>
      {/*<Text className={styles.text} clamp={true} lines={2}>*/}
      {/*  AgencyId: {agency?.agencyId}*/}
      {/*</Text>*/}
      {/*<Text className={styles.text} clamp={true} lines={2}>*/}
      {/*  ExpectedDelivery: {agency?.expectedDelivery}*/}
      {/*</Text>*/}
      {/*<Text className={styles.text} clamp={true} lines={2}>*/}
      {/*  AvailabilityAccumulated: {agency?.availabilityAccumulated}*/}
      {/*</Text>*/}
      {/*<Text className={styles.text} clamp={true} lines={2}>*/}
      {/*  AvailabilityAccumulatedAvailabilityAccumulatedA*/}
      {/*  vailabilityAccumulatedAvailabilityAccumulated:{" "}*/}
      {/*  {agency?.availabilityAccumulated}*/}
      {/*</Text>*/}
      {/*<Text>Availability: {JSON.stringify(agency?.availability)}</Text>*/}
    </LocalizationItemBase>
  );
}
