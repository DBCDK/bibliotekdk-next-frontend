import PropTypes from "prop-types";

import { cyKey } from "@/utils/trim";

import Skeleton from "@/components/base/skeleton";

import styles from "./Text.module.css";
import clampStyles from "@/components/base/clamp/Clamp.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Text({
  children = "lorem ipsum dolor sit amet ...",
  className = "",
  type = "text3",
  clamp,
  tag = "p",
  onClick = null,
  dataCy = null,
  tabIndex = null,
  title = null,
  id,
  lines,
}) {
  // Set type of tag.
  // Because this is a text component, p(aragraph) should always be used if possible!
  // Other tags can be used for none-semantic purposes. (eg. skeleton)
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

  // generate data-cy key if none given
  const key = dataCy || cyKey({ name: children, prefix: "text" });

  return (
    <Tag
      id={id}
      className={`${styles.text} ${
        styles[type]
      } ${className} ${clampClasses.join(" ")}`}
      onClick={onClick}
      data-cy={key}
      tabIndex={tabIndex}
      {...(title && { title: title })}
    >
      {children}
    </Tag>
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
export function TextSkeleton(props) {
  if (!props.lines) {
    return null;
  }

  // TODO skeleton to support number of lines based on media queries
  // For now we use the first entry of lines for calculating skeleton
  const lines =
    typeof props.lines === "number"
      ? props.lines
      : Object.values(props.lines || {})?.[0] || 3;

  return (
    <Text
      {...props}
      tag="span"
      className={`${props.className} ${styles.skeleton}`}
    >
      <Skeleton lines={lines} />
      {Array.from(Array(lines).keys()).map((l) => (
        <Text key={`txt-${l}`} {...props} />
      ))}
    </Text>
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
    return <TextSkeleton {...props} />;
  }

  return <Text {...props} />;
}

const textTypes = ["text1", "text2", "text3", "text4", "text5", "text6"];
const titleTypes = [
  "title1",
  "title2",
  "title3",
  "title4",
  "title5",
  "title6",
  "title7",
];

// PropTypes for the component
Container.propTypes = {
  id: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.oneOf([...textTypes, ...titleTypes]),
  tag: PropTypes.string, // Support all tags.
  skeleton: PropTypes.bool,
};
