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

import data from "./dummy.data";

import styles from "./Order.module.css";

/**
 *  Function to handle the active layer in modal
 *
 * @param {string} layer
 */
function handleLayer(layer) {
  if (layer !== Router.query.modal) {
    Router.push(
      {
        pathname: Router.pathname,
        query: { ...Router.query, modal: `order-${layer}` },
      },
      null,
      { shallow: true, scroll: false }
    );
  }
}

/**
 *  Order component function
 *
 * @param {*} param0
 * @returns component
 */

export function Order({
  pid,
  work,
  user,
  order,
  query,
  isVisible,
  onClose,
  onSubmit,
  onLayerChange,
  onLayerClose,
  isLoading,
}) {
  // layer state
  const [translated, setTranslated] = useState(false);
  const [activeLayer, setActiveLayer] = useState(null);

  // Validation state
  const [validated, setValidated] = useState(null);
  // Selected pickup branch
  // If none selected, use first branch in the list
  let [pickupBranch, setPickupBranch] = useState();
  pickupBranch = pickupBranch
    ? user?.agency?.result?.find(
        (branch) => pickupBranch.branchId === branch.branchId
      )
    : user?.agency?.result?.[0]
    ? user.agency?.result?.[0]
    : null;

  // Email state
  const [mail, setMail] = useState(null);

  // Sets if user has unsuccessfully tried to submit the order
  const [hasTry, setHasTry] = useState(false);

  // Update modal url param
  useEffect(() => {
    const layer = query?.modal?.split("-")[1];
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
  }, [query?.modal]);

  // Cleanup on modal close
  useEffect(() => {
    if (!isVisible) {
      setActiveLayer(null);
      setTranslated(false);
    }
  }, [isVisible]);

  // Update email from user account
  useEffect(() => {
    const userMail = user?.mail;

    if (userMail) {
      const message = null;

      setMail({
        value: userMail,
        valid: { status: true, message },
      });
    }
  }, [user?.mail]);

  // Update validation
  useEffect(() => {
    const hasMail = !!mail?.valid?.status;
    const hasBranchId = !!pickupBranch?.branchId;
    const hasPid = !!pid;

    const status = hasMail && hasBranchId && hasPid;
    const details = {
      hasMail: {
        status: hasMail,
        value: mail?.value,
        message: mail?.valid?.message,
      },
      hasBranchId: { status: hasBranchId },
      hasPid: { status: hasPid },
    };

    setValidated({ status, hasTry, details });
  }, [mail, pid, pickupBranch, hasTry]);

  // Work props
  const {
    cover,
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

  const materialsSameType = filter(
    manifestations,
    (manifestation) => manifestation.materialType === material.materialType
  );

  // status
  const isOrdering = orderIsLoading;
  const isOrdered = orderData?.submitOrder?.status === "ok";
  const isFailed = !!orderError;

  // class'
  const activePageClass = activeLayer ? styles[`active-${activeLayer}`] : "";
  const activeTranslatedClass = translated ? styles.translated : "";

  // Validated
  const validatedClass = validated?.status ? styles.validated : "";

  // Order padding bottom, according to if the actionlayer is visible
  const actionLayerVisible = !translated ? styles.padding : "";

  return (
    <div className={`${styles.order} ${actionLayerVisible}`}>
      <div className={styles.container}>
        <div
          className={`${styles.wrap} ${activePageClass} ${activeTranslatedClass}`}
        >
          <div className={styles.left}>
            <Info
              isVisible={!translated && isVisible}
              material={{
                title,
                creators,
                ...material,
                cover: { detail: material?.cover?.detail || cover?.detail },
              }}
              user={user}
              className={`${styles.page} ${styles[`page-info`]}`}
              onLayerSelect={(layer) => onLayerChange && onLayerChange(layer)}
              pickupBranch={pickupBranch}
              onMailChange={(value, valid) => setMail({ value, valid })}
              mail={mail}
              validated={validated}
              isLoading={isLoading}
            />
          </div>
          <div className={styles.right}>
            <Edition
              isVisible={translated && activeLayer === "edition"}
              className={`${styles.page} ${styles[`page-edition`]}`}
              onChange={(val) => console.log(val + " selected")}
              onClose={onLayerClose}
            />
            <Pickup
              isVisible={translated && activeLayer === "pickup"}
              agency={agency}
              className={`${styles.page} ${styles[`page-library`]}`}
              onSelect={(branch) => {
                setPickupBranch(branch);
                // Give it some time to animate before closing
                setTimeout(() => onLayerClose(), 300);
              }}
              onClose={onLayerClose}
              selected={pickupBranch}
            />
          </div>
        </div>
        <Action
          isVisible={!translated && isVisible}
          validated={validated}
          isOrdering={isOrdering}
          isOrdered={isOrdered}
          data={{ pickupBranch, order }}
          isFailed={isFailed}
          isLoading={isLoading}
          onClose={onClose}
          onClick={() => {
            if (validated.status) {
              onSubmit &&
                onSubmit(
                  materialsSameType.map((m) => m.pid),
                  pickupBranch,
                  mail?.value
                );
            } else {
              setHasTry(true);
            }
          }}
        />
      </div>
    </div>
  );
}

export function OrderSkeleton(props) {
  const { work, user, order } = data;

  return (
    <Order
      pid="some-pid"
      work={work}
      user={user}
      order={order}
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

  const [pid, setPid] = useState(null);

  const workId = `work-of:${pid}`;

  // Fetch work data
  const { data, isLoading, isSlow, error } = useData(
    workFragments.detailsAllManifestations({ workId })
  );

  const covers = useData(workFragments.covers({ workId }));

  // Fetch user data
  const { data: userData, error: userDataError } = useData(
    userFragments.basic()
  );
  const { data: orderPolicy, error: orderPolicyError } = useData(
    pid && userFragments.orderPolicy({ pid })
  );

  const orderMutation = useMutate();

  useEffect(() => {
    if (order) {
      // When order modal opens, we reset previous order status
      // making it possible to order a manifestation multiple times
      orderMutation.reset();

      setPid(order);
    }
  }, [order]);

  if (isLoading) {
    return <OrderSkeleton isSlow={isSlow} />;
  }

  if (error || userDataError) {
    return <div>Error :( !!!!!</div>;
  }

  const mergedWork = merge({}, covers.data, data);
  const mergedUser = merge({}, userData, orderPolicy);

  return (
    <Order
      work={mergedWork?.work}
      user={mergedUser?.user || {}}
      pid={pid}
      order={orderMutation}
      query={Router.query}
      onLayerChange={(layer) => handleLayer(layer)}
      onLayerClose={() => Router.back()}
      onSubmit={(pids, pickupBranch, email) => {
        orderMutation.post(
          submitOrder({
            pids,
            branchId: pickupBranch.branchId,
            email,
          })
        );
      }}
      {...props}
    />
  );
}
