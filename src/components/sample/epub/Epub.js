"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";

import Text from "@/components/base/text";
import Link from "@/components/base/link";
import ArrowSvg from "@/public/icons/arrowleft.svg";

import { useEpubBinary } from "./useEpubBinary";
import { useEpubReader } from "./useEpubReader";
import EpubProgress from "./progress/Progress";

import styles from "./Epub.module.css";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import Spinner from "./spinner";
import Error from "./error";

export default function Epub({ src, data, isFullscreen = false }) {
  // DOM refs
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  // UI state
  const [retryLoading, setRetryLoading] = useState(false);
  const retryTimerRef = useRef(null);

  // Device / env
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs";

  const debugEnabled =
    process.env.NEXT_PUBLIC_EPUB_DEBUG === "1" ||
    process.env.NODE_ENV === "development";

  // Options (memoized so hooks don't refetch unnecessarily)
  const binaryOptions = useMemo(
    () => ({
      enabled: debugEnabled,
      useProxy: false,
    }),
    [debugEnabled]
  );

  // Binary fetch/sanitize
  const {
    buffer,
    error: loadError,
    version,
    retry: retryBinary,
  } = useEpubBinary(src, binaryOptions);

  // Book identity
  const bookId =
    data?.access?.find?.((a) => a?.__typename === "Publizon")?.sample ||
    data?.title ||
    src;

  // Reader (epubjs init/render)
  const {
    status,
    initError,

    labels,
    segments,
    segIndex,
    chapterIntra,

    atBookStart,
    atBookEnd,

    handlePrev,
    handleNext,
    handleJump,

    progressEnabled,
    retry: retryReader,
  } = useEpubReader({
    src: buffer,
    isFullscreen,
    containerRef,
    viewerRef,
    debugEnabled,
    swipeable: isMobile,
    bookId,
    title: data?.title,
  });

  // Derived state
  const error = loadError || initError;

  const showSpinner = status === "loading" || retryLoading;
  const showError = !!error && !retryLoading;
  const showProgress = progressEnabled && !error;

  // Ensure we don't leave timers around
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  const onRetry = useCallback(() => {
    // Kick spinner immediately and keep it at least 1s
    setRetryLoading(true);

    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    retryTimerRef.current = setTimeout(() => {
      setRetryLoading(false);
      retryTimerRef.current = null;
    }, 1000);

    // Retry binary if that was the error, otherwise retry reader
    if (loadError) {
      retryBinary();
      retryReader();
    } else {
      retryReader();
    }
  }, [loadError, retryBinary, retryReader]);

  return (
    <div className={`${styles.wrapper} readerWrapper`} ref={containerRef}>
      {/* Remount viewer DOM on version bumps for a clean epubjs host */}
      <div key={version} className={styles.innerWrapper} ref={viewerRef} />

      <Spinner show={showSpinner} />

      <Error show={showError} error={error} onRetry={onRetry} />

      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={handlePrev}
        disabled={atBookStart || status !== "ready"}
        aria-label="Forrige side"
      >
        <ArrowSvg />
      </button>

      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={handleNext}
        disabled={atBookEnd || status !== "ready"}
        aria-label="Næste side"
      >
        <ArrowSvg />
      </button>

      <EpubProgress
        labels={labels}
        segments={segments}
        segIndex={segIndex}
        chapterIntra={chapterIntra}
        atBookEnd={atBookEnd}
        onJump={handleJump}
        Link={Link}
        Text={Text}
        show={showProgress}
        expanded={isFullscreen}
      />
    </div>
  );
}
