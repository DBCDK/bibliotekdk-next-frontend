const truthyValues = new Set(["1", "true", "yes", "on"]);

function isEnvEnabled(value) {
  return typeof value === "string" && truthyValues.has(value.trim().toLowerCase());
}

export function getSecureCookieEnabled() {
  if (isEnvEnabled(process.env.DISABLE_SECURE_COOKIES)) {
    return false;
  }

  if (isEnvEnabled(process.env.CYPRESS)) {
    return false;
  }

  return process.env.NODE_ENV === "production";
}
