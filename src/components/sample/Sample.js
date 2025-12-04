import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

// components/sample/Sample.jsx
import Button from "./button";
import Overlay from "./overlay";
import ReaderSample from "./epub";
import AudioSample from "./mp3";

import { useData } from "@/lib/api/api";
import { publizonSamples } from "@/lib/api/work.fragments";

import styles from "./Sample.module.css";
import { selectPublizonSample } from "./utils";
import Disclaimer from "./disclaimer";

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
  const access = data?.access?.find?.((a) => a?.__typename === "Publizon");

  // Return null if no publizon access type was found
  if (!access) {
    return null;
  }

  // Test url samples
  // const url = "https://samples.pubhub.dk/9788758817842.epub";
  // const url = "https://samples.pubhub.dk/9788741509884.mp3";
  const url = access?.sample;

  // access sample format
  const isEpub = access?.format === "epub";
  const isMp3 = access?.format === "mp3";

  return (
    <>
      <Button
        className={`${styles.button} ${className}`}
        format={access?.format}
        onClick={onOpen}
      />
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
        <Disclaimer data={data} />
        {isEpub && (
          <ReaderSample src={url} data={data} isFullscreen={isFullscreen} />
        )}
        {isMp3 && <AudioSample src={url} data={data} />}
      </Overlay>
    </>
  );
}

// WRAP: data + routing + filtrering (minimale ændringer i øvrigt)
export default function Wrap(props) {
  // const {
  //   specificMaterialType: specificMaterialTypeFromProps = null,
  //   workId: workIdFromProps = null,
  // } = props;

  const router = useRouter();

  const { workId: workIdFromUrl, type: typeFromUrl } = router.query;

  const workId = workIdFromUrl || null;

  const SpecificSelectedMaterialType = typeFromUrl || null;

  // Hold state i sync med URL (loader + back/forward) — uændret logik
  const [show, setShow] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    data: samples,
    error,
    isLoading,
  } = useData(publizonSamples({ workId }));

  const manifestations = samples?.work?.manifestations?.mostRelevant || [];

  // Filtrér manifestationer
  const data = useMemo(
    () => selectPublizonSample(manifestations, SpecificSelectedMaterialType),
    [manifestations, SpecificSelectedMaterialType]
  );

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
      router.back();
    } else {
      setShow(false);
    }
  };

  const handleToggleFullscreen = () => setIsFullscreen((v) => !v);

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <Button
        isLoading={isLoading}
        className={`${styles.button} ${props.className}`}
      />
    );
  }

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
