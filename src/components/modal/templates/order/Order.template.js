import Router from "next/router";
import filter from "lodash/filter";

import { useState, useEffect } from "react";
import merge from "lodash/merge";

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import * as userFragments from "@/lib/api/user.fragments";

import Divider from "@/components/base/divider";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";

// Layers
import Info from "./layers/info";
import Edition from "./layers/edition";
import Pickup from "./layers/pickup";

import styles from "./Order.module.css";

/**
 * Handles order action-button click
 */
function onOrderClick() {
  alert("Ordered!");
}

/**
 * Order Button
 */
function ActionButton({ onClick = null, isVisible, callback }) {
  const hiddenClass = !isVisible ? styles.hidden : "";

  return (
    <div className={`${styles.action} ${hiddenClass}`} aria-hidden={!isVisible}>
      <Button
        onClick={() => {
          //
          onClick && onClick();
          callback && callback();
        }}
      >
        Godkend
      </Button>
    </div>
  );
}

/**
 *  Order component function
 *
 * @param {*} param0
 * @returns component
 */

function Order({ pid, work, user, isVisible, onClose }) {
  // translated state

  // layer state
  const [translated, setTranslated] = useState(false);
  const [activeLayer, setActiveLayer] = useState(null);

  // Order is validated state
  const [validated, setValidated] = useState(false);

  // Cleanup on modal close
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

  function handleLayer(layer) {
    if (layer !== Router.query.modal) {
      // setActiveLayer(layer);
      // setTranslated(true);
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
    // cover = {},
    // description = "",
    // subjects = [],
    // path = [],
    materialTypes = [],
  } = work;

  // User props
  const { name, mail, agency, postalCode, address } = user;

  // Material by pid
  const material = filter(materialTypes, (o) => o.pid === pid)[0];

  const activePageClass = activeLayer ? styles[`active-${activeLayer}`] : "";
  const activeTranslatedClass = translated ? styles.translated : "";

  // Validated
  const validatedClass = validated ? styles.validated : "";

  // ${validatedClass}

  return (
    <div className={styles.order}>
      <div className={styles.container}>
        <div
          className={`${styles.wrap} ${activePageClass} ${activeTranslatedClass}`}
        >
          <div className={styles.left}>
            <Info
              work={work}
              user={user}
              className={`${styles.page} ${styles[`page-info`]}`}
              onLayerSelect={(layer) => {
                handleLayer(layer);
              }}
            />
          </div>
          <div className={styles.right}>
            <Edition
              className={`${styles.page} ${styles[`page-edition`]}`}
              onChange={(val) => console.log(val + " selected")}
              onClose={(e) => Router.back()}
            />
            <Pickup
              className={`${styles.page} ${styles[`page-library`]}`}
              onChange={(val) => console.log(val + " selected")}
              onClose={() => Router.back()}
            />
          </div>
        </div>
        <ActionButton
          isVisible={!translated}
          validated={validated}
          onClick={() => onOrderClick()}
          callback={() => {
            // some validation goes here...
            setValidated(true);
          }}
        />
      </div>
    </div>
  );
}

function OrderSkeleton({}) {
  return <div>loading...</div>;
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
    workFragments.basic({ workId })
  );
  const { data: detailsData, error: detailsError } = useData(
    workFragments.details({ workId })
  );

  const covers = useData(workFragments.covers({ workId }));

  // Fetch user data
  const { data: userData, error: userDataError } = useData(
    userFragments.basic()
  );

  if (isLoading) {
    return <OrderSkeleton isSlow={isSlow} />;
  }
  if (error || detailsError || userDataError) {
    return <div>Error :( !!!!!</div>;
  }

  const mergedWork = merge({}, covers.data, data, detailsData);

  return (
    <Order work={mergedWork.work} user={userData.user} pid={order} {...props} />
  );
}
