import styles from "./SearchFeedBack.module.css";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Icon from "@/components/base/icon/Icon";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/base/button/Button";
import useDataCollect from "@/lib/useDataCollect";
import Collapse from "react-bootstrap/Collapse";

/**
 * Wrapper for feedback thumbs
 * @param datacollect
 * @param router
 * @param ForceshowMe
 *  Needed for testing
 * @returns {React.ReactElement | null}
 */
export function SearchFeedBackWrapper({ datacollect, router, ForceshowMe }) {
  const [showContainer, setShowContainer] = useState(ForceshowMe || false);
  const [showThumbs, setShowThumbs] = useState(ForceshowMe || false);
  const [showForm, setShowForm] = useState(false);
  const [showThankyou, setShowThankyou] = useState(false);
  const [showImprove, setShowImprove] = useState(false);

  // useEffect depends on query parameters .. but not paging or modal ..
  const excludeFromQuery = ["modal"];
  const filtered = router
    ? Object.entries(router.query).filter((entry) => {
        if (!excludeFromQuery.includes(entry[0])) {
          return entry;
        }
      })
    : {};
  const effectParams =
    (router?.query?.page && Object.fromEntries(filtered)) || {};

  useEffect(() => {
    if (!ForceshowMe) {
      // show search feedback if on page 1 or initial search (page is undefined)
      if (router && (router?.query?.page === "1" || !router?.query?.page)) {
        setShowThumbs(true);
        setShowContainer(true);
        // if thumbs are set - all other elements should be gone .. especially the form
        setShowForm(false);
      } else {
        setShowContainer(false);
        setShowThumbs(false);
      }
    } else {
      setShowContainer(true);
      setShowThumbs(true);
    }
  }, [JSON.stringify(effectParams)]);

  const onThumbsUpClick = () => {
    setShowThankyou(true);
    setShowThumbs(false);
    setTimeout(() => {
      setShowContainer(false);
    }, 5000);
    datacollect({ thumbs: "up", reason: "" });
  };
  const onThumbsDownClick = () => {
    setShowForm(true);
    setShowThumbs(false);
  };

  const onSubmitClick = () => {
    setShowThumbs(false);
    setShowForm(false);
    setShowImprove(true);
    setTimeout(() => {
      setShowContainer(false);
    }, 4000);
    const input = document.getElementById("search-feedback-input").value;
    datacollect({ thumbs: "down", reason: input });
  };

  return (
    <Collapse
      in={showContainer}
      appear={true}
      onExited={() => {
        setShowImprove(false);
        setShowThankyou(false);
      }}
    >
      <aside>
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
      </aside>
    </Collapse>
  );
}

/**
 * Thumbs up and down component - shown initially until one or the other is clicked
 * @param onThumbsUp
 * @param onThumbsDown
 * @returns {React.ReactElement | null}
 */
export function SearchFeedBack({ onThumbsUp, onThumbsDown }) {
  return (
    <div className={styles.thumbscontaioner} data-cy="cy-feedback-container">
      <Text type="text2" className={styles.feedbacktxt} lines={1} tag="span">
        {Translate({ context: "feedback", label: "search_feed_back_text" })}
      </Text>

      <span className={styles.iconcontainer}>
        <span
          className={styles.spanwrap}
          role="button"
          onClick={onThumbsUp}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onThumbsUp && onThumbsUp();
            }
          }}
          tabIndex={0}
        >
          <Icon
            size={{ w: "auto", h: 3 }}
            src="thumbsup.svg"
            alt="nice"
            className={styles.feedbackicon}
            data-cy="search-feedback-thumbsup"
          />
        </span>
        <span
          className={styles.spanwrap}
          role="button"
          onClick={onThumbsDown}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onThumbsDown && onThumbsDown();
            }
          }}
          tabIndex={0}
        >
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

/**
 * Feedback thankyou  - shown on submit from thumbsdown
 * @returns {React.ReactElement | null}
 */
export function SearchFeedBackImprove() {
  return (
    <div className={styles.feedbackcontainer}>
      <div className={styles.feedbackthankyou}>
        <Text
          type="text2"
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
    </div>
  );
}

/**
 * Thankyou component - shown on thumbUp
 * @returns {React.ReactElement | null}
 */
export function SearchFeedBackThankyou() {
  return (
    <div className={`${styles.feedbackcontainer} ${styles.feedbackthankyou}`}>
      <Text
        type="text2"
        className={styles.feedbacktxt}
        lines={1}
        tag="span"
        dataCy="search_feed_back_thankyou"
      >
        {Translate({
          context: "feedback",
          label: "search_feed_back_thankyou",
        })}
      </Text>
    </div>
  );
}

/**
 * Feedback form - shown on thumbsdown
 * @param onSubmitClick
 * @returns {React.ReactElement | null}
 */
export function SearchFeedBackForm({ onSubmitClick }) {
  const [hasTxt, setHasTxt] = useState(false);
  return (
    <div className={`${styles.feedbackcontainer} ${styles.feedbackthankyou}`}>
      <div data-cy="search-feedback-form">
        <Text type="text2" lines={1}>
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
          className={styles.feedbacktextarea}
          placeholder="Skriv dit forslag her (valgfrit)"
          onFocus={() => setHasTxt(true)}
        />

        <Button
          type="primary"
          size="small"
          className={styles.feedbackbutton}
          onClick={onSubmitClick}
        >
          <ButtonTxt hasTxt={hasTxt} />
        </Button>
      </div>
    </div>
  );
}

export function ButtonTxt({ hasTxt }) {
  return !hasTxt ? (
    <span>
      {Translate({
        context: "feedback",
        label: "search_feed_back_form_submit",
      })}
    </span>
  ) : (
    <span>
      {Translate({
        context: "feedback",
        label: "search_feed_back_form_send",
      })}
    </span>
  );
}

export default function Wrap() {
  const router = useRouter();
  const dataCollect = useDataCollect();
  // @TODO - use the datacollect
  const onDataCollect = (input) => {
    dataCollect.collectSearchFeedback({
      thumbs: input.thumbs,
      query: JSON.stringify(router.query),
      reason: input.reason,
    });
  };

  return <SearchFeedBackWrapper datacollect={onDataCollect} router={router} />;
}
