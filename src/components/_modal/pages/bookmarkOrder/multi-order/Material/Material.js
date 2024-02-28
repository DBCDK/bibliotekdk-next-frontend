import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateImageToLeft } from "@/components/base/materialcard/templates/templates";
import ChoosePeriodicaCopyRow from "@/components/_modal/pages/edition/choosePeriodicaCopyRow/ChoosePeriodicaCopyRow.js";
import { useModal } from "@/components/_modal/Modal";
import {
  BackgroundColorEnum,
  findBackgroundColor,
} from "@/components/base/materialcard/materialCard.utils";
import styles from "./Material.module.css";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import IconButton from "@/components/base/iconButton";
import HasBeenOrderedRow from "../../../edition/hasbeenOrderedRow/HasBeenOrderedRow";
import {
  useOrderFlow,
  useOrderService,
  usePeriodica,
  usePeriodicaForm,
  useShowAlreadyOrdered,
} from "@/components/hooks/order";
import { useData } from "@/lib/api/api";
import { editionManifestations } from "@/lib/api/manifestation.fragments";

/**
 * Is missing article implementation
 * @param {Object} material
 * @param {Number} numberOfMaterialsToOrder
 * @param {Function} setMaterialsToOrder
 * @param {Object} periodicaForms
 * @param {String} backgroundColorOverride
 * @param {Function} setDuplicateBookmarkIds
 * @param {Boolean} showActions we dont wanna show actions (fjern, fillout periodica data) in receipt since the user cannot do anything about it.
 * @param {Function} setMaterialStatusChanged callback to trigger reevaluation of error state in checkout form
 * @returns {React.JSX.Element}
 */
const Material = ({
  pids,
  backgroundColorOverride = BackgroundColorEnum.NEUTRAL,
  showActions = true,
}) => {
  const isSpecificEdition = pids?.length === 1;
  const modal = useModal();

  const { deleteOrder } = useOrderFlow();
  const {
    workId,
    showAlreadyOrderedWarning,
    setAcceptedAlreadyOrdered,
    isLoading: isLoadingAlreadyOrdered,
  } = useShowAlreadyOrdered({ pids });
  const { periodicaForm, articleIsSpecified } = usePeriodicaForm(workId);
  const { isPeriodica } = usePeriodica({ pids });
  const { service, isLoading: isLoadingOrderService } = useOrderService({
    pids,
  });
  const { data: manifestationsData, isLoading: isLoadingManifestations } =
    useData(
      pids?.length > 0 &&
        editionManifestations({
          pid: pids,
        })
    );

  const isLoading = isLoadingManifestations || isLoadingAlreadyOrdered;

  const material = manifestationsData?.manifestations?.[0];

  const orderPossible = service === "ILL" || service === "DIGITAL_ARTICLE";

  const backgroundColor = findBackgroundColor({
    hasAlreadyBeenOrdered: showAlreadyOrderedWarning,
    isPeriodicaLike: isPeriodica,
    hasPeriodicaForm: !!periodicaForm,
    notAvailableAtLibrary: isLoadingOrderService
      ? false //if we dont have data yet, we dont want red background
      : !orderPossible,
  });

  const showOrderedWarning =
    orderPossible && showAlreadyOrderedWarning && !isPeriodica && showActions;

  let articleTypeTranslation = null;
  if (service === "ILL") {
    if (isPeriodica && periodicaForm) {
      if (articleIsSpecified) {
        articleTypeTranslation = {
          context: "general",
          label: "article",
        };
      } else {
        articleTypeTranslation = {
          context: "general",
          label: "volume",
        };
      }
    }
  } else if (service === "DIGITAL_ARICLE") {
    articleTypeTranslation = {
      context: "order",
      label: "will-order-digital-copy",
    };
  }

  const children = [];

  if (orderPossible && isPeriodica && showActions) {
    children.push(
      <ChoosePeriodicaCopyRow
        key={workId}
        workId={workId}
        modal={modal}
        articleTypeTranslation={articleTypeTranslation}
      />
    );
  }

  if (backgroundColorOverride === BackgroundColorEnum.RED) {
    children.push(
      <Text type="text4" className={styles.errorLabel}>
        <Translate context="materialcard" label="error-ordering" />
      </Text>
    );
  }

  if (showOrderedWarning) {
    children.push(
      <HasBeenOrderedRow
        pids={pids}
        orderDate={new Date()}
        removeOrder={() => deleteOrder({ pids })}
        acceptOrder={() => {
          setAcceptedAlreadyOrdered(true);
        }}
      />
    );
  }

  if (!isLoadingOrderService && !orderPossible) {
    children.push(
      <>
        <Text className={styles.orderNotPossible} type="text4">
          {Translate({
            context: "materialcard",
            label: "order-not-possible",
          })}
        </Text>
        <IconButton onClick={() => deleteOrder({ pids })}>
          {Translate({
            context: "bookmark",
            label: "remove",
          })}
        </IconButton>
      </>
    );
  }

  const isDeliveredByDigitalArticleService = service === "DIGITAL_ARTICLE";

  const materialCardTemplate = () =>
    templateImageToLeft({
      isLoading,
      material,
      singleManifestation: isSpecificEdition,
      children,
      isPeriodicaLike: isPeriodica,
      isDeliveredByDigitalArticleService,
      backgroundColor,
      hideEditionText: backgroundColorOverride === BackgroundColorEnum.RED,
    });

  return (
    <MaterialCard
      isLoading={isLoading}
      propAndChildrenTemplate={materialCardTemplate}
      colSizing={{ xs: 12 }}
    />
  );
};

export default Material;
