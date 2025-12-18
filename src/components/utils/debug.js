// components/search/utils/debug.js
/**
 * Debug logger med namespaces + eksport af JSON.
 *
 * - Logger altid i non-production (server + browser).
 * - I production logger vi KUN hvis localStorage['SEARCH_SYNC_DEBUG'] === '1'.
 *
 * Globale helpers (browser):
 *   window.SEARCH_LOGS.download()   // download JSON
 *   window.SEARCH_LOGS.copy()       // copy JSON
 *   window.SEARCH_LOGS.clear()      // clear buffer
 *
 * Hotkeys (browser):
 *   Ctrl+Alt+D  → download logs
 *   Ctrl+Alt+C  → copy logs
 *   Ctrl+Alt+X  → clear logs
 */

function isProd() {
  try {
    return process.env.NODE_ENV === "production";
  } catch {
    return false;
  }
}

function loggingEnabledInBrowser() {
  if (!isProd()) return true;
  try {
    return (
      typeof window !== "undefined" &&
      window.localStorage?.getItem("SEARCH_SYNC_DEBUG") === "1"
    );
  } catch {
    return false;
  }
}

function loggingEnabledOnServer() {
  return !isProd();
}

function shouldLog() {
  if (typeof window === "undefined") {
    return loggingEnabledOnServer();
  }
  return loggingEnabledInBrowser();
}

// ring buffer
const MAX_LOGS = 5000;
function makeStore() {
  return {
    buffer: [],
    push(entry) {
      this.buffer.push(entry);
      if (this.buffer.length > MAX_LOGS) this.buffer.shift();
    },
    dump() {
      return this.buffer.slice();
    },
    clear() {
      this.buffer.length = 0;
    },
  };
}

const store = makeStore();

const NS_COLORS = {
  SYNC: "color:#fff;background:#0ea5e9;padding:2px 6px;border-radius:3px",
  CORE: "color:#fff;background:#10b981;padding:2px 6px;border-radius:3px",
  CTX: "color:#fff;background:#8b5cf6;padding:2px 6px;border-radius:3px",
  UI: "color:#111;background:#f59e0b;padding:2px 6px;border-radius:3px",
};
const DEFAULT_STYLE =
  "color:#111;background:#e2e8f0;padding:2px 6px;border-radius:3px";

/** Core dbg function */
export function dbgNS(ns, ...args) {
  const ts = new Date().toISOString();
  const entry = { ts, ns, args };
  store.push(entry);
  if (shouldLog()) {
    // eslint-disable-next-line no-console
    console.log(`%c${ns}`, NS_COLORS[ns] || DEFAULT_STYLE, ...args);
  }
}

/** Back-compat alias (nogle filer kaldte dbg()) */
export const dbg = (...args) => dbgNS("SYNC", ...args);

/** Namespaced helpers */
export const dbgSYNC = (...a) => dbgNS("SYNC", ...a);
export const dbgCORE = (...a) => dbgNS("CORE", ...a);
export const dbgCTX = (...a) => dbgNS("CTX", ...a);
export const dbgUI = (...a) => dbgNS("UI", ...a);

/** Udskriv buffer pænt til console (for at undgå "er ikke en funktion"-fejl) */
export function flushDebugToConsole() {
  try {
    // eslint-disable-next-line no-console
    console.log(prettyDump());
  } catch {}
}

/** Utilities til browser UI */
function toBlobUrl(json) {
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  return URL.createObjectURL(blob);
}

function download(filename, json) {
  try {
    const url = toBlobUrl(json);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {}
}

function prettyDump() {
  const data = store.dump();
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      env: process.env.NODE_ENV,
      count: data.length,
      logs: data,
    },
    null,
    2
  );
}

function ensureGlobals() {
  if (typeof window === "undefined") return;
  if (!window.SEARCH_LOGS) {
    window.SEARCH_LOGS = {
      download: () => download("search-debug.json", prettyDump()),
      copy: async () => {
        try {
          await navigator.clipboard.writeText(prettyDump());
          // eslint-disable-next-line no-console
          console.log("[SEARCH_LOGS] Copied to clipboard");
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("[SEARCH_LOGS] Clipboard failed", e);
        }
      },
      clear: () => {
        store.clear();
        // eslint-disable-next-line no-console
        console.log("[SEARCH_LOGS] Cleared");
      },
    };
  }
}

function installHotkeys() {
  if (typeof window === "undefined") return;
  if (window.__SEARCH_LOGS_HOTKEYS__) return;
  window.__SEARCH_LOGS_HOTKEYS__ = true;

  window.addEventListener("keydown", (e) => {
    if (!e.ctrlKey || !e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "d") {
      e.preventDefault();
      window.SEARCH_LOGS?.download();
    } else if (k === "c") {
      e.preventDefault();
      window.SEARCH_LOGS?.copy();
    } else if (k === "x") {
      e.preventDefault();
      window.SEARCH_LOGS?.clear();
    }
  });
}

function installFloatingButton() {
  if (typeof window === "undefined") return;
  if (!shouldLog()) return;
  if (document.getElementById("search-logs-dock")) return;

  const btn = document.createElement("button");
  btn.id = "search-logs-dock";
  btn.textContent = "⬇︎ Debug";
  btn.title = "Download search-debug.json (Ctrl+Alt+D)";
  Object.assign(btn.style, {
    position: "fixed",
    right: "12px",
    bottom: "12px",
    zIndex: 99999,
    border: "none",
    borderRadius: "999px",
    padding: "8px 12px",
    fontFamily: "system-ui, sans-serif",
    fontSize: "12px",
    cursor: "pointer",
    background: "#0ea5e9",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    opacity: "0.85",
  });
  btn.addEventListener("mouseenter", () => (btn.style.opacity = "1"));
  btn.addEventListener("mouseleave", () => (btn.style.opacity = "0.85"));
  btn.addEventListener("click", () => window.SEARCH_LOGS?.download());
  document.body.appendChild(btn);
}

// init i browser
if (typeof window !== "undefined") {
  ensureGlobals();
  installHotkeys();
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(installFloatingButton, 0);
  } else {
    window.addEventListener("DOMContentLoaded", installFloatingButton, {
      once: true,
    });
  }
}
