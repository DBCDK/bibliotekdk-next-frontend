import styles from "./SearchFeedBack.module.css";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Icon from "@/components/base/icon/Icon";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/base/button/Button";
import useDataCollect from "@/lib/useDataCollect";
import useQ from "@/components/hooks/useQ";
import Collapse from "react-bootstrap/Collapse";

/**
 * Wrapper for feedback thumbs
 * @param datacollect
 * @param router
 * @param ForceshowMe
 *  Needed for testing
 * @returns {JSX.Element}
 * @constructor
 */
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
        // if thumbs are set - all other elements should be gone .. especially the form
        setShowForm(false);
      } else {
        setShowThumbs(false);
      }
    } else {
      setShowThumbs(true);
    }
  }, [JSON.stringify(effectParams)]);

  const onThumbsUpClick = () => {
    setShowThumbs(false);
    setTimeout(() => {
      setShowThankyou(true);
    }, 50);
    setTimeout(() => {
      setShowThankyou(false);
    }, 5000);
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
    }, 4000);
    const input = document.getElementById("search-feedback-input").value;
    datacollect({ thumbs: "down", reason: input });
  };

  return (
    <div>
      {/* initial state - show thumbs up and down */}

      <SearchFeedBack
        showThumbs={showThumbs}
        onThumbsUp={onThumbsUpClick}
        onThumbsDown={onThumbsDownClick}
      />

      {/* thumbsup has been clicked - nice - thankyou */}
      <SearchFeedBackThankyou showThankyou={showThankyou} />
      {/* thumbsdown has been clicked - show suggest form*/}
      <SearchFeedBackForm onSubmitClick={onSubmitClick} showForm={showForm} />
      {/* Feedback from has been posted */}
      <SearchFeedBackImprove showImprove={showImprove} />
    </div>
  );
}

/**
 * Thumbs up and down component - shown initially until one or the other is clicked
 * @param onThumbsUp
 * @param onThumbsDown
 * @returns {JSX.Element}
 * @constructor
 */
export function SearchFeedBack({ onThumbsUp, onThumbsDown, showThumbs }) {
  return (
    <Collapse in={showThumbs} appear={true}>
      <div className={styles.thumbscontaioner}>
        <Text type="text2" className={styles.feedbacktxt} lines={1} tag="span">
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
    </Collapse>
  );
}

/**
 * Feedback thankyou  - shown on submit from thumbsdown
 * @returns {JSX.Element}
 * @constructor
 */
export function SearchFeedBackImprove({ showImprove }) {
  return (
    <Collapse in={showImprove}>
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
    </Collapse>
  );
}

/**
 * Thankyou component - shown on thumbUp
 * @returns {JSX.Element}
 * @constructor
 */
export function SearchFeedBackThankyou({ showThankyou }) {
  return (
    <Collapse in={showThankyou}>
      <div className={styles.feedbackcontainer}>
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
    </Collapse>
  );
}

/**
 * Feedback form - shown on thumbsdown
 * @param onSubmitClick
 * @returns {JSX.Element}
 * @constructor
 */
export function SearchFeedBackForm({ onSubmitClick, showForm }) {
  const [hasTxt, setHasTxt] = useState(false);
  return (
    <Collapse in={showForm}>
      <div className={styles.feedbackcontainer}>
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
    </Collapse>
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

export default function wrap() {
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
