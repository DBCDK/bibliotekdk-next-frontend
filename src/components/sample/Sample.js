// components/sample/Sample.jsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Button from "./button";
import Overlay from "./overlay";
import ReaderSample from "./epub";

import styles from "./Sample.module.css";
import AudioSample from "./mp3";

// const url = "https://samples.pubhub.dk/9788758817842.epub";
const url = "https://samples.pubhub.dk/9788741509884.mp3";

export function Sample({ className = "" }) {
  const router = useRouter();
  const [show, setShow] = useState(false);

  // url filetype format
  const isEpub = url.toLowerCase().endsWith(".epub");
  const isMp3 = url.toLowerCase().endsWith(".mp3");

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
        {isEpub && <ReaderSample url={url} />}
        {isMp3 && <AudioSample src={url} />}
      </Overlay>
    </>
  );
}

export default function Wrap(props) {
  return <Sample {...props} />;
}
