/**
 * Custom bookmark icon
 */
import PropTypes from "prop-types";
import Action from "@/components/base/action";
import styles from "./bookmark.module.css";
import Translate from "@/components/base/translate";
import cx from "classnames";
import useBookmarks from "@/components/hooks/useBookmarks";

export default function BoomarkIcon(props) {
  const { className } = props;
  const { bookmarks } = useBookmarks();

  return (
    <Action
      {...props}
      className={cx(className, styles.trigger)}
      animation={true}
      alt={Translate({ context: "header", label: "bookmark" })}
    >
      <div className={styles.container}>
        {bookmarks && bookmarks.length > 0 && (
          <div
            className={cx(styles.countContainer, {
              [styles.countContainerLarge]: bookmarks.length >= 100,
            })}
          >
            {bookmarks.length >= 1000 ? "1k+" : bookmarks.length}
          </div>
        )}

        <div className={styles.icon}>
          <div className={styles.box}>
            <div className={styles.boxRoll} />
          </div>
          <div className={styles.flagContainer}>
            <div className={styles.flag}>
              <div className={styles.leftBorder} />
              <div className={styles.rightBorder} />
              <div className={styles.leftTilt} />
              <div className={styles.rightTilt} />
            </div>
          </div>
        </div>
      </div>
    </Action>
  );
}

// PropTypes for component
BoomarkIcon.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  title: PropTypes.string,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.object,
  dataCy: PropTypes.string,
};
