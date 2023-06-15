import PropTypes from "prop-types";

import Skeleton from "@/components/base/skeleton";

import styles from "./Title.module.css";
import clampStyles from "@/components/base/clamp/Clamp.module.css";

/**
 * The Component function
 *
 * @param children
 * @param className
 * @param tag
 * @param type
 * @param clamp
 * @param lines
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export const Title = ({
  children = "im a title",
  className = "",
  tag = "h1",
  type = "title1",
  clamp,
  lines,
  ...props
}) => {
  const Tag = tag;

  lines = typeof lines === "number" ? { xs: lines } : lines;

  const clampClasses =
    lines && clamp
      ? [
          clampStyles.clamp,
          ...Object.entries(lines)
            .map(([size, numLines]) => clampStyles[`clamp-${size}-${numLines}`])
            .filter((style) => !!style),
        ]
      : [];

  delete props.skeleton;

  return (
    <Tag
      {...props}
      className={`${styles.title} ${styles[type]} ${className} ${
        clamp && styles.clamp
      } ${clampClasses.join(" ")}`}
    >
      {children}
    </Tag>
  );
};

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
 */
export const TitleSkeleton = (props) => {
  // TODO skeleton to support number of lines based on media queries
  // For now we use the first entry of lines for calculating skeleton
  const lines =
    typeof props.lines === "number"
      ? props.lines
      : Object.values(props.lines || {})?.[0] || 1;

  return (
    <Title {...props} className={`${props.className} ${styles.skeleton}`}>
      <Skeleton lines={lines} />
      {Array.from(Array(lines).keys()).map((l) => (
        <Title tag={"span"} type={props.type} key={`txt-${l}`} />
      ))}
    </Title>
  );
};

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Container(props) {
  if (props.skeleton) {
    return <TitleSkeleton {...props} />;
  }

  return <Title {...props} />;
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
  tag: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6", "span"]),
  type: PropTypes.oneOf([
    "title1",
    "title2",
    "title3",
    "title4",
    "title5",
    "title6",
    "title6b",
    "title7",
    "title8",
  ]),
  skeleton: PropTypes.bool,
};
