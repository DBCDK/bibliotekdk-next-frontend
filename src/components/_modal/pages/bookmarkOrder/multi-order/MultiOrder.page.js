import Title from "@/components/base/title";
import Top from "../../base/top";
import styles from "./MultiOrder.module.css";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import CheckoutForm from "./checkoutForm/MultiOrderCheckoutForm";
import Material from "./Material/Material";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@/components/_modal/Modal";
import { StatusEnum } from "@/components/base/materialcard/materialCard.utils";

const CONTEXT = "bookmark-order";

const OrderPolicyWrapper = ({ material, ...props }) => {
  const pids =
    material.pid ??
    material.manifestations.mostRelevant.map((mani) => mani.pid); // TODO filter by material type
  const { data: orderPolicyData, isLoading: orderPolicyIsLoading } = useData(
    pids &&
      pids.length > 0 &&
      branchesFragments.checkOrderPolicy({ pids: pids, branchId: "726500" })
  );
  if (orderPolicyIsLoading) return null;

  const { orderPossible } = orderPolicyData?.branches?.result?.[0]?.orderPolicy;

  return <article data-order-possible={orderPossible} {...props} />;
};

const MultiOrder = ({ context }) => {
  const modal = useModal();
  const { materials } = context;
  const analyzeRef = useRef();
  const [materialCounts, setMaterialCounts] = useState(null);
  const [materialsToOrder, setMaterialsToOrder] = useState(materials);

  useEffect(() => {
    if (!analyzeRef || !analyzeRef.current) return;
    if (materialCounts !== null) return;

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

    const materialsReadyToOrder = elements
      .filter(
        (element) => element.getAttribute("data-status") === StatusEnum.NONE
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
  });

  const onSubmit = () => {
    // Create orders
    console.log(materials);
    modal.push("multireceipt", {
      failedMaterials: materials.slice(0, 2),
      successMaterials: [0, 0],
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
              context={context} //sets periodicaForm via updateModal
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
          />
        </section>
      )}
    </div>
  );
};

export default MultiOrder;
