import styles from "./Feedback.module.css";
import Text from "@/components/base/text/Text";
import Icon from "@/components/base/icon/Icon";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Cookies from "js-cookie";

export default function Feedback() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [showfeedback, setShowfeedback] = useState(true);

  const cookiestate = parseCookie();
  const handleCookie = (type) => {
    if (type === "click") {
      if (!cookiestate.show) Cookies.set("showfeedback", `no ${Date.now()}`);
      setShowfeedback(!showfeedback);
    }
    // page is loaded - check time
    if (type === "load") {
      if (cookiestate.time) {
        console.log(cookiestate.time);
        // check if cookie was set more than a week ago
        //if (Date.now() - cookiestate.time > 604800000) {
        if (Date.now() - cookiestate.time > 5000) {
          console.log("TIMER");
          Cookies.remove("showfeedback");
          setShowfeedback("true");
        }
      }
    }
  };

  useEffect(() => {
    handleCookie("load");
  });

  return (
    <div
      className={classNames(
        styles.feedbackwrap,
        cookiestate.show === "no"
          ? styles.feedbackhidden
          : styles.feedbackclosed
      )}
    >
      <div
        className={classNames(
          feedbackOpen ? styles.feedbackopen : styles.feedbackclosed
        )}
      >
        <div className={styles.feedbackiconandtext}>
          <Icon
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
      <div className={styles.blue}>
        <Text
          type="text3"
          className={styles.textrotate}
          onClick={() => {
            setFeedbackOpen(!feedbackOpen);
          }}
        >
          <span className={styles.feedbackicon}>
            <Icon
              size={{ w: 1, h: 1 }}
              src={`${feedbackOpen ? "arrowleft.svg" : "arrowright.svg"}`}
            />
          </span>
          Feedback
        </Text>
      </div>
    </div>
  );
}

function parseCookie() {
  const cookiedata = Cookies.get("showfeedback");
  if (cookiedata) {
    const parts = cookiedata.split(" ");
    return {
      show: parts[0],
      time: parts[1],
    };
  }
  return {};
}
