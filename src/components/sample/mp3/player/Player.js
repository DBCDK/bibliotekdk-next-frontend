"use client";

import { useEffect, useRef, useState, useCallback } from "react";

import styles from "./Player.module.css";

/**
 * Lille, tilgængelig mp3-afspiller.
 * Props:
 * - src: string (mp3 URL) — kræves
 * - title: string (til screenreaders og tooltip) — anbefales
 * - className: string (valgfri ekstra styling)
 */
export default function AudioSample({
  src,
  title = "Lydbogssample",
  className = "",
}) {
  const audioRef = useRef(null);
  const rafRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  // Format mm:ss
  const fmt = useCallback((t) => {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  const step = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    setCurrent(a.currentTime || 0);
    if (!a.paused) {
      rafRef.current = requestAnimationFrame(step);
    }
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onLoaded = () => {
      setDuration(a.duration || 0);
      setIsLoading(false);
      setError("");
    };

    const onPlay = () => {
      setIsPlaying(true);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(step);
    };

    const onPause = () => {
      setIsPlaying(false);
      cancelAnimationFrame(rafRef.current);
      setCurrent(a.currentTime || 0);
    };

    const onEnded = () => {
      setIsPlaying(false);
      cancelAnimationFrame(rafRef.current);
      setCurrent(a.duration || 0);
    };

    const onError = () => {
      setError("Kunne ikke indlæse lydfilen.");
      setIsLoading(false);
      setIsPlaying(false);
      cancelAnimationFrame(rafRef.current);
    };

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onError);

    // Hvis metadata allerede er loadet (navigationscache), sync state
    if (a.readyState >= 1) {
      onLoaded();
      setCurrent(a.currentTime || 0);
    }

    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onError);
      cancelAnimationFrame(rafRef.current);
    };
  }, [step]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().catch(() => {
        // Nogle browsere kræver brugerinteraktion
        setError("Tryk på Play for at starte afspilning.");
      });
    } else {
      a.pause();
    }
  };

  const onSeek = (e) => {
    const a = audioRef.current;
    if (!a) return;
    const t = Number(e.target.value);
    a.currentTime = t;
    setCurrent(t);
  };

  const percent = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div
      className={`${styles.wrapper} ${className}`}
      role="group"
      aria-label={title}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata" // hurtig metadata, men uden at hente hele filen
        aria-hidden="true"
      />

      <button
        type="button"
        className={styles.play}
        onClick={toggle}
        aria-label={isPlaying ? "Pause" : "Afspil"}
        title={isPlaying ? "Pause" : "Afspil"}
        disabled={!!error}
      >
        {isPlaying ? (
          // Pause-ikon
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          // Play-ikon
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <polygon points="8,5 19,12 8,19" />
          </svg>
        )}
      </button>

      <div className={styles.timeline}>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step="0.1"
          value={current}
          onChange={onSeek}
          className={styles.range}
          aria-label="Søg i lyd"
          disabled={isLoading || !!error || !isFinite(duration)}
        />
        <div className={styles.progress} style={{ width: `${percent}%` }} />
      </div>

      <div className={styles.time}>
        <span className={styles.now}>{fmt(current)}</span>
        <span className={styles.sep}>/</span>
        <span className={styles.total}>{isLoading ? "…" : fmt(duration)}</span>
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
