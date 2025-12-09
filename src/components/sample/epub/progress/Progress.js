// components/sample/epub/EpubProgress.jsx
import { useEffect, useRef, useMemo } from "react";
import styles from "./Progress.module.css";

export default function EpubProgress({
  labels,
  segments,
  overallPctDerived,
  onJump,
  Link,
  Text,
  show = true,
}) {
  const labelsRef = useRef(null);

  if (!show) return null;

  // Aktivt label (kapitel)
  const activeIndex = useMemo(
    () => labels.findIndex((it) => it.active),
    [labels]
  );

  const scrollToIndex = (index, behavior = "smooth") => {
    const container = labelsRef.current;
    if (!container) return;
    if (index == null || index < 0) return;
    if (typeof window !== "undefined" && window.innerWidth > 640) return; // kun mobil

    const child = container.children[index];
    if (!child) return;

    // Hvor langt inde i containeren ligger elementet?
    const childOffsetLeft = child.offsetLeft;

    // Hvis du har padding-left på .labels
    const paddingLeft = 0;

    let targetScrollLeft = childOffsetLeft - paddingLeft;

    // Clamp scrollLeft så vi ikke scroller for langt
    const containerWidth = container.clientWidth;
    const maxScroll = container.scrollWidth - containerWidth;
    if (maxScroll <= 0) return;

    if (targetScrollLeft < 0) targetScrollLeft = 0;
    if (targetScrollLeft > maxScroll) targetScrollLeft = maxScroll;

    container.scrollTo({
      left: targetScrollLeft,
      behavior,
    });
  };

  // Auto-scroll når aktivt kapitel skifter (fx ved sideskift)
  useEffect(() => {
    if (activeIndex === -1) return;
    scrollToIndex(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const handleLabelClick = (href, index) => {
    // Scroll pænt til det label, der blev klikket på
    scrollToIndex(index);
    onJump(href);
  };

  return (
    <div className={styles.progress}>
      {!!labels.length && (
        <div
          className={styles.labels}
          role="navigation"
          aria-label="Bogsektioner"
          style={{ ["--segments"]: segments }}
          ref={labelsRef}
        >
          {labels.map((it, i) => (
            <div
              className={`${styles.labelBtn} ${it.active ? styles.active : ""}`}
              key={`${it.href}-${i}`}
              style={{ width: `calc(100% / ${segments})` }}
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

      <div
        className={styles.progressTrack}
        style={{ ["--segments"]: segments }}
        aria-label="Bogprogress"
      >
        <div
          className={styles.progressFill}
          style={{ width: `${overallPctDerived}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(overallPctDerived)}
        />
      </div>
    </div>
  );
}
