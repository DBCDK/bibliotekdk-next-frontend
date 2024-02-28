import Text from "@/components/base/text";
import Top from "../../base/top/Top";
import Button from "@/components/base/button";
import styles from "./EMaterialFilter.module.css";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import { useModal } from "@/components/_modal/Modal";
import { getMaterialTypeForPresentation } from "@/lib/manifestationFactoryUtils";
import {
  useMultiOrderValidation,
  useOrderFlow,
} from "@/components/hooks/order";
import MultiOrder from "../multi-order/MultiOrder.page";
const CONTEXT = "bookmark-order";
const SKELETON_ROW_AMOUNT = 3;

/**
 * Shows all the materials that are available online and therefor cannot be ordered
 * Skips this step if nothing to filter
 */
const EMaterialFilter = () => {
  const { initialOrders, setOrders } = useOrderFlow();

  const { validatedOrders } = useMultiOrderValidation({
    orders: initialOrders,
  });

  const loadedOrders = validatedOrders?.filter(
    (entry) =>
      entry?.manifestationAccess?.isLoading === false &&
      entry?.materialData?.isLoading === false
  );
  const unsupportedMaterials = loadedOrders?.filter(
    (entry) =>
      !entry?.manifestationAccess?.hasDigitalCopy &&
      !entry?.manifestationAccess?.hasPhysicalCopy
  );
  const supportedMaterials = loadedOrders?.filter(
    (entry) =>
      entry?.manifestationAccess?.hasDigitalCopy ||
      entry?.manifestationAccess?.hasPhysicalCopy
  );
  const isLoading = loadedOrders?.length < validatedOrders?.length;

  const materialUnsupportedCount = unsupportedMaterials?.length;
  const supportedMaterialsCount = supportedMaterials?.length;

  const modal = useModal();
  const onNextClick = () => {
    setOrders(supportedMaterials?.map((entry) => entry.order));
    modal.push("multiorder", {});
  };

  const onBackClick = () => {
    modal.clear();
  };

  if (!isLoading && materialUnsupportedCount === 0) {
    return <MultiOrder />;
  }
  return (
    <div className={styles.eMaterialFilter}>
      <Top
        skeleton={isLoading}
        title={Translate({
          context: CONTEXT,
          label: "efilter-title",
        })}
        titleTag="h2"
        className={{ top: styles.top }}
      />
      {materialUnsupportedCount > 0 && (
        <Title
          skeleton={isLoading}
          tag="h3"
          type="title6"
          className={styles.subHeading}
          lines={1}
        >
          <Translate
            context={CONTEXT}
            label={
              materialUnsupportedCount === 1
                ? "efilter-subheading-singular"
                : "efilter-subheading"
            }
            vars={[materialUnsupportedCount]}
          />
        </Title>
      )}
      {isLoading ? (
        [...Array(SKELETON_ROW_AMOUNT).keys()].map((_, i) => (
          <Text skeleton={true} key={"skeleton-row-" + i} />
        ))
      ) : (
        <ul className={styles.filterList}>
          {unsupportedMaterials?.map(({ materialData }) => (
            <li className={styles.filterItem} key={materialData.workId}>
              <Title tag="h4" type="text1">
                {materialData?.manifestations?.[0].titles?.main?.[0]}
              </Title>
              <Text type="text2">
                {getMaterialTypeForPresentation(
                  materialData?.manifestations?.[0]?.materialTypes
                )}
              </Text>
            </li>
          ))}
        </ul>
      )}

      <Text
        skeleton={isLoading}
        className={styles.nextPageDescription}
        lines={1}
      >
        <Translate
          context={CONTEXT}
          label={
            supportedMaterialsCount === 0
              ? "efilter-back-text"
              : supportedMaterialsCount === 1
              ? "efilter-proceed-text-singular"
              : "efilter-proceed-text"
          }
          vars={[supportedMaterialsCount]}
        />
      </Text>

      <Button
        type="primary"
        size="large"
        skeleton={isLoading}
        onClick={supportedMaterialsCount === 0 ? onBackClick : onNextClick}
        className={styles.nextButton}
        dataCy="multiorder-next-button"
      >
        <Translate
          context={CONTEXT}
          label={
            supportedMaterialsCount === 0 ? "efilter-back" : "efilter-proceed"
          }
        />
      </Button>
    </div>
  );
};
export default EMaterialFilter;
