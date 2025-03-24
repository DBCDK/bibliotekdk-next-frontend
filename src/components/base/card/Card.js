import PropTypes from "prop-types";
import styles from "./Card.module.css";
import Cover from "@/components/base/cover";

import Text from "@/components/base/text";
import Link from "@/components/base/link";
import { encodeTitleCreator } from "@/lib/utils";

/**
 * The skeleton card React component
 */
function SkeletonCard() {
  return (
    <div className={styles.SkeletonCard}>
      <div className={styles.CoverWrapper}>
        <Cover size="fill" skeleton={true} />
      </div>
      <div>
        <Text
          className={`${styles.Title}`}
          type="text3"
          lines={2}
          skeleton={true}
        />
      </div>
    </div>
  );
}

/**
 * The card React component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Card({
  cardRef,
  className = "",
  workId,
  creators,
  onFocus,
  onClick,
  skeleton,
  cover,
  title,
  subTitle,
  type = null,
  coverLeft = false,
  fixedWidth = true,
  small = false,
}) {
  if (skeleton) {
    return <SkeletonCard />;
  }

  return (
    <Link
      a={false}
      href={{
        pathname: "/materiale/[title_author]/[workId]",
        query: {
          title_author: encodeTitleCreator(title, creators),
          workId,
          type,
        },
      }}
    >
      <a
        className={`${styles.Card} ${className} ${
          coverLeft ? styles.coverleft : ""
        } ${!fixedWidth ? styles.dynamicwidth : ""}`}
        ref={cardRef || null}
        tabIndex="0"
        onFocus={onFocus}
        data-cy="work-card"
        onClick={onClick}
      >
        <div className={styles.CoverWrapper}>
          <Cover src={cover?.detail} size="fill" />
        </div>
        <div>
          <Text
            className={`${styles.Title}`}
            type={small ? "text4" : "text1"}
            lines={2}
            clamp={true}
          >
            {title}
          </Text>
          {subTitle && (
            <Text type={small ? "text3" : "text2"} lines={1} clamp={true}>
              {subTitle}
            </Text>
          )}

          {creators?.length > 0 && (
            <Text
              className={`${styles.Creator}`}
              type={small ? "text3" : "text2"}
              lines={2}
              clamp={true}
            >
              {creators?.[0]?.display}
            </Text>
          )}
        </div>
        <div className={styles.BottomLine} />
      </a>
    </Link>
  );
}

Card.propTypes = {
  cardRef: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  className: PropTypes.string,
  cover: PropTypes.object,
  creators: PropTypes.array,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
  series: PropTypes.shape({
    part: PropTypes.number,
  }),
  skeleton: PropTypes.bool,
  workId: PropTypes.string,
  title: PropTypes.string,
};
