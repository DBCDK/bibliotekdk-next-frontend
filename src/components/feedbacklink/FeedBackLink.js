import styles from "./FeedBackLink.module.css";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";

export default function FeedbackLink() {
  return (
    <div data-cy="feedback-wrapper" className={styles.feedbackwrap}>
      <div data-cy="feedback-link-text">
        <Link
          href="https://kundeservice.dbc.dk/bibdk"
          target="_blank"
          border={{ top: false, bottom: { keepVisible: true } }}
          dataCy="feedbacklink-to-kundeservice"
        >
          <Text tag="span" type="text3" className={styles.textrotate}>
            {Translate({
              context: "feedback",
              label: "feed_back_kunderservice_link_text",
            })}
          </Text>
        </Link>
      </div>
    </div>
  );
}
