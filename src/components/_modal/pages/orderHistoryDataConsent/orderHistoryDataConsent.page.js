import Title from "@/components/base/title";
import Text from "@/components/base/text";
import styles from "./OrderHistoryDataConsent.module.css";
import Button from "@/components/base/button";
import Top from "@/components/_modal/pages/base/top";
import Translate from "@/components/base/translate/Translate";

export function OrderHistoryDataConsent({ modal }) {
  return (
    <div className={styles.modalContainer}>
      <Top />

      <div className={styles.contentContainer}>
        <Title className={styles.modalTitle} type="title4">
          {Translate({ context: "profile", label: "dataCollectionTitle" })}
        </Title>

        <Text className={styles.permissionText}>
          {Translate({ context: "profile", label: "permissionText" })}
        </Text>

        <Button className={styles.consentButton} size="large" type="primary">
          {Translate({ context: "profile", label: "consentButton" })}
        </Button>
        <Button
          className={styles.goBackButton}
          onClick={() => {
            console.log("hej", modal);
            modal.clear();
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
