import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Top from "../../base/top";
import styles from "./MultiOrder.module.css";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import CheckoutForm from "./checkoutForm/MultiOrderCheckoutForm";

const CONTEXT = "bookmark-order";

const OrderPolicyWrapper = ({material, ...props}) => {
  const pids = material.pid ?? material.manifestations.mostRelevant.map(mani => mani.pid); // TODO filter by material type
  const { data: orderPolicyData, isLoading: orderPolicyIsLoading } = useData(
    pids &&
    pids.length > 0 &&
      branchesFragments.checkOrderPolicy({ pids: pids, branchId: "726500" })
  );
  if (orderPolicyIsLoading) return null;

  const {
    orderPossible
  } = orderPolicyData?.branches?.result?.[0]?.orderPolicy;

  return (
    <article data-order-possible={orderPossible} {...props} />
  )
}

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
        {
          /**
           * @TODO Insert material card
           * Data should be in materials object, if something is missing we need to add it to the fragments populateBookmarks uses
           */
          materials.map((mat) => (
            <article key={mat.key}>{mat.titles?.main?.[0]}</article>
          ))
        }
      </div>

      <section className={styles.checkoutContainer}>
        {/**
         * Checkout form goes here
         */}

         <CheckoutForm />
      </section>
    </div>
  );
};

export default MultiOrder;
