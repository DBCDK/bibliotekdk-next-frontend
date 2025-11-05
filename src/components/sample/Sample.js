// components/sample/Sample.jsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Button from "./button";
import Overlay from "./overlay";
import EpubSample from "./epub";

import styles from "./Sample.module.css";

const url = "https://samples.pubhub.dk/9788758817842.epub";

export default function Sample({ className = "" }) {
  const router = useRouter();
  const [show, setShow] = useState(false);

  // Hold state i sync med URL (loader + back/forward)
  useEffect(() => {
    if (!router.isReady) return;
    const inUrl = router.query.sample === "true";
    setShow((prev) => (prev !== inUrl ? inUrl : prev));
  }, [router.isReady, router.query.sample]);

  const open = () => {
    if (!router.isReady) return;
    if (router.query.sample !== "true") {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, sample: "true" },
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
    setShow(true);
  };

  const close = () => {
    if (!router.isReady) return;
    if (router.query.sample === "true") {
      // Fjern ?sample=true ved at gå et skridt tilbage i historikken
      router.back();
    } else {
      setShow(false);
    }
  };

  return (
    <>
      <Button className={`${styles.button} ${className}`} onClick={open} />

      <Overlay
        show={show}
        onShow={open} // hvis Overlay selv vil åbne (fx intern trigger)
        onHide={close} // når der lukkes med close-knap/ESC
        title={false}
        className={styles.overlay}
      >
        <EpubSample url={url} />
      </Overlay>
    </>
  );
}
