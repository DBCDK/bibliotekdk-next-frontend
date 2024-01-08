import Title from "@/components/base/title";
import Top from "../../base/top";
import styles from "./MultiOrder.module.css";
import Translate from "@/components/base/translate";
import CheckoutForm from "./checkoutForm/MultiOrderCheckoutForm";
import Material from "./Material/Material";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@/components/_modal/Modal";
import { StatusEnum } from "@/components/base/materialcard/materialCard.utils";
import * as orderMutations from "@/lib/api/order.mutations";
import { setAlreadyOrdered } from "../../order/utils/order.utils";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import { useMutate } from "@/lib/api/api";
import useBookmarks, {
  usePopulateBookmarks,
} from "@/components/hooks/useBookmarks";
import { mergeBookmarksWithPopulatedData } from "@/components/profile/bookmarks/bookmarks.utils";
import MaterialRow from "@/components/profile/materialRow/MaterialRow";

const CONTEXT = "bookmark-order";
const SKELETON_ROW_AMOUNT = 3;

const formatArticleForm = (formData, pid) => {
  if (!formData || !pid) return null;

  const { publicationDateOfComponent, authorOfComponent, titleOfComponent } =
    formData;

  return {
    pid,
    publicationDateOfComponent,
    volumeOfComponent: formData.volume,
    authorOfComponent,
    titleOfComponent,
    pagesOfComponent: formData.pagination,
  };
};

const createOrders = async ({
  materials,
  pickupBranch,
  loanerInfo,
  periodicaForms,
  orderMutation,
}) => {
  await orderMutation.post(
    orderMutations.submitMultipleOrders({
      materialsToOrder: materials.map((material) => {
        const pids = material?.manifestations?.map((mani) => mani.pid);
        const periodicaFormForMaterial = periodicaForms?.[material.key];
        const articleForm = formatArticleForm(
          periodicaFormForMaterial,
          pids[0]
        );
        return {
          pids,
          key: material.key,
          periodicaForm: articleForm ? articleForm : undefined,
        };
      }),
      branchId: pickupBranch.branchId,
      userParameters: loanerInfo.userParameters,
    })
  );
};

