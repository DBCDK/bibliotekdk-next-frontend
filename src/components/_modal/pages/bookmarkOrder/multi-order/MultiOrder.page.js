import Title from "@/components/base/title";
import Top from "../../base/top";
import styles from "./MultiOrder.module.css";
import Translate from "@/components/base/translate";
import CheckoutForm from "./checkoutForm/MultiOrderCheckoutForm";
import Material, { filterForRelevantMaterialTypes } from "./Material/Material";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@/components/_modal/Modal";
import { StatusEnum } from "@/components/base/materialcard/materialCard.utils";
import { useMutate } from "@/lib/api/api";
import * as orderMutations from "@/lib/api/order.mutations";
import { setAlreadyOrdered } from "../../order/utils/order.utils";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

const CONTEXT = "bookmark-order";

const createOrders = async ({
  materials,
  pickupBranch,
  loanerInfo,
  periodicaForms,
  orderMutation,
}) => {
  console.log("SUBMITMULTIpleORDERS", pickupBranch.branchId);
  await orderMutation.post(
    orderMutations.submitMultipleOrders({
      materialsToOrder: materials.map((material) => {
        const isSpecificEdition = !!material.pid;

        const pids = isSpecificEdition
          ? [material.pid]
          : filterForRelevantMaterialTypes(
              material?.manifestations?.mostRelevant,
              material?.materialType
            ).map((mani) => mani.pid);
        const periodicaFormForMaterial = periodicaForms?.[material.key];
        const mergedFormData = { ...periodicaFormForMaterial, pid: pids[0] };
        return {
          pids,
          key: material.key,
          periodicaForm: periodicaFormForMaterial ? mergedFormData : undefined,
        };
      }),
      branchId: pickupBranch.branchId,
      userParameters: loanerInfo.userParameters,
    })
  );
};

const MultiOrder = ({ context }) => {
  const modal = useModal();
  const { materials, closeModalOnBack } = context;
  const analyzeRef = useRef();
  const [materialCounts, setMaterialCounts] = useState({ isAnalyzed: false });
  const [materialsToOrder, setMaterialsToOrder] = useState(materials);
  const { loanerInfo } = useLoanerInfo();
  const orderMutation = useMutate();
  const [isCreatingOrders, setIsCreatingOrders] = useState(false);
  const [duplicateBookmarkIds, setDuplicateBookmarkIds] = useState([]); //used to manage warning for duplicate orders without removing duplicate ids from browser storage
  const pickupBranch = useRef(); // Pickup branch from checkout form
  const [materialStatusChanged, setMaterialStatusChanged] = useState();

  useEffect(() => {
    console.log("changing counts");
    if (orderMutation.data && orderMutation.data.submitMultipleOrders) {
      const { failedAtCreation, successfullyCreated } =
        orderMutation.data.submitMultipleOrders;
      const failedMaterials = failedAtCreation.map((key) =>
        materials.find((mat) => mat.key === key)
      );
      const successMaterials = successfullyCreated.map((key) =>
        materials.find((mat) => mat.key === key)
      );

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

    if (orderMutation.error) {
      setIsCreatingOrders(false);
      modal.push("multireceipt", {
        failedMaterials: materialsToOrder,
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
          materials.find(
            (mat) => mat.key === element.getAttribute("data-material-key")
          )
        );

      const materialsNeedsInfo = elements
        .filter(
          (element) =>
            element.getAttribute("data-status") === StatusEnum.NEEDS_EDITION
        )
        .map((element) =>
          materials.find(
            (mat) => mat.key === element.getAttribute("data-material-key")
          )
        );

      const duplicateOrders = elements
        .filter(
          (element) =>
            element.getAttribute("data-status") === StatusEnum.HAS_BEEN_ORDERED
        )
        .map((element) =>
          materials.find(
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
          materials.find(
            (mat) => mat.key === element.getAttribute("data-material-key")
          )
        );

      setMaterialCounts({
        isAnalyzed: true,
        digitalMaterials: materialsDigital?.length ?? 0,
        materialsNotAllowed: materialsNotAvailable?.length ?? 0,
        materialsMissingAction: materialsNeedsInfo?.length ?? 0,
        duplicateOrders: duplicateOrders?.length ?? 0,
        numberMaterialsToOrder: materialsToOrder?.length ?? 0,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [
    materials,
    pickupBranch,
    materialsToOrder,
    analyzeRef.current,
    context?.periodicaForms,
    materialStatusChanged,
  ]);

  const onSubmit = async (selectedPickupBranch) => {
    setIsCreatingOrders(true);
    pickupBranch.current = selectedPickupBranch;
    await createOrders({
      materials: materialsToOrder,
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
        onBack={() => (closeModalOnBack ? modal.setStack([]) : undefined)}
      />
      <Title type="text2" tag="h3" className={styles.subHeading}>
        <Translate
          context={CONTEXT}
          label="multiorder-subheading"
          vars={[materialsToOrder?.length]}
        />
      </Title>

      <div className={styles.materialList} ref={analyzeRef}>
        {materialsToOrder.map((material) => (
          <Material
            key={material.key}
            material={material}
            numberOfMaterialsToOrder={materialsToOrder?.length ?? 0}
            setMaterialsToOrder={setMaterialsToOrder}
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
