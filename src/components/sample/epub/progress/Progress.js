// components/sample/epub/progress/Progress.js
import { useEffect, useMemo, useRef } from "react";
import styles from "./Progress.module.css";

export default function EpubProgress({
  labels,
  segments,
  segIndex,
  chapterIntra,
  atBookEnd,
  onJump,
  Link,
  Text,
  show = true,
}) {
  const labelsRef = useRef(null);

  // Active label index (only meaningful when labels include many chapters)
  const activeIndex = useMemo(
    () => labels.findIndex((it) => it.active),
    [labels]
  );

  const scrollToIndex = (index, behavior = "smooth") => {
    const container = labelsRef.current;
    if (!container) return;
    if (index == null || index < 0) return;
    if (typeof window !== "undefined" && window.innerWidth > 640) return; // mobile only

    const child = container.children[index];
    if (!child) return;

    const childOffsetLeft = child.offsetLeft;

    let targetScrollLeft = childOffsetLeft;

    const containerWidth = container.clientWidth;
    const maxScroll = container.scrollWidth - containerWidth;
    if (maxScroll <= 0) return;

    if (targetScrollLeft < 0) targetScrollLeft = 0;
    if (targetScrollLeft > maxScroll) targetScrollLeft = maxScroll;

    container.scrollTo({ left: targetScrollLeft, behavior });
  };

  useEffect(() => {
    if (!show) return;
    if (activeIndex === -1) return;
    scrollToIndex(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, activeIndex]);

  const handleLabelClick = (href, index) => {
    scrollToIndex(index);
    onJump(href);
  };

  if (!show) return null;

  const labelCount = Math.max(1, labels?.length || 1);
  const segCount = Math.max(1, Number(segments) || 1);

  // Fill per progress segment (this fixes the “only first bar fills then resets” bug)
  const fillPctForSegment = (i) => {
    if (atBookEnd) return 100;

    if (i < segIndex) return 100;
    if (i > segIndex) return 0;

    // i === segIndex
    const pct = Math.round(Math.max(0, Math.min(1, chapterIntra || 0)) * 100);
    return pct;
  };

  return (
    <div className={styles.progress}>
      {!!labels.length && (
        <div
          className={styles.labels}
          role="navigation"
          aria-label="Bogsektioner"
          ref={labelsRef}
        >
          {labels.map((it, i) => (
            <div
              className={`${styles.labelBtn} ${it.active ? styles.active : ""}`}
              key={`${it.href}-${i}`}
              style={{ width: `calc(100% / ${labelCount})` }}
            >
              <Link
                title={it.label}
                onClick={() => handleLabelClick(it.href, i)}
                className={styles.labelText}
                aria-current={it.active ? "true" : undefined}
              >
                <Text type="text5">{it.label}</Text>
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className={styles.progressTrack} aria-label="Bogprogress">
        <div
          className={styles.progressSegments}
          style={{ ["--segments"]: segCount }}
        >
          {Array.from({ length: segCount }).map((_, i) => {
            const pct = fillPctForSegment(i);
            return (
              <div
                key={i}
                className={styles.progressSegment}
                role="progressbar"
                aria-label={`Sektion ${i + 1}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <div
                  className={styles.progressFill}
                  style={{ width: `${pct}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
