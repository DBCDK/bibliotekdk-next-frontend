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
  const [showfeedback, setShowfeedback] = useState(false);

  const cookie = Cookies.get("removefeedback");

  const handleCookie = (type) => {
    if (type === "click") {
      if (!cookie) {
        Cookies.set("removefeedback", `${Date.now()}`);
      }
      setShowfeedback(false);
    }
    // page is loaded - check time
    if (type === "load") {
      if (cookie) {
        // check if cookie was set more than ({cookietime}) ago
        if (Date.now() - cookie > cookietime) {
          Cookies.remove("removefeedback");
          setShowfeedback(true);
        } else {
          setShowfeedback(false);
          setFeedbackOpen(false);
        }
      } else {
        setShowfeedback(true);
      }
    }
  };

  const handleSessionTimer = () => {
    const timer = sessionStorage.getItem("feedbackTimer");
    if (!timer) {
      sessionStorage.setItem("feedbackTimer", `${Date.now()}`);
    } else {
      const linkclicked = sessionStorage.getItem("linkclicked");
      // user already clicked the link - hopefully he/she also answered
      // the question - hide feedback for {cookietime}
      if (linkclicked) {
        handleCookie("click");
      }
      if (Date.now() - timer > sessioneTime) {
        setFeedbackOpen(true);
        sessionStorage.removeItem("feedbackTimer");
      }
    }
  };

  useEffect(() => {
    handleCookie("load");
    handleSessionTimer();
  });

  return (
    <div
      data-cy="feedback-wrapper"
      className={classNames(
        styles.feedbackwrap,
        !showfeedback ? styles.feedbackhidden : ""
      )}
    >
      <div
        className={classNames(
          feedbackOpen ? styles.feedbackopen : styles.feedbackclosed
        )}
      >
        <div
          className={styles.feedbackiconandtext}
          data-cy="feedback-link-text"
        >
          <Icon
            data-cy="feedback-cookie-close"
            size={{ w: 4, h: 4 }}
            src="close_white_bold.svg"
            bgColor="var(--blue)"
            className={styles.feedbackcloseicon}
            onClick={() => handleCookie("click")}
          />

          <Text type="text3" tag="span" className={styles.feedbacktext}>
            {Translate({
              context: "feedback",
              label: "feed_back_text",
            })}
          </Text>
        </div>
        <div className={styles.feedbacklink}>
          <Link
            href="https://forms.gle/1zgfCoQDmEJ9WQhj9"
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
          sessionStorage.removeItem("feedbackTimer");
          setFeedbackOpen(!feedbackOpen);
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
          />
        </span>
      </div>
    </div>
  );
}
