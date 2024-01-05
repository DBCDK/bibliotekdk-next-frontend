import Text from "@/components/base/text";
import Top from "../../base/top/Top";
import Button from "@/components/base/button";
import styles from "./EMaterialFilter.module.css";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import { useModal } from "@/components/_modal/Modal";
import { getMaterialTypeForPresentation } from "@/lib/manifestationFactoryUtils";

const CONTEXT = "bookmark-order";
const SKELETON_ROW_AMOUNT = 3;

/**
 * Shows all the materials that are available online and therefor cannot be ordered
 * Skips this step if nothing to filter
 */
const EMaterialFilter = ({ context, active }) => {
  const { handleOrderFinished, materialsToOrder, materialsOnlineAvailable } =
    context;

  const modal = useModal();
  const isLoading = !materialsToOrder || !materialsOnlineAvailable;

  const onNextClick = () => {
    modal.push("multiorder", {
      bookmarksToOrder: materialsToOrder,
      handleOrderFinished: handleOrderFinished,
    });
  };

  const onBackClick = () => {
    modal.clear();
  };

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
            materialsOnlineAvailable?.length === 1
              ? "efilter-subheading-singular"
              : "efilter-subheading"
          }
          vars={[materialsOnlineAvailable?.length]}
        />
      </Title>
      {isLoading ? (
        [...Array(SKELETON_ROW_AMOUNT).keys()].map((_, i) => (
          <Text skeleton={true} key={"skeleton-row-" + i} />
        ))
      ) : (
        <ul className={styles.filterList}>
          {materialsOnlineAvailable?.map((mat) => (
            <li className={styles.filterItem} key={mat.key}>
              <Title tag="h4" type="text1">
                {mat.titles?.main?.[0]}
              </Title>
              <Text type="text2">
                {getMaterialTypeForPresentation(
                  mat?.manifestations?.[0].materialTypes
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
            materialsToOrder?.length === 0
              ? "efilter-back-text"
              : materialsToOrder?.length === 1
              ? "efilter-proceed-text-singular"
              : "efilter-proceed-text"
          }
          vars={[materialsToOrder?.length]}
        />
      </Text>

      <Button
        type="primary"
        size="large"
        skeleton={isLoading}
        onClick={materialsToOrder?.length === 0 ? onBackClick : onNextClick}
        className={styles.nextButton}
      >
        <Translate
          context={CONTEXT}
          label={
            materialsToOrder?.length === 0 ? "efilter-back" : "efilter-proceed"
          }
        />
      </Button>
    </div>
  );
};
export default EMaterialFilter;
