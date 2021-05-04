import PropTypes from "prop-types";
import styles from "./Card.module.css";
import Cover from "@/components/base/cover";

import Text from "@/components/base/text";
import Link from "@/components/base/link";
import { encodeTitleCreator } from "@/lib/utils";

import translate from "@/components/base/translate";

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
 * @param {object} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Card({
  cardRef,
  className = "",
  cover,
  creators,
  onFocus,
  id,
  series,
  skeleton,
  title,
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
          title_author: encodeTitleCreator(
            title,
            creators[0] && creators[0].name
          ),
          workId: id,
        },
      }}
    >
      <a
        className={`${styles.Card} ${className}`}
        ref={cardRef || null}
        tabIndex="0"
        onFocus={onFocus}
        data-cy="work-card"
      >
        <div className={styles.CoverWrapper}>
          <Cover src={cover.detail} size="fill" />
        </div>
        <div>
          {series ? (
            <Text
              className={`${styles.Title}`}
              type="text2"
              lines={4}
              clamp={true}
            >
              {translate({
                context: "series",
                label: "part",
                vars: [series.part, title],
              })}
            </Text>
          ) : (
            <React.Fragment>
              <Text
                className={`${styles.Title}`}
                type="text1"
                lines={2}
                clamp={true}
              >
                {title}
              </Text>

              <Text
                className={`${styles.Creator}`}
                type="text2"
                lines={2}
                clamp={true}
              >
                {creators[0] && creators[0].name}
              </Text>
            </React.Fragment>
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
  id: PropTypes.string,
  onFocus: PropTypes.func,
  id: PropTypes.string,
  series: PropTypes.shape({
    part: PropTypes.number,
  }),
  skeleton: PropTypes.bool,
  title: PropTypes.string,
};
