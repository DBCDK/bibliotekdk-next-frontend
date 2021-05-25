import Router from "next/router";
import filter from "lodash/filter";

import { useState, useEffect } from "react";
import merge from "lodash/merge";

import { useData, useMutate } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import * as userFragments from "@/lib/api/user.fragments";
import { submitOrder } from "@/lib/api/order.mutations";

// Layers
import Info from "./layers/info";
import Edition from "./layers/edition";
import Pickup from "./layers/pickup";
import Action from "./layers/action";

import styles from "./Order.module.css";

/**
 *  Order component function
 *
 * @param {*} param0
 * @returns component
 */

function Order({
  pid,
  work,
  user,
  order,
  isVisible,
  onClose,
  onSubmit,
  isLoading,
}) {
  // translated state

  // layer state
  const [translated, setTranslated] = useState(false);
  const [activeLayer, setActiveLayer] = useState(null);

  // Order is validated state
  const [validated, setValidated] = useState(null);

  // Selected pickup branch
  // If none selected, use first branch in the list
  let [pickupBranch, setPickupBranch] = useState();
  pickupBranch = pickupBranch ? pickupBranch : user?.agency?.branches[0];

  // Email
  const [mail, setMail] = useState(null);

  // Update modal url param
  useEffect(() => {
    const layer = Router.query.modal?.split("-")[1];
    // If layer info (default) layer is requsted
    if (!layer) {
      setTranslated(false);
    }
    // If another layer is requested
    else {
      // If same layer as before is requested
      if (layer === activeLayer) {
        setTranslated(true);
      }
      // else set new layer
      if (layer !== activeLayer) {
        setActiveLayer(layer);
        setTranslated(true);
      }
    }
  }, [Router.query.modal]);

  // Cleanup on modal close
  useEffect(() => {
    if (!isVisible) {
      setActiveLayer(null);
      setTranslated(false);
    }
  }, [isVisible]);

  // Update email
  useEffect(() => {
    setMail({ value: user?.mail || "", valid: true });
  }, [user?.mail]);

  // Update validation
  useEffect(() => {
    const hasMail = !!mail?.valid;
    const hasBranchId = !!pickupBranch?.branchId;
    const hasPid = !!pid;

    const status = hasMail && hasBranchId && hasPid;
    const details = { hasMail, hasBranchId, hasPid };

    setValidated({ status, details });
  }, [mail, pid, pickupBranch]);

  /**
   *  Function to handle the active layer in modal
   *
   * @param {string} layer
   */
  function handleLayer(layer) {
    if (layer !== Router.query.modal) {
      Router.push({
        pathname: Router.pathname,
        query: { ...Router.query, modal: `order-${layer}` },
      });
    }
  }

  // Work props
  const {
    title = "...",
    creators = [{ name: "..." }],
    manifestations = [],
  } = work;

  // User props
  const { agency } = user;

  // order
  const {
    data: orderData,
    error: orderError,
    isLoading: orderIsLoading,
  } = order;

  // Material by pid
  const material = filter(
    manifestations,
    (manifestation) => manifestation.pid === pid
  )[0];

  // status
  const isOrdering = orderIsLoading;
  const isOrdered = orderData?.submitOrder?.status === "ok";
  const isFailed = !!orderError;

  // class'
  const activePageClass = activeLayer ? styles[`active-${activeLayer}`] : "";
  const activeTranslatedClass = translated ? styles.translated : "";

  // Validated
  const validatedClass = validated?.status ? styles.validated : "";

  return (
    <div className={styles.order}>
      <div className={styles.container}>
        <div
          className={`${styles.wrap} ${activePageClass} ${activeTranslatedClass}`}
        >
          <div className={styles.left}>
            <Info
              isVisible={!translated}
              material={{ title, creators, ...material }}
              user={user}
              className={`${styles.page} ${styles[`page-info`]}`}
              onLayerSelect={(layer) => {
                handleLayer(layer);
              }}
              pickupBranch={pickupBranch}
              onMailChange={(value, valid) => setMail({ value, valid })}
            />
          </div>
          <div className={styles.right}>
            <Edition
              isVisible={activeLayer === "edition"}
              className={`${styles.page} ${styles[`page-edition`]}`}
              onChange={(val) => console.log(val + " selected")}
              onClose={(e) => Router.back()}
            />
            <Pickup
              isVisible={activeLayer === "pickup"}
              agency={agency}
              className={`${styles.page} ${styles[`page-library`]}`}
              onSelect={(branch) => {
                setPickupBranch(branch);
                // Give it some time to animate before closing
                setTimeout(() => Router.back(), 300);
              }}
              onClose={() => Router.back()}
              selected={pickupBranch}
            />
          </div>
        </div>
        <Action
          isVisible={!translated}
          validated={validated}
          isOrdering={isOrdering}
          isOrdered={isOrdered}
          data={{ pickupBranch, order }}
          isFailed={isFailed}
          onClose={onClose}
          onClick={() => {
            if (validated.status) {
              onSubmit && onSubmit(pid, pickupBranch, mail?.value);
            }
          }}
        />
      </div>
    </div>
  );
}

function OrderSkeleton(props) {
  return (
    <Order
      className={`${props.className} ${styles.skeleton}`}
      isLoading={true}
    />
  );
}

/**
 * Wrap is a react component responsible for loading
 * data and displaying the right variant of the component
 *
 * @param {Object} props Component props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  // order pid
  const { order } = Router.query;

  const workId = `work-of:${order}`;

  // Fetch work data
  const { data, isLoading, isSlow, error } = useData(
    workFragments.detailsAllManifestations({ workId })
  );

  const covers = useData(workFragments.covers({ workId }));

  // Fetch user data
  const { data: userData, error: userDataError } = useData(
    userFragments.basic()
  );

  const orderMutation = useMutate();

  if (isLoading) {
    return null;
    return <OrderSkeleton isSlow={isSlow} />;
  }

  if (error || userDataError) {
    return <div>Error :( !!!!!</div>;
  }

  const mergedWork = merge({}, covers.data, data);

  return (
    <Order
      work={mergedWork?.work}
      user={userData?.user || {}}
      pid={order}
      order={orderMutation}
      onSubmit={(pid, pickupBranch, email) => {
        orderMutation.post(
          submitOrder({ pid, branchId: pickupBranch.branchId, email })
        );
      }}
      {...props}
    />
  );
}
