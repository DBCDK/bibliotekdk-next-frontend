/**
 * @file OrderHistoryDataConsent is shown on orerhistory page in /profile
 */
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import styles from "./OrderHistoryDataConsent.module.css";
import Button from "@/components/base/button";
import Top from "@/components/_modal/pages/base/top";
import Translate from "@/components/base/translate/Translate";
import { setPersistUserDataValue } from "@/lib/api/userData.mutations";
import { useMutate } from "@/lib/api/api";
import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import useUser from "@/components/hooks/useUser";
import { useEffect, useState } from "react";

/**
 * This modal is used to change the users consent on storing orderhistory data for more than 30 days.
 * @returns {component}
 */
export function OrderHistoryDataConsent({ modal }) {
  const userDataMutation = useMutate();
  const { isAuthenticated } = useUser();
  const { data: userData } = useData(
    isAuthenticated && userFragments.extendedData()
  );
  const [persistUserData, setPersistUserData] = useState(
    !!userData?.user?.persistUserData
  );

  useEffect(() => {
    setPersistUserData(!!userData?.user?.persistUserData);
  }, [userData?.user?.persistUserData]);

  return (
    <div className={styles.modalContainer}>
      <Top />

      <div>
        <Title className={styles.modalTitle} type="title4">
          {persistUserData
            ? Translate({
                context: "profile",
                label: "updateDataCollectionConsent",
              })
            : Translate({ context: "profile", label: "dataCollectionTitle" })}
        </Title>

        <Text className={styles.permissionText}>
          {persistUserData
            ? Translate({ context: "profile", label: "revokeConsentText" })
            : Translate({ context: "profile", label: "permissionText" })}
        </Text>

        <Button
          className={styles.consentButton}
          size="large"
          type="primary"
          onClick={() => {
            setPersistUserDataValue({
              persistUserData: !persistUserData,
              userDataMutation,
            });
            modal.clear();
          }}
        >
          {persistUserData
            ? Translate({ context: "profile", label: "revokeConsent" })
            : Translate({ context: "profile", label: "consentButton" })}
        </Button>
        <Button
          className={styles.goBackButton}
          onClick={() => modal.clear()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.keyCode === 13) {
              modal.clear();
            }
          }}
          size="large"
          type="secondary"
        >
          {Translate({ context: "profile", label: "goBackButton" })}
        </Button>
      </div>
    </div>
  );
}

export default OrderHistoryDataConsent;
