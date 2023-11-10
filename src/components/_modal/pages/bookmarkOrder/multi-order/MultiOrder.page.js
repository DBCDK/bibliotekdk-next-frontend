import Title from "@/components/base/title";
import Top from "../../base/top";
import styles from "./MultiOrder.module.css";
import Translate from "@/components/base/translate";
import CheckoutForm from "./checkoutForm/MultiOrderCheckoutForm";
import Material, { filterForRelevantMaterialTypes } from "./Material/Material";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@/components/_modal/Modal";
import { StatusEnum } from "@/components/base/materialcard/materialCard.utils";
import useUser from "@/components/hooks/useUser";
import { useMutate } from "@/lib/api/api";
import * as orderMutations from "@/lib/api/order.mutations";
import {
  createOrderKey,
  setAlreadyOrdered,
} from "../../order/utils/order.utils";

const CONTEXT = "bookmark-order";

const createOrders = async ({
  materials,
  pickupBranch,
  loanerInfo,
  periodicaForms,
  orderMutation,
  closeModalOnBack = false,
}) => {
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
        const periodicaForm = periodicaForms?.[material.key];

        return {
          pids,
          key: material.key,
          ...periodicaForm,
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
  const [materialCounts, setMaterialCounts] = useState({});
  const [duplicateOrdersWorkIds, setDuplicateOrdersWorkIds] = useState([]);
  const [materialsToOrder, setMaterialsToOrder] = useState(materials);
  const { loanerInfo } = useUser();
  const orderMutation = useMutate();
  const [isCreatingOrders, setIsCreatingOrders] = useState(false);
  const pickupBranch = useRef(); // Pickup branch from checkout form

  useEffect(() => {
    if (orderMutation.data && orderMutation.data.submitMultipleOrders) {
      const { failedAtCreation, successfullyCreated } =
        orderMutation.data.submitMultipleOrders;
      const failedMaterials = failedAtCreation.map((key) =>
        materials.find((mat) => mat.key === key)
      );
      const successMaterials = successfullyCreated.map((key) =>
        materials.find((mat) => mat.key === key)
      );

      const orderedBookmarkIds = successMaterials.map((bm) => bm.bookmarkId);

      //find materialsToOrder that have been ordered successully
      const successfullyOrderedMaterials = orderedBookmarkIds.flatMap((b) =>
        materialsToOrder.filter((m) => {
          if (m.bookmarkId === b) return m;
        })
      );

      //get the sucessfully ordered pids
      const orderedPids = successfullyOrderedMaterials?.map((mat) => {
        const isSpecificEdition = !!mat.pid;

        return isSpecificEdition
          ? [mat.pid]
          : filterForRelevantMaterialTypes(
              mat?.manifestations?.mostRelevant,
              mat?.materialType
            ).flatMap((mani) => mani.pid);
      });

      //set the ordered pids as already ordered in session
      orderedPids.forEach((pids) => {
        //Contains also pid for peridica, which we dont check at the moment
        const orderKey = createOrderKey(pids);
        if (orderKey !== "") setAlreadyOrdered(orderKey);
      });

      setIsCreatingOrders(false);
      modal.push("multireceipt", {
        failedMaterials,
        successMaterials,
        branchName: pickupBranch.current?.name,
      });
    }
  }, [orderMutation?.data]);

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

      setDuplicateOrdersWorkIds(duplicateOrders.map((mat) => mat.workId));
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
        digitalMaterials: materialsDigital?.length ?? 0,
        materialsNotAllowed: materialsNotAvailable?.length ?? 0,
        materialsMissingAction: materialsNeedsInfo?.length ?? 0,
        duplicateOrders: duplicateOrders?.length ?? 0,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [
    materials,
    materialsToOrder,
    analyzeRef.current,
    context?.periodicaForms,
  ]);

  const onSubmit = async (pickupBranch) => {
    setIsCreatingOrders(true);
    pickupBranch.current = pickupBranch;
    await createOrders({
      materials: materialsToOrder,
      pickupBranch,
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
        {materialsToOrder.map((material) => {
          return (
            <Material
              key={material.key}
              material={material}
              numberOfMaterialsToOrder={materialsToOrder?.length ?? 0}
              setMaterialsToOrder={setMaterialsToOrder}
              setDuplicateOrdersWorkIds={setDuplicateOrdersWorkIds}
              //context is responsible for updating periodica form via periodicaForm.js and modal.update
              periodicaForms={context?.periodicaForms}
            />
          );
        })}
      </div>

      {materialCounts !== null && (
        <section className={styles.checkoutContainer}>
          <CheckoutForm
            context={context}
            materialCounts={materialCounts}
            onSubmit={onSubmit}
            isLoading={isCreatingOrders}
            duplicateOrdersWorkIds={duplicateOrdersWorkIds}
          />
        </section>
      )}
    </div>
  );
};

export default MultiOrder;