const MultiOrder = ({ context }) => {
  const modal = useModal();
  const { sortType, handleOrderFinished, bookmarksToOrder } = context;
  const analyzeRef = useRef();
  const [materialCounts, setMaterialCounts] = useState({ isAnalyzed: false });
  //const [materialsToOrder, setMaterialsToOrder] = useState(bookmarksToOrder); //TODO order!
  const { loanerInfo } = useLoanerInfo();
  const [isCreatingOrders, setIsCreatingOrders] = useState(false);
  const [duplicateBookmarkIds, setDuplicateBookmarkIds] = useState([]); //used to manage warning for duplicate orders without removing duplicate ids from browser storage
  const pickupBranch = useRef(); // Pickup branch from checkout form
  const [materialStatusChanged, setMaterialStatusChanged] = useState();
  const orderMutation = useMutate();
  const { titleSort, createdAtSort } = useBookmarks();
  const { data: populatedBookmarks, isLoading: isPopulating } =
    usePopulateBookmarks(bookmarksToOrder);
  const [sortedMaterials, setSortedMaterials] = useState([]);
  const isLoading = !bookmarksToOrder || isPopulating;

  useEffect(() => {
    if (isPopulating) return;
    const materials = mergeBookmarksWithPopulatedData(
      bookmarksToOrder,
      populatedBookmarks
    );

    const sortedList =
      sortType === "title" ? titleSort(materials) : createdAtSort(materials);

    setSortedMaterials(sortedList);
  }, [populatedBookmarks, sortType]);

  useEffect(() => {
    if (orderMutation?.data && orderMutation.data.submitMultipleOrders) {
      const { failedAtCreation, successfullyCreated } =
        orderMutation.data.submitMultipleOrders;
      const failedMaterials = failedAtCreation.map((key) =>
        sortedMaterials.find((mat) => mat.key === key)
      );
      const successMaterials = successfullyCreated.map((key) =>
        sortedMaterials.find((mat) => mat.key === key)
      );
      handleOrderFinished(successfullyCreated, failedAtCreation);

      //set the ordered workids as already ordered in session
      successMaterials.forEach((mat) => {
        if (mat?.workId) setAlreadyOrdered(mat.workId);
      });

      setIsCreatingOrders(false);
      modal.push("multireceipt", {
        failedMaterials,
        successMaterials,
        branchName: pickupBranch.current?.name,
      });
    }

    if (orderMutation?.error) {
      setIsCreatingOrders(false);
      modal.push("multireceipt", {
        failedMaterials: sortedMaterials,
        successMaterials: [],
        branchName: pickupBranch.current?.name,
      });
    }
  }, [orderMutation?.isLoading]);

  useEffect(() => {
    if (!analyzeRef || !analyzeRef.current) return;

    const elements = Array.from(analyzeRef.current.children);

    const timer = setTimeout(() => {
      /**
       * timeout to secure elements are rerendered
       */

      const materialsNotAvailable = elements
        .filter(
          (element) =>
            element.getAttribute("data-status") === StatusEnum.NOT_AVAILABLE
        )
        .map((element) =>
          sortedMaterials.find(
            (mat) => mat.key === element.getAttribute("data-material-key")
          )
        );

      const materialsNeedsInfo = elements
        .filter(
          (element) =>
            element.getAttribute("data-status") === StatusEnum.NEEDS_EDITION
        )
        .map((element) =>
          sortedMaterials.find(
            (mat) => mat.key === element.getAttribute("data-material-key")
          )
        );

      //TODO what about duplicate orders
      const duplicateOrders = elements
        .filter(
          (element) =>
            element.getAttribute("data-status") === StatusEnum.HAS_BEEN_ORDERED
        )
        .map((element) =>
          sortedMaterials.find(
            (mat) => mat.key === element.getAttribute("data-material-key")
          )
        );

      setDuplicateBookmarkIds(duplicateOrders.map((mat) => mat.bookmarkId));

      const materialsDigital = elements
        .filter(
          (element) =>
            element.getAttribute("data-status") === StatusEnum.DIGITAL
        )
        .map((element) =>
          sortedMaterials.find(
            (mat) => mat.key === element.getAttribute("data-material-key")
          )
        );

      setMaterialCounts({
        isAnalyzed: true,
        digitalMaterials: materialsDigital?.length ?? 0,
        materialsNotAllowedCount: materialsNotAvailable?.length ?? 0,
        materialsMissingActionCount: materialsNeedsInfo?.length ?? 0,
        duplicateOrders: duplicateOrders?.length ?? 0,
        materialsToOrderCount: sortedMaterials?.length ?? 0,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [
    pickupBranch,
    sortedMaterials,
    analyzeRef.current,
    context?.periodicaForms,
    materialStatusChanged,
  ]);

  const onSubmit = async (selectedPickupBranch) => {
    setIsCreatingOrders(true);
    pickupBranch.current = selectedPickupBranch;
    await createOrders({
      materials: sortedMaterials,
      pickupBranch: selectedPickupBranch,
      loanerInfo,
      periodicaForms: context.periodicaForms,
      orderMutation,
    });
  };

  return (
    <div className={styles.multiOrder}>
      <Top
        title={Translate({
          context: CONTEXT,
          label: "multiorder-title",
        })}
        titleTag="h2"
        className={{ top: styles.top }}
      />
      <Title type="text2" tag="h3" className={styles.subHeading}>
        <Translate
          context={CONTEXT}
          label="multiorder-subheading"
          vars={[sortedMaterials?.length]}
        />
      </Title>

      {isLoading ? (
        [...Array(SKELETON_ROW_AMOUNT).keys()].map((_, i) => (
          <MaterialRow
            skeleton
            key={`material-row-skeleton-#${i}`}
            title=""
            library=""
          />
        ))
      ) : (
        <div className={styles.materialList} ref={analyzeRef}>
          {sortedMaterials?.map((material) => (
            <Material
              key={material.key}
              material={material}
              numberOfMaterialsToOrder={sortedMaterials?.length ?? 0}
              setMaterialsToOrder={setSortedMaterials}
              showAlreadyOrderedWarning={duplicateBookmarkIds.includes(
                (bm) => bm === material.bookmarkId
              )}
              setDuplicateBookmarkIds={setDuplicateBookmarkIds}
              //context is responsible for updating periodica form via periodicaForm.js and modal.update
              periodicaForms={context?.periodicaForms}
              setMaterialStatusChanged={setMaterialStatusChanged}
            />
          ))}
        </div>
      )}

      {materialCounts !== null && (
        <section className={styles.checkoutContainer}>
          <CheckoutForm
            context={context}
            materialCounts={materialCounts}
            onSubmit={onSubmit}
            isLoading={isCreatingOrders}
            duplicateBookmarkIds={duplicateBookmarkIds}
          />
        </section>
      )}
    </div>
  );
};

export default MultiOrder;
