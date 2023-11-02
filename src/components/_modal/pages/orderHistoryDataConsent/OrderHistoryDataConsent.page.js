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
import { useEffect } from "react";

/**
 * This modal is used to change the users consent on storing orderhistory data for more than 30 days.
 * @returns {React.JSX.Element}
 */
export function OrderHistoryDataConsent({ modal }) {
  const userDataMutation = useMutate();
  const { hasCulrUniqueId } = useUser();
  const { data: userData, mutate } = useData(
    hasCulrUniqueId && userFragments.extendedData()
  );

  const persistUserData = !!userData?.user?.persistUserData;

  useEffect(() => {
    if (modal.isVisible) {
      mutate();
    }
  }, [modal.isVisible]);
  return (
    <div className={styles.modalContainer}>
      <Top />

      <div>
        <Title className={styles.modalTitle} type="title4">
          {Translate({
            context: "profile",
            label: persistUserData
              ? "updateDataCollectionConsent"
              : "dataCollectionTitle",
          })}
        </Title>

        <Text className={styles.permissionText}>
          {Translate({
            context: "profile",
            label: persistUserData ? "revokeConsentText" : "permissionText",
          })}
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
          {Translate({
            context: "profile",
            label: persistUserData ? "revokeConsent" : "consentButton",
          })}
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
