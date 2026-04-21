/**
 * Header utility helpers for febib-serve request metadata.
 *
 * Normalizes common header values and extracts client IP based on
 * `x-forwarded-for` first hop with socket address fallback.
 */
function getHeaderValue(header) {
  if (Array.isArray(header)) return header.join(", ");
  return header;
}

function extractClientIp(req) {
  const forwardedFor = getHeaderValue(req.headers["x-forwarded-for"]);
  const ipFromForwardedFor =
    typeof forwardedFor === "string" ? forwardedFor.split(",")[0]?.trim() : undefined;
  return ipFromForwardedFor || req.socket?.remoteAddress;
}

module.exports = {
  getHeaderValue,
  extractClientIp,
};
