import { log } from "dbc-node-logger";
import { incErrorCount } from "@/utils/errorCount";

const DELAY = 5000;
let lastMessage = 0;

/**
 * POST unhandled client side errors to this endpoint
 * It will only accept one message every X miliseconds (set by DELAY)
 * as we don't want our logs to get flooded.
 *
 * These errors are bugs and must be monitored and fixed
 *
 */
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(404).json({ message: "Nothing here" });
  }

  // Check that more than X miliseconds has passed
  const now = Date.now();
  if (now - lastMessage > DELAY) {
    lastMessage = now;
    let parsed;
    try {
      parsed = JSON.parse(req.body);
    } catch (e) {
      parsed = {};
    }
    incErrorCount();

    log.error("CLIENT SIDE ERROR", {
      clientError: {
        message: parsed.message?.slice(0, 500),
        stack: parsed.stack?.slice(0, 500),
        componentStack: parsed.componentStack?.slice(0, 500),
      },
    });
    res.status(200).json({ message: "OK" });
  } else {
    // not enough time has passed since last message
    res.status(200).json({ message: "OK" });
  }
}
