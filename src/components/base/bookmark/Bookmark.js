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
function Bookmark({
  className = "",
  selected = false,
  onClick = null,
  disabled = false,
  skeleton = false,
}) {
  const selectedClass = selected ? styles.selected : "";

  return (
    <button
      className={`${className} ${styles.bookmark} ${selectedClass}`}
      onClick={() => (onClick ? onClick() : handleOnBookmarkClick())}
    >
      <Icon
        skeleton={skeleton}
        disabled={disabled}
        size={5}
        bgColor="var(--white)"
      >
        <BookmarkSvg />
      </Icon>
    </button>
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
    <Bookmark
      {...props}
      className={styles.skeleton}
      onClick={null}
      disabled={true}
    >
      <Skeleton />
    </Bookmark>
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
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
};
