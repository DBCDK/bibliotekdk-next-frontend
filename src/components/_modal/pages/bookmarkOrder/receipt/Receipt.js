import Icon from "@/components/base/icon";
import styles from "./Receipt.module.css";
import Button from "@/components/base/button";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { useModal } from "@/components/_modal/Modal";
import cx from "classnames";

const Receipt = ({ context }) => {
  const modal = useModal();
  const { successMaterials, failedMaterials } = context;
  const hasErrors = failedMaterials.length > 0;
  const branchName = "ADDRESSE";

  return (
    <div className={cx(styles.receipt, { [styles.errorReceipt]: hasErrors })}>
      {!hasErrors && (
        <div className={styles.check}>
          <Icon size={3} src="check.svg" />
        </div>
      )}

      <Title className={styles.title} type="title4" tag="h2">
        {hasErrors
          ? "Bestillingsoversigt"
          : Translate({ context: "order", label: "order-success" })}
      </Title>

      <Icon
        className={styles.ornament}
        size={{ w: 6, h: "auto" }}
        src={"ornament1.svg"}
      />

      {hasErrors && (
        <Text type="text2" className={styles.successMessage}>
          {successMaterials.length} materialer er bestilt.
        </Text>
      )}

      <Text type="text2" className={cx({ [styles.message]: !hasErrors })}>
        {Translate({
          context: "order",
          label: "order-success-message",
          vars: [branchName],
          renderAsHtml: true,
        })}
      </Text>

      {hasErrors && (
        <Text type="text1" className={styles.errorMessage}>
          {failedMaterials.length} materialer kunne ikke bestilles!
        </Text>
      )}

      {/* Card List */}

      <Button
        type="primary"
        size="large"
        className={styles.close}
        onClick={() => modal.clear()}
      >
        Luk
      </Button>
      <Button type="secondary" size="large" className={styles.redirect}>
        Gå til bestillingshistorik
      </Button>
    </div>
  );
};

export default Receipt;
