import Title from "@/components/base/title";
import Top from "../../base/top";
import styles from "./MultiOrder.module.css";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import CheckoutForm from "./checkoutForm/MultiOrderCheckoutForm";
import Material from "./Material/Material";
import { useState } from "react";

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
  const { materials } = context;
  const materialCounts = {
    digitalMaterials: 0,
    materialsNotAllowed: 0,
    materialsMissingAction: 0,
  };
  const [materialsToOrder, setMaterialsToOrder] = useState(materials);

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

      <div className={styles.materialList}>
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

      <section className={styles.checkoutContainer}>
        <CheckoutForm context={context} materialCounts={materialCounts} />
      </section>
    </div>
  );
};

export default MultiOrder;
