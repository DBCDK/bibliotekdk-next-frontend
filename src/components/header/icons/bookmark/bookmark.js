/**
 * Custom bookmark icon
 */
import PropTypes from "prop-types";
import Action from "@/components/base/action";
import styles from "./bookmark.module.css";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function BoomarkIcon(props) {
  const { className } = props;

  return (
    <Action
      {...props}
      className={`${className} ${styles.trigger}`}
      animation={true}
      icon="bookmark_full.svg"
      alt={Translate({ context: "header", label: "bookmark" })}
    ></Action>
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
