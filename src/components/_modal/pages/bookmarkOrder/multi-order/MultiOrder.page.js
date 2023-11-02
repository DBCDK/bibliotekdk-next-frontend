import Title from "@/components/base/title";
import Top from "../../base/top";
import styles from "./MultiOrder.module.css";
import Translate from "@/components/base/translate";
import Material from "./Material/Material";

const CONTEXT = "bookmark-order";

const MultiOrder = ({ context }) => {
  const { materials } = context;

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
          vars={[materials?.length]}
        />
      </Title>

      <div className={styles.materialList}>
        {materials.map((material) => {
          return (
            <Material
              key={material.key}
              material={material}
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
