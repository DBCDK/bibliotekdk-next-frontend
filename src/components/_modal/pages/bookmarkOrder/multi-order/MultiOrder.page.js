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

const CONTEXT = "bookmark-order";

const createOrders = async ({
  materials,
  pickupBranch,
  loanerInfo,
  periodicaForms,
  orderMutation,
}) => {
  /**
   * @TODO Catch errors and send to receipt
   */
  await materials.map(async (material) => {
    const isSpecificEdition = !!material.pid;

    const pids = isSpecificEdition
      ? [material.pid]
      : filterForRelevantMaterialTypes(
          material?.manifestations?.mostRelevant,
          material?.materialType
        ).map((mani) => mani.pid);
    const periodicaForm = periodicaForms?.[material.key];
    await orderMutation.post(
      orderMutations.submitOrder({
        pids,
        branchId: pickupBranch.branchId,
        userParameters: loanerInfo.userParameters,
        ...periodicaForm,
      })
    );
  });
};

const MultiOrder = ({ context }) => {
  const modal = useModal();
  const { materials } = context;
  const analyzeRef = useRef();
  const [materialCounts, setMaterialCounts] = useState({});
  const [materialsToOrder, setMaterialsToOrder] = useState(materials);
  const { loanerInfo } = useUser();
  const orderMutation = useMutate();
  const [isCreatingOrders, setIsCreatingOrders] = useState(false);

  useEffect(() => {
    if (!analyzeRef || !analyzeRef.current) return;

    const elements = Array.from(analyzeRef.current.children);
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

    const materialsDigital = elements
      .filter(
        (element) => element.getAttribute("data-status") === StatusEnum.DIGITAL
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
    });
  }, [materials, analyzeRef.current]);

  const onSubmit = async (pickupBranch) => {
    setIsCreatingOrders(true);
    await createOrders({
      materials: materials,
      pickupBranch,
      loanerInfo,
      periodicaForms: context.periodicaForms,
      orderMutation,
    });
    setIsCreatingOrders(false);
    modal.push("multireceipt", {
      failedMaterials: [], // @TODO add failing orders
      successMaterials: materials, // @TODO add successfull orders
      branchName: pickupBranch.name,
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
          vars={[materialsToOrder?.length]}
        />
      </Title>

      <div className={styles.materialList} ref={analyzeRef}>
        {materialsToOrder.map((material) => {
          return (
            <Material
              key={material.key}
              material={material}
              setMaterialsToOrder={setMaterialsToOrder}
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
          />
        </section>
      )}
    </div>
  );
};

export default MultiOrder;
