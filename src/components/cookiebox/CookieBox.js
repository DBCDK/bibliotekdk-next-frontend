import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

import Button from "@/components/base/button";
import Link from "@/components/base/link";
import Text from "@/components/base/text/Text";
import translate from "@/components/base/translate";

import styles from "./CookieBox.module.css";

// The title of article to go in the URL
const POLICY_URL_TITLE = "privatlivspolitik";

// The ID of the article in the CMS
const POLICY_ARTICLE_ID = 11;

export const POLICY_ARTICLE_PATH = `/artikel/${POLICY_URL_TITLE}/${POLICY_ARTICLE_ID}`;

// The name of cookies
export const COOKIES_DENIED = "cookies_denied";
export const COOKIES_ALLOWED = "cookies_allowed";

/**
 * Hard refresh current page or go to frontpage.
 * We hard refresh to make sure Matomo script
 * is initialized properly with or without cookies
 */
function hardReload(toFronptage) {
  // we use setTimeout to make sure
  // cookie has been set before reloading
  setTimeout(() => {
    if (toFronptage) {
      location.href = "/";
    } else {
      location.reload();
    }
  }, 0);
}

/**
 * The CookieBox component
 *
 * @param {obj} props
 * @param {function} onAllowCookies
 * @param {function} onDenyCookies
 * @param {string} size
 *
 * @returns {component}
 */
export function CookieBox({ onAllowCookies, onDenyCookies, size }) {
  return (
    <div
      className={`${styles.fixedwrapper} ${styles[size]}`}
      data-cy="cookiebox"
    >
      <div className={styles.cookiebox}>
        <Text type="text1" className={styles.headline}>
          {translate({
            context: "cookiebox",
            label: "title",
          })}
        </Text>
        <Text type="text2" className={styles.description}>
          {translate({
            context: "cookiebox",
            label: "description",
          })}
        </Text>

        <div className={styles.bottom}>
          <Link
            border={{ top: false, bottom: { keepVisible: true } }}
            href={POLICY_ARTICLE_PATH}
          >
            <Text type="text2">
              {translate({
                context: "cookiebox",
                label: "policyTitle",
              })}
            </Text>
          </Link>
          <div className={`${styles.buttonwrapper}`}>
            <Button type="secondary" size="small" onClick={onAllowCookies}>
              {translate({
                context: "general",
                label: "ok",
              })}
            </Button>
            <Button type="secondary" size="small" onClick={onDenyCookies}>
              {translate({
                context: "general",
                label: "no",
              })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
CookieBox.propTypes = {
  onAllowCookies: PropTypes.func,
  onDenyCookies: PropTypes.func,
  size: PropTypes.oneOf(["small", "full"]),
};

/**
 * Component wrapping the CookieBox
 *
 * It is responsible for handling the cookie box state
 * by storing COOKIES_ALLOWED/COOKIES_DENIED cookie
 *
 * Also, it detects if user is on the cookie policy page,
 * showing CookieBox in a smaller variant
 *
 * @returns {component}
 */
export default function Wrapper() {
  const router = useRouter();
  const [currentDecision, setCurrentDecision] = useState(true);

  // If we are on the policy article page,
  // we show the small cookiebox with headline and buttons only
  const onPolicyPage = router.query.title === POLICY_URL_TITLE;
  const size = onPolicyPage ? "small" : "full";

  useEffect(() => {
    // Check if user did already deny or allow cookies
    if (Cookies.get(COOKIES_DENIED)) {
      setCurrentDecision(COOKIES_DENIED);
    } else if (Cookies.get(COOKIES_ALLOWED)) {
      setCurrentDecision(COOKIES_ALLOWED);
    } else {
      setCurrentDecision(false);
    }
  }, []);

  // If user already decided, don't show cookiebox
  // unless we are on the policy page, allowing user
  // to change decision
  if (currentDecision && !onPolicyPage) {
    return null;
  }

  return (
    <CookieBox
      size={size}
      onAllowCookies={() => {
        Cookies.remove(COOKIES_DENIED);
        Cookies.set(COOKIES_ALLOWED, "true", { expires: 365 });
        hardReload(onPolicyPage);
      }}
      onDenyCookies={() => {
        Cookies.remove(COOKIES_ALLOWED);
        Cookies.set(COOKIES_DENIED, "true", { expires: 7 });
        hardReload(onPolicyPage);
      }}
    />
  );
}
