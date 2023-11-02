import Title from "@/components/base/title";
import Top from "../../base/top";
import styles from "./MultiOrder.module.css";
import Translate from "@/components/base/translate";
import CheckoutForm from "./checkoutForm/MultiOrderCheckoutForm";
import Material from "./Material/Material";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@/components/_modal/Modal";
import { StatusEnum } from "@/components/base/materialcard/materialCard.utils";

const CONTEXT = "bookmark-order";

const MultiOrder = ({ context }) => {
  const modal = useModal();
  const { materials } = context;
  const analyzeRef = useRef();
  const [materialCounts, setMaterialCounts] = useState({});
  const [materialsToOrder, setMaterialsToOrder] = useState(materials);

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

  const onSubmit = (branchName) => {
    // Create orders
    modal.push("multireceipt", {
      failedMaterials: materials.slice(0, 2),
      successMaterials: [0, 0],
      branchName,
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
