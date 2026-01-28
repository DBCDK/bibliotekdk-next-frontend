import { useEffect, useMemo, useRef, useState } from "react";
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

  if (!access) return null;

  const url = access.sample;
  const isEpub = access.format === "epub";
  const isMp3 = access.format === "mp3";

  return (
    <>
      <Button
        className={`${styles.button} ${className}`}
        format={access.format}
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
        {isEpub && (
          <ReaderSample src={url} data={data} isFullscreen={isFullscreen} />
        )}
        {isMp3 && <AudioSample src={url} data={data} />}
        <Disclaimer data={data} className={styles.disclaimer} />
      </Overlay>
    </>
  );
}

export default function Wrap(props) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { workId, type } = props;

  /**
   * Was sample=true present when the page first loaded?
   * (deep link vs user interaction)
   */
  const hadSampleOnMountRef = useRef(null);

  /**
   * Did *we* push sample=true during this session?
   * (used to decide between back() vs replace())
   */
  const didPushSampleRef = useRef(false);

  const {
    data: samples,
    error,
    isLoading,
  } = useData(workId && publizonSamples({ workId }));

  const manifestations = samples?.work?.manifestations?.mostRelevant || [];

  const data = useMemo(
    () => selectPublizonSample(manifestations, type),
    [manifestations, type]
  );

  /**
   * Sync modal visibility with URL
   */
  useEffect(() => {
    if (!router.isReady) return;

    const inUrl = router.query.sample === "true";

    if (hadSampleOnMountRef.current === null) {
      hadSampleOnMountRef.current = inUrl;
    }

    setShow(inUrl);
  }, [router.isReady, router.query.sample]);

  /**
   * Open modal
   * -> push sample=true so back-button can close it
   */
  const handleOpen = () => {
    if (!router.isReady) return;

    if (router.query.sample !== "true") {
      didPushSampleRef.current = true;

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

  /**
   * Close modal
   *
   * Case 1: User opened modal -> router.back()
   * Case 2: Deep link -> remove sample=true via replace()
   */
  const handleClose = () => {
    if (!router.isReady) return;

    if (router.query.sample !== "true") {
      setShow(false);
      return;
    }

    const hadSampleOnMount = hadSampleOnMountRef.current === true;
    const didPushSample = didPushSampleRef.current === true;

    // Opened by user -> back closes modal
    if (!hadSampleOnMount && didPushSample) {
      didPushSampleRef.current = false;
      router.back();
      return;
    }

    // Deep link -> remove sample param without leaving page
    const rest = { ...router.query };
    delete rest.sample;

    router.replace(
      {
        pathname: router.pathname,
        query: rest,
      },
      undefined,
      { shallow: true, scroll: false }
    );

    setShow(false);
  };

  const handleToggleFullscreen = () => setIsFullscreen((v) => !v);

  if (error) return null;

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
