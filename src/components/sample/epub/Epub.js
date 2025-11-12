// components/sample/epub/ReaderSample.jsx
"use client";
import dynamic from "next/dynamic";
import { useRef } from "react";

import Text from "@/components/base/text";
import Link from "@/components/base/link";

import { useEpubReader } from "./useEpubReader";
import EpubProgress from "./progress";
import styles from "./Epub.module.css";

const ReactReader = dynamic(
  () => import("react-reader").then((m) => m.ReactReader),
  { ssr: false }
);

export default function ReaderSample({ src, title, isFullscreen = false }) {
  const containerRef = useRef(null);

  const {
    readerKey,
    reactReaderProps,
    readerStyles,
    labels,
    segments,
    overallPctDerived,
    handleJump,
  } = useEpubReader({ src, title, isFullscreen, containerRef });

  return (
    <div className={`${styles.wrapper} readerWrapper`} ref={containerRef}>
      <ReactReader
        key={readerKey}
        readerStyles={readerStyles}
        {...reactReaderProps}
      />

      <EpubProgress
        labels={labels}
        segments={segments}
        overallPctDerived={overallPctDerived}
        onJump={handleJump}
        Link={Link}
        Text={Text}
      />
    </div>
  );
}
