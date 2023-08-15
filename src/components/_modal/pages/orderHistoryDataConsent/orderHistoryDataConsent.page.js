import Title from "@/components/base/title";
import Text from "@/components/base/text";
import styles from "./orderHistoryDataConsent.module.css";
import Button from "@/components/base/button";
import Top from "@/components/_modal/pages/base/top";

export function OrderHistoryDataConsent({ modal, context, active }) {
  return (
    <div className={styles.modalContainer}>
      <Top />

      <div className={styles.contentContainer}>
        <Title className={styles.modalTitle} type="title4">
          Opsamling af data{" "}
        </Title>

        <Text>
          Vil du give tilladelse til at bibliotek.dk må indsamle data om dine
          bestillinger, lån og adfærd på hjemmesiden?{" "}
        </Text>
        <Text>
          Den opsamlede data vil blive benyttet til at lave bestillingshistorik
          og personlige anbefalinger til dig.{" "}
        </Text>
        <Text>
          Bestillingshistorikken viser kun bestillinger fra den dato, funktionen
          bliver aktiveret.
        </Text>
        <Text>
          Dine data bliver opbevaret af bibliotekerne og bliver kun benyttet af
          bibliotekerne. Det vil sige, at de udleveres aldrig til tredjepart.
        </Text>
        <Button className={styles.consentButton} size="large" type="primary">
          Giv tilladelse
        </Button>
        <Button className={styles.goBackButton} size="large" type="secondary">
          Tilbage
        </Button>
      </div>
    </div>
  );
}

export default OrderHistoryDataConsent;
