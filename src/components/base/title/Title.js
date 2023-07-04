import PropTypes from "prop-types";
import Text, { TextSkeleton } from "../text/Text";

/**
 *  Default export function of the Component
 *  Title is a wrapper for Text, limiting the available tags
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Container({
  children = "I'm a title",
  tag = "div",
  ...props
}) {
  if (props.skeleton) {
    return <TextSkeleton {...props} />;
  }

  return (
    <Text type="title1" tag={tag} {...props}>
      {children}
    </Text>
  );
}

// PropTypes for the component
Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tag: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6"]).isRequired, // If not one of these - use Text
  type: PropTypes.oneOf([
    "title1",
    "title2",
    "title3",
    "title4",
    "title5",
    "title6",
    "title6b",
    "title7",
  ]),
  skeleton: PropTypes.bool,
};
