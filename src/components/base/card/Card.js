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
 * @param {object} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Card({
  cardRef,
  className = "",
  manifestations,
  workId,
  creators,
  titles,
  onFocus,
  onClick,
  skeleton,
  // remove on fbi-api migration
  id,
  cover,
  title,
}) {
  if (skeleton) {
    return <SkeletonCard />;
  }

  console.log({ titles, creators });

  return (
    <Link
      a={false}
      href={{
        pathname: "/materiale/[title_author]/[workId]",
        query: {
          title_author: encodeTitleCreator(
            titles?.main[0] || title,
            creators[0] && creators[0].name
          ),
          workId: workId || id,
        },
      }}
    >
      <a
        className={`${styles.Card} ${className}`}
        ref={cardRef || null}
        tabIndex="0"
        onFocus={onFocus}
        data-cy="work-card"
        onClick={onClick}
      >
        <div className={styles.CoverWrapper}>
          <Cover
            src={manifestations?.latest?.cover?.detail || cover?.detail}
            size="fill"
          />
        </div>
        <div>
          <Text
            className={`${styles.Title}`}
            type="text1"
            lines={2}
            clamp={true}
          >
            {titles?.main[0] || title}
          </Text>

          {creators.length > 0 && (
            <Text
              className={`${styles.Creator}`}
              type="text2"
              lines={2}
              clamp={true}
            >
              {creators[0]?.display || creators[0]?.name}
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
  manifestations: PropTypes.object,
  workId: PropTypes.string,
  titles: PropTypes.object,
  // remove on fbi-api migration
  id: PropTypes.string,
  title: PropTypes.string,
  cover: PropTypes.object,
};
