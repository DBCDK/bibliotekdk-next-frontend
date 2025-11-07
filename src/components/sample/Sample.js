// components/sample/Sample.jsx
import Button from "./button";
import Overlay from "./overlay";
import ReaderSample from "./epub";
import AudioSample from "./mp3";

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import styles from "./Sample.module.css";

// SAMPLE: kun UI (modtager alt via props)
export function Sample({
  className = "",
  show,
  onOpen,
  onClose,
  onToggle,
  isFullscreen,
  data,
}) {
  // Samme default URL som før (kan nemt byttes ud senere)
  const url = "https://samples.pubhub.dk/9788758817842.epub";
  // const url = "https://samples.pubhub.dk/9788741509884.mp3";

  // url filetype format (uændret logik, nu bare her)
  const isEpub = url.toLowerCase().endsWith(".epub");
  const isMp3 = url.toLowerCase().endsWith(".mp3");

  return (
    <>
      <Button className={`${styles.button} ${className}`} onClick={onOpen} />

      <Overlay
        show={show}
        onShow={onOpen}
        onHide={onClose}
        onToggle={onToggle}
        isFullscreen={isFullscreen}
        data={data}
        isEpub={isEpub}
        isMp3={isMp3}
        className={styles.overlay}
      >
        {isEpub && (
          <ReaderSample src={url} data={data} isFullscreen={isFullscreen} />
        )}
        {isMp3 && <AudioSample src={url} data={data} />}
      </Overlay>
    </>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

// WRAP: data + routing + filtrering (minimale ændringer i øvrigt)
export default function Wrap(props) {
  const { workId, selectedPids } = props;
  const router = useRouter();

  const cWork = useData(workFragments.cacheWork({ workId }));
  const work = cWork?.data?.work;

  // Filtrér manifestationer
  const data = useMemo(() => {
    if (!work) return null;
    if (!selectedPids?.length) return work;

    const mostRelevant = (work.manifestations?.mostRelevant ?? []).filter((m) =>
      selectedPids.includes(m.pid)
    );

    return {
      ...work,
      manifestations: { ...(work.manifestations ?? {}), mostRelevant },
    };
  }, [work, selectedPids]);

  // Hold state i sync med URL (loader + back/forward) — uændret logik
  const [show, setShow] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const inUrl = router.query.sample === "true";
    setShow((prev) => (prev !== inUrl ? inUrl : prev));
  }, [router.isReady, router.query.sample]);

  const handleOpen = () => {
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

  const handleClose = () => {
    if (!router.isReady) return;
    if (router.query.sample === "true") {
      // Fjern ?sample=true (uden ekstra history-step kan du evt. bruge replace)
      router.back();
    } else {
      setShow(false);
    }
  };

  const handleToggleFullscreen = () => setIsFullscreen((v) => !v);

  return (
    <Sample
      {...props}
      show={show}
      onOpen={handleOpen}
      onClose={handleClose}
      onToggle={handleToggleFullscreen}
      isFullscreen={isFullscreen}
      data={data}
    />
  );
}
