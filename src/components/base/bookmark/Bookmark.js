import PropTypes from "prop-types";

import { cyKey } from "@/utils/trim";

import Skeleton from "@/components/base/skeleton";
import Icon from "@/components/base/icon";
import translate from "@/components/base/translate";
import BookmarkSvg from "@/public/icons/bookmark_medium.svg";

import styles from "./Bookmark.module.css";

function handleOnBookmarkClick() {
  alert("Bookmarked!");
}

/**
 * Button in the shape of a bookmark icon
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
function Bookmark({
  size = { w: 5, h: 5 },
  className = "",
  selected = false,
  onClick = null,
  disabled = false,
  skeleton = false,
  title = false,
}) {
  const key = cyKey({ name: title || "button", prefix: "bookmark" });

  const selectedClass = selected ? styles.selected : "";

  const context = { context: "bibliographic-data" };

  // Set hover title
  const params =
    title && !skeleton
      ? { label: "title", vars: [title] }
      : { label: "bookmark" };

  title = translate({ ...context, ...params });

  return (
    <button
      title={title}
      data-cy={key}
      className={`${className} ${styles.bookmark} ${selectedClass}`}
      onClick={(e) => (onClick ? onClick(e) : handleOnBookmarkClick(e))}
    >
      <Icon skeleton={skeleton} disabled={disabled} size={size} alt="bookmark">
        <BookmarkSvg />
      </Icon>
    </button>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {Object} props
 *  See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
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
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
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
