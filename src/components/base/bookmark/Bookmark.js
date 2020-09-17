import PropTypes from "prop-types";

import Skeleton from "../skeleton";
import Icon from "../icon";

import BookmarkSvg from "../../../../public/icons/bookmark.svg";

import styles from "./Bookmark.module.css";

function handleOnBookmarkClick() {
  alert("Bookmarked!");
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Bookmark(props, { className = "", selected = false, onClick = null }) {
  const selectedClass = selected ? styles.selected : "";
  return (
    <Icon
      {...props}
      size={5}
      bgColor="var(--white)"
      onClick={() => (onClick ? onClick : handleOnBookmarkClick())}
      className={`${className || ""} ${styles.bookmark} ${selectedClass}`}
    >
      <BookmarkSvg />
    </Icon>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
 */
function BookmarkSkeleton(props) {
  return (
    <Skeleton className={styles.skeleton}>
      <Bookmark {...props} onClick={null} disabled={true} />
    </Skeleton>
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Container(props) {
  if (props.skeleton) {
    return <BookmarkSkeleton {...props} />;
  }

  return <Bookmark {...props} />;
}

// PropTypes for Container component
Container.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  size: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  disabled: PropTypes.bool,
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
};
