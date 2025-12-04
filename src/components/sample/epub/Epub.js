// components/sample/epub/ReaderSample.jsx
"use client";
import dynamic from "next/dynamic";
import { useRef } from "react";

import Text from "@/components/base/text";
import Link from "@/components/base/link";

import ArrowSvg from "@/public/icons/arrowleft.svg";

import { useEpubReader } from "./useEpubReader";
import EpubProgress from "./progress";
import styles from "./Epub.module.css";
import useBreakpoint from "@/components/hooks/useBreakpoint";

const ReactReader = dynamic(
  () => import("react-reader").then((m) => m.ReactReader),
  { ssr: false }
);

export default function ReaderSample({ src, title, isFullscreen = false }) {
  const containerRef = useRef(null);

  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs";

  const {
    readerKey,
    reactReaderProps,
    readerStyles,
    labels,
    segments,
    overallPctDerived,
    handleJump,
    atBookStart,
    atBookEnd,
    handlePrev,
    handleNext,
    progressEnabled,
  } = useEpubReader({ src, title, isFullscreen, containerRef });

  return (
    <div className={`${styles.wrapper} readerWrapper`} ref={containerRef}>
      <ReactReader
        key={readerKey}
        readerStyles={readerStyles}
        swipeable={isMobile}
        {...reactReaderProps}
      />

      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={handlePrev}
        disabled={atBookStart}
        aria-label="Forrige side"
      >
        <ArrowSvg />
      </button>

      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={handleNext}
        disabled={atBookEnd}
        aria-label="Næste side"
      >
        <ArrowSvg />
      </button>

      <EpubProgress
        labels={labels}
        segments={segments}
        overallPctDerived={overallPctDerived}
        onJump={handleJump}
        Link={Link}
        Text={Text}
        show={progressEnabled}
      />
    </div>
  );
}
