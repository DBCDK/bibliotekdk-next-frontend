import styles from "./SearchFeedBack.module.css";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Icon from "@/components/base/icon/Icon";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/base/button/Button";
import useDataCollect from "@/lib/useDataCollect";

export function SearchFeedBackWrapper({ datacollect, router, ForceshowMe }) {
  const [showThumbs, setShowThumbs] = useState(
    (ForceshowMe && ForceshowMe) || false
  );
  const [showForm, setShowForm] = useState(false);
  const [showThankyou, setShowThankyou] = useState(false);
  const [showImprove, setShowImprove] = useState(false);

  // useEffect depends on query parameters .. but not paging or modal ..
  const excludeFromQuery = ["page", "modal"];
  const filtered = router
    ? Object.entries(router.query).filter((entry, index) => {
        if (!excludeFromQuery.includes(entry[0])) {
          return entry;
        }
      })
    : {};
  const effectParams = (router && Object.fromEntries(filtered)) || {};

  useEffect(() => {
    if (!ForceshowMe) {
      if (
        (router && !router.query.page) ||
        (router && router.query.page === "1")
      ) {
        setShowThumbs(true);
      } else {
        setShowThumbs(false);
      }
    }
  }, [JSON.stringify(effectParams)]);

  const onThumbsUpClick = () => {
    setShowThumbs(false);
    setShowThankyou(true);
    setTimeout(() => {
      setShowThankyou(false);
    }, 3000);
    datacollect({ thumbs: "up", reason: "" });
  };
  const onThumbsDownClick = () => {
    setShowThumbs(false);
    setShowForm(true);
  };

  const onSubmitClick = () => {
    setShowThumbs(false);
    setShowForm(false);
    setShowImprove(true);
    setTimeout(() => {
      setShowImprove(false);
    }, 3000);
    const input = document.getElementById("search-feedback-input").value;
    datacollect({ thumbs: "down", reason: input });
  };

  return (
    <div>
      {/* initial state - show thumbs up and down */}
      {showThumbs && (
        <SearchFeedBack
          onThumbsUp={onThumbsUpClick}
          onThumbsDown={onThumbsDownClick}
        />
      )}
      {/* thumbsup has been clicked - nice - thankyou */}
      {showThankyou && <SearchFeedBackThankyou />}
      {/* thumbsdown has been clicked - show suggest form*/}
      {showForm && <SearchFeedBackForm onSubmitClick={onSubmitClick} />}
      {/* Feedback from has been posted */}
      {showImprove && <SearchFeedBackImprove />}
    </div>
  );
}

export function SearchFeedBack({ onThumbsUp, onThumbsDown }) {
  return (
    <div className={styles.feedbackcontainer}>
      <Text type="text3" className={styles.feedbacktxt} lines={1} tag="span">
        {Translate({ context: "feedback", label: "search_feed_back_text" })}
      </Text>

      <span className={styles.iconcontainer}>
        <span className={styles.spanwrap} onClick={onThumbsUp}>
          <Icon
            size={{ w: "auto", h: 3 }}
            src="thumbsup.svg"
            alt="nice"
            className={styles.feedbackicon}
            data-cy="search-feedback-thumbsup"
          />
        </span>
        <span className={styles.spanwrap} onClick={onThumbsDown}>
          <Icon
            size={{ w: "auto", h: 3 }}
            src="thumbsdown.svg"
            alt="nice"
            className={styles.feedbackicon}
            data-cy="search-feedback-thumbsdown"
          />
        </span>
      </span>
    </div>
  );
}

export function SearchFeedBackImprove() {
  return (
    <div className={styles.feedbackthankyou}>
      <Text
        type="text3"
        className={styles.feedbacktxt}
        lines={1}
        tag="span"
        dataCy="search_feed_back_improve"
      >
        {Translate({
          context: "feedback",
          label: "search_feed_back_improve",
        })}
      </Text>
    </div>
  );
}

export function SearchFeedBackThankyou() {
  return (
    <div className={styles.feedbackthankyou}>
      <Text
        type="text3"
        className={styles.feedbacktxt}
        lines={1}
        tag="span"
        dataCy="search_feed_back_thankyou"
      >
        {Translate({ context: "feedback", label: "search_feed_back_thankyou" })}
      </Text>
    </div>
  );
}

export function SearchFeedBackForm({ onSubmitClick }) {
  return (
    <div class={styles.feedbackthankyou} data-cy="search-feedback-form">
      <Text type="text3" lines={1}>
        {Translate({
          context: "feedback",
          label: "search_feed_back_form_title",
        })}
      </Text>
      <textarea
        rows="4"
        cols="50"
        id="search-feedback-input"
        data-cy="search-feedback-input"
      />
      <Button
        type="primary"
        size="small"
        className={styles.feedbackbutton}
        onClick={onSubmitClick}
      >
        <span>
          {Translate({
            context: "feedback",
            label: "search_feed_back_form_submit",
          })}
        </span>
        <div className={styles.fill} />
      </Button>
    </div>
  );
}

export default function wrap() {
  const router = useRouter();

  const dataCollect = useDataCollect();
  // @TODO - use the datacollect
  const onDataCollect = (input) => {
    console.log(input);
    /*dataCollect.collectSearchFeedback({
      searchfeedback_thumbs: input.thumbs,
      searchfeedback_query: router.query,
      searchfeedback_reason: input.reason,
    });*/
  };

  return <SearchFeedBackWrapper datacollect={onDataCollect} router={router} />;
}
