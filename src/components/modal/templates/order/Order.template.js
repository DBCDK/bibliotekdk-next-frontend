import Router from "next/router";
import filter from "lodash/filter";

import { useState, useEffect } from "react";
import merge from "lodash/merge";

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

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

function Order({ pid, work, isVisible, onClose }) {
  // translated state

  // layer state
  const [translated, setTranslated] = useState(false);
  const [activeLayer, setActiveLayer] = useState(null);

  // Order is validated state
  const [validated, setValidated] = useState(false);

  // Cleanup on modal close
  useEffect(() => {
    if (!isVisible) {
      setActiveLayer(null);
      setTranslated(false);
    }
  }, [isVisible]);

  function handleLayer(layer) {
    if (layer !== activeLayer) {
      setActiveLayer(layer);
    }
    setTranslated(true);
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
              className={`${styles.page} ${styles[`page-info`]}`}
              onLayerSelect={(layer) => handleLayer(layer)}
            />
          </div>
          <div className={styles.right}>
            <Edition
              className={`${styles.page} ${styles[`page-edition`]}`}
              onChange={(val) => console.log(val + " selected")}
              onClose={(e) => setTranslated(false)}
            />
            <Pickup
              className={`${styles.page} ${styles[`page-library`]}`}
              onChange={(val) => console.log(val + " selected")}
              onClose={() => setTranslated(false)}
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

  // use the useData hook to fetch data
  const { data, isLoading, isSlow, error } = useData(
    workFragments.basic({ workId })
  );

  const { data: detailsData, error: detailsError } = useData(
    workFragments.details({ workId })
  );

  const covers = useData(workFragments.covers({ workId }));

  if (isLoading) {
    return <OrderSkeleton isSlow={isSlow} />;
  }
  if (error || detailsError) {
    return <div>Error :( !!!!!</div>;
  }

  const merged = merge({}, covers.data, data, detailsData);

  return <Order work={merged.work} pid={order} {...props} />;
}
