import Title from "@/components/base/title";
import Top from "../../base/top";
import styles from "./MultiOrder.module.css";
import Translate from "@/components/base/translate";
import Material from "./Material/Material";
import { useState } from "react";

const CONTEXT = "bookmark-order";

const MultiOrder = ({ context }) => {
  const { materials } = context;
  const [materialsToShow, setMaterialsToShow] = useState(materials);

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
          vars={[materialsToShow?.length]}
        />
      </Title>

      <div className={styles.materialList}>
        {materialsToShow.map((material) => {
          return (
            <Material
              key={material.key}
              material={material}
              setMaterialsToShow={setMaterialsToShow}
              context={context} //sets periodicaForm via updateModal
            />
          );
        })}
      </div>

      <section className={styles.checkoutContainer}>
        {/**
         * Checkout form goes here
         */}
      </section>
    </div>
  );
};

export default MultiOrder;
