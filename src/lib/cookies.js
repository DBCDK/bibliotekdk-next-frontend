/**
 * Builds a merged Cookie header string from existing request cookies and newly set cookies on the response.
 *
 * This function is useful in server-side environments (e.g., Next.js getServerSideProps) where cookies are
 * set using `res.setHeader('Set-Cookie', ...)`, but those cookies are not yet available on `req.headers.cookie`
 * or `req.cookies` in the same request lifecycle.
 *
 * By merging existing request cookies with new Set-Cookie headers, this allows you to forward an up-to-date
 * Cookie header to downstream HTTP requests (e.g., via fetch) **without waiting for the next user request**
 * (when the browser would normally include the cookie automatically).
 *
 * In addition, cookies marked for deletion (via 'Max-Age=0' or 'Expires') will be removed from the final header.
 */
export function buildCookieHeader(req, res) {
  // Split existing cookies into array of 'key=value' strings
  const existing = (req.headers.cookie || "")
    .split(";")
    .map((c) => c.trim())
    .filter(Boolean);

  // Extract 'key=value' from Set-Cookie headers in response (ignore attributes)
  const newCookies = []
    .concat(res.getHeader("set-cookie") || [])
    .filter(Boolean) // skip null/undefined
    .map((s) => s.split(";")[0]); // take only 'key=value' part

  // Combine existing and new cookies into a Map (new cookies overwrite same keys)
  const cookieMap = new Map(
    [...existing, ...newCookies].map((c) => c.split(/=(.+)/))
  );

  // Find cookie names that are marked for deletion (via Max-Age=0 or Expires)
  const deletions = []
    .concat(res.getHeader("set-cookie") || [])
    .filter(Boolean)
    .filter((s) => /max-age=0|expires=/i.test(s))
    .map((s) => s.split("=")[0]);

  // Remove deleted cookies from the map
  deletions.forEach((name) => cookieMap.delete(name));

  // Reconstruct the final 'key=value' cookie header string
  return Array.from(cookieMap)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}
