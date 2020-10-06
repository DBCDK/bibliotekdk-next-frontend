import PropTypes from "prop-types";
import styles from "./Card.module.css";
import Cover from "../cover";

import Text from "../text";
import Link from "../link";
import { encodeTitleCreator } from "../../../lib/utils";

function SkeletonCard() {
  return (
    <div className={styles.SkeletonCard}>
      <div className={styles.CoverWrapper}>
        <Cover size={["100%", "100%"]} skeleton={true} />
      </div>
      <div>
        <Text
          // className={`${styles.Title}`}
          type="text1"
          lines={3}
          skeleton={true}
        >
          here goes some text
        </Text>
        {/* 
        <Text
          // className={`${styles.Creator}`}
          type="text2"
          lines={1}
          skeleton={true}
        ></Text>

        <Text
          // className={`${styles.Description}`}
          type="text3"
          lines={2}
          skeleton={true}
        ></Text> */}
      </div>
    </div>
  );
}

/**
 * Function to create a loading overlay on a component.
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
  description,
  onFocus,
  id,
  skeleton,
  title,
}) {
  if (skeleton) {
    return <SkeletonCard />;
  }
  return (
    <Link
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
      >
        <div className={styles.CoverWrapper}>
          <Cover src={cover.detail} size={["100%", "100%"]} />
        </div>
        <div>
          <Text
            className={`${styles.Title}`}
            type="text1"
            lines={1}
            clamp={true}
          >
            {title}
          </Text>

          <Text
            className={`${styles.Creator}`}
            type="text2"
            lines={1}
            clamp={true}
          >
            {creators[0].name}
          </Text>

          <Text
            className={`${styles.Description}`}
            type="text3"
            lines={2}
            clamp={true}
          >
            {description}
          </Text>
        </div>
      </a>
    </Link>
  );
}

// PropTypes for WorkSwiper component
Card.propTypes = {
  works: PropTypes.object,
};
