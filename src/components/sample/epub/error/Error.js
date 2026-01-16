"use client";

import { useMemo } from "react";

import Translate from "@/components/base/translate";

import styles from "./Error.module.css";

function normalizeError(err) {
  if (!err) return null;

  const defaultMessage = Translate({
    context: "publizon",
    label: "epub-unknown-error-message",
  });

  if (typeof err === "string") {
    return { message: err };
  }

  if (err instanceof Error) {
    return {
      message: err.message || defaultMessage,
      details: err.stack && err.stack !== err.message ? err.stack : null,
    };
  }

  if (typeof err === "object") {
    const message = err.message || err.error || err.title || defaultMessage;

    const details =
      err.stack ||
      (Object.keys(err).length > 1 ? JSON.stringify(err, null, 2) : null);

    return { message, details };
  }

  return { message: String(err) };
}

export default function Error({ show, error, onRetry, disabled }) {
  const normalized = useMemo(() => normalizeError(error), [error]);

  if (!show || !normalized) return null;

  const { message } = normalized;

  const title = Translate({ context: "publizon", label: "epub-error-title" });
  const retryLabel = Translate({ context: "general", label: "retry" });

  return (
    <div
      className={styles.backdrop}
      role="alert"
      aria-live="assertive"
      aria-label={title}
    >
      <div className={styles.card}>
        <div className={styles.badge} aria-hidden="true">
          !
        </div>

        <div className={styles.content}>
          <div className={styles.title}>{title}</div>

          {message ? <div className={styles.message}>{message}</div> : null}

          <div className={styles.actions}>
            {onRetry ? (
              <button type="button" className={styles.button} onClick={onRetry}>
                {retryLabel}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
