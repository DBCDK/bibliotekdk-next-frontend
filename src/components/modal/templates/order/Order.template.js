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
import Translate from "@/components/base/translate";

import styles from "./Order.module.css";

function Order({ pid, work, isVisible, onClose }) {
  // Edition state
  const [activePage, setActivePage] = useState("default");

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

  const activePageClass = styles[`active-${activePage}`];

  return (
    <div className={styles.order}>
      <div className={`${styles.container} ${activePageClass}`}>
        <div className={styles.left}>
          <div className={`${styles.page} ${styles[`page-default`]}`}>
            Default
            <br />
            <br />
            <Link
              onClick={(e) => {
                e.preventDefault();
                setActivePage("edition");
              }}
            >
              Vælg udgave
            </Link>
            <br />
            <Link
              onClick={(e) => {
                e.preventDefault();
                setActivePage("library");
              }}
            >
              Vælg bibliotek
            </Link>
          </div>
        </div>
        <div className={styles.right}>
          <div className={`${styles.page} ${styles[`page-edition`]}`}>
            Edition
            <br />
            <br />
            <Link
              onClick={(e) => {
                e.preventDefault();
                setActivePage("default");
              }}
            >
              Tilbage
            </Link>
          </div>
          <div className={`${styles.page} ${styles[`page-library`]}`}>
            Library
            <br />
            <br />
            <Link
              onClick={(e) => {
                e.preventDefault();
                setActivePage("default");
              }}
            >
              Tilbage
            </Link>
          </div>
        </div>
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

  console.log("workId", workId);

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
