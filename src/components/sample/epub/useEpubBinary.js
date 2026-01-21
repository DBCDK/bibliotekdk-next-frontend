"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { sanitizeEpubZip } from "./utils/sanitizeEpubZip";

function createEpubDebug(enabled) {
  const started = Date.now();
  const events = [];
  const data = {};

  const add = (type, payload = {}) => {
    if (!enabled) return;
    events.push({ t: Date.now() - started, type, payload });
  };

  const set = (k, v) => {
    if (!enabled) return;
    data[k] = v;
  };

  const err = (e, ctx = {}) =>
    add("error", {
      ctx,
      name: e?.name,
      message: e?.message,
      stack: e?.stack,
    });

  return {
    add,
    set,
    err,
    bundle(extra = {}) {
      return {
        startedAt: started,
        durationMs: Date.now() - started,
        data,
        events,
        extra,
      };
    },
  };
}

async function fetchEpubArrayBuffer(url, { signal, debug } = {}) {
  debug?.add("fetch:start", { url });

  const res = await fetch(url, {
    method: "GET",
    signal,
    redirect: "follow",
    headers: {
      Accept: "application/epub+zip,application/octet-stream,*/*",
    },
  });

  debug?.add("fetch:response", {
    status: res.status,
    ok: res.ok,
    contentType: res.headers.get("content-type"),
    contentLength: res.headers.get("content-length"),
    finalUrl: res.url,
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    const e = new Error(
      `EPUB fetch failed (${res.status}): ${t.slice(0, 200)}`
    );
    debug?.err(e, { step: "fetch:not-ok" });
    throw e;
  }

  const buf = await res.arrayBuffer();
  debug?.set("bytes", buf.byteLength);

  const u8 = new Uint8Array(buf);
  debug?.set("zipMagic", u8[0] === 0x50 && u8[1] === 0x4b); // PK
  debug?.add("fetch:done");

  return buf;
}

export function useEpubBinary(
  srcUrl,
  { enabled = true, useProxy = false } = {}
) {
  const debug = useMemo(() => createEpubDebug(enabled), [enabled]);

  const [buffer, setBuffer] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // version bruges gerne som key i UI for at remounte viewer
  const [version, setVersion] = useState(0);

  // retryCount bruges kun til at trigge effect igen (refetch)
  const [retryCount, setRetryCount] = useState(0);

  const abortRef = useRef(null);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    let alive = true;

    setBuffer(null);
    setError(null);
    setVersion((v) => v + 1);
    setIsLoading(true);

    if (!srcUrl || typeof srcUrl !== "string") {
      // Hvis du vil have hard error i stedet, kan du sætte setError her.
      setIsLoading(false);
      return;
    }

    abortRef.current?.abort?.();
    abortRef.current = new AbortController();

    (async () => {
      try {
        const url = useProxy
          ? `/api/epub-proxy?url=${encodeURIComponent(srcUrl)}`
          : srcUrl;

        let buf = await fetchEpubArrayBuffer(url, {
          signal: abortRef.current.signal,
          debug,
        });

        // Sanitize (encoding fixes osv.) — må aldrig blokere læsning
        try {
          const r = await sanitizeEpubZip(buf, { debug });
          debug?.add("sanitize:result", {
            sanitized: r?.sanitized,
            patchedFiles: r?.report?.patchedFiles?.length ?? 0,
            opfPath: r?.report?.opfPath ?? null,
          });

          // Guard: kun overskriv hvis vi fik en gyldig buffer tilbage
          if (
            r?.buffer &&
            r.buffer instanceof ArrayBuffer &&
            r.buffer.byteLength > 0
          ) {
            buf = r.buffer;
            debug?.set("bytesAfterSanitize", buf.byteLength);
          } else {
            debug?.add("sanitize:skip", { reason: "missing/invalid buffer" });
          }
        } catch (se) {
          debug?.err(se, { step: "sanitize:failed" });
        }

        if (!alive) return;
        setBuffer(buf);
      } catch (e) {
        if (!alive) return;

        // ✅ Abort er ikke en “rigtig” fejl i UI
        if (e?.name === "AbortError") return;

        setError(e);
        debug.err(e, { step: "useEpubBinary" });
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
      abortRef.current?.abort?.();
      setIsLoading(false);
    };
  }, [srcUrl, useProxy, debug, retryCount]);

  return {
    buffer,
    error,
    isLoading,
    version,
    retry,
    getDebugBundle: (extra = {}) =>
      debug.bundle({ srcUrl, retryCount, ...extra }),
  };
}
