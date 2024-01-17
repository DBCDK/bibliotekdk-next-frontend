import Icon from "@/components/base/icon";
import styles from "./Receipt.module.css";
import Button from "@/components/base/button";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { useModal } from "@/components/_modal/Modal";
import cx from "classnames";
import Material from "../multi-order/Material/Material";
import { BackgroundColorEnum } from "@/components/base/materialcard/materialCard.utils";
import { useRouter } from "next/router";
import useAuthentication from "@/components/hooks/user/useAuthentication";

const MultiOrderReceipt = ({ context }) => {
  const modal = useModal();
  const { hasCulrUniqueId } = useAuthentication();
  const { successMaterials, failedMaterials, branchName } = context;
  const hasErrors = failedMaterials.length > 0;
  const hasSuccess = successMaterials.length > 0;
  const router = useRouter();

  return (
    <div className={cx(styles.receipt, { [styles.errorReceipt]: hasErrors })}>
      {!hasErrors && (
        <div className={styles.check}>
          <Icon size={3} src="check.svg" />
        </div>
      )}
      <Title className={styles.title} type="title4" tag="h2">
        {hasErrors
          ? Translate({ context: "bookmark-order", label: "order-overview" })
          : Translate({ context: "order", label: "order-success" })}
      </Title>
      <Icon
        className={styles.ornament}
        size={{ w: 6, h: "auto" }}
        src={"ornament1.svg"}
      />
      {hasErrors && hasSuccess && (
        <Text type="text2" className={styles.successMessage}>
          {successMaterials.length === 1 ? (
            <Translate
              context="bookmark-order"
              label="is-ordered-singular"
              vars={[successMaterials.length]}
            />
          ) : (
            <Translate
              context="bookmark-order"
              label="is-ordered"
              vars={[successMaterials.length]}
            />
          )}
        </Text>
      )}
      {hasSuccess && (
        <Text type="text2" className={cx({ [styles.message]: !hasErrors })}>
          <Translate
            context="order"
            label="order-success-message"
            vars={[`<br/> ${branchName}`]}
            renderAsHtml
          />
        </Text>
      )}
      {hasErrors && (
        <>
          <Text type="text1" className={styles.errorMessage}>
            {failedMaterials?.length === 1 ? (
              <Translate
                context="bookmark-order"
                label="multiorder-couldnt-order-singular"
                vars={[failedMaterials.length]}
              />
            ) : (
              <Translate
                context="bookmark-order"
                label="multiorder-couldnt-order"
                vars={[failedMaterials.length]}
              />
            )}
          </Text>

          <div className={styles.materialList}>
            {failedMaterials?.map((material) => (
              <Material
                key={material.key}
                material={material}
                backgroundColorOverride={BackgroundColorEnum.RED}
                showActions={false}
              />
            ))}
          </div>
        </>
      )}
      {hasCulrUniqueId && (
        <Button
          className={styles.redirect}
          onClick={() => router.push("/profil/bestillingshistorik")}
          type="secondary"
        >
          {Translate({
            context: "receipt",
            label: "go-to-your-orders",
          })}
        </Button>
      )}
      <Button
        className={styles.close}
        onClick={() => modal.clear()}
        dataCy="multiorder-button-close"
      >
        {Translate({ context: "general", label: "close" })}
      </Button>
    </div>
  );
};

export default MultiOrderReceipt;
