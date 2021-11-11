import styles from "./Feedback.module.css";
import Text from "@/components/base/text/Text";
import Icon from "@/components/base/icon/Icon";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Cookies from "js-cookie";

/**
 * @param sessioneTime
 * timer to show full feedback - defaults to 3 minutes
 * @param cookietime
 * timeout for cookie (milliseconds) - defaults to one week
 * @return {JSX.Element}
 * @constructor
 */
export default function Feedback({
  cookietime = 604800000,
  sessioneTime = 120000,
}) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const cookie = Cookies.get("removefeedback");

  const handleCookie = (type) => {
    if (type === "click") {
      if (!cookie) {
        Cookies.set("removefeedback", `${Date.now()}`, { sameSite: "lax" });
      }
      setFeedbackOpen(!feedbackOpen);
    }
    // page is loaded - check time
    if (type === "load") {
      if (cookie) {
        // check if cookie was set more than ({cookietime}) ago
        if (Date.now() - cookie > cookietime) {
          Cookies.remove("removefeedback");
        }
      } else {
        setTimeout(
          () => {
            setFeedbackOpen(!feedbackOpen);
          },
          sessioneTime,
          "feedbacktimer"
        );
      }
    }
  };

  useEffect(() => {
    handleCookie("load");
  }, []);

  return (
    <div data-cy="feedback-wrapper" className={styles.feedbackwrap}>
      <div
        className={classNames(
          feedbackOpen ? styles.feedbackopen : styles.feedbackclosed
        )}
      >
        <div>
          <Icon
            alt={Translate({ context: "general", label: "collapse" })}
            data-cy="feedback-cookie-close"
            size={{ w: 4, h: 4 }}
            src="close_white_bold.svg"
            bgColor="var(--blue)"
            className={styles.feedbackcloseicon}
            onClick={() => handleCookie("click")}
          />
        </div>
        <div className={styles.feedbacklink} data-cy="feedback-link-text">
          <Text type="text3" tag="span" className={styles.feedbacktext}>
            {Translate({
              context: "feedback",
              label: "feed_back_text",
            })}
          </Text>
          <Link
            href="https://forms.gle/2UPQZo898s7wo3sa7"
            target="_blank"
            border={{ top: false, bottom: { keepVisible: true } }}
            onClick={() => sessionStorage.setItem("linkclicked", true)}
          >
            <Text type="text3" tag="span">
              {Translate({
                context: "feedback",
                label: "feed_back_link_text",
              })}
            </Text>
          </Link>
        </div>
      </div>
      <div
        data-cy="feedback-toggler"
        className={styles.blue}
        onClick={() => {
          handleCookie("click");
        }}
        data-cy="feedback-toggle"
      >
        <Text tag="span" type="text3" className={styles.textrotate}>
          Feedback
        </Text>
        <span className={styles.feedbackicon}>
          <Icon
            size={{ w: 1, h: 1 }}
            src={`${feedbackOpen ? "arrowright.svg" : "arrowleft.svg"}`}
            alt={
              feedbackOpen
                ? Translate({ context: "general", label: "collapse" })
                : Translate({ context: "general", label: "expand" })
            }
          />
        </span>
      </div>
    </div>
  );
}
