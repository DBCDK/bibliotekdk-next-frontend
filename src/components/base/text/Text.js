import PropTypes from "prop-types";

import { cyKey } from "@/utils/trim";

import Skeleton from "@/components/base/skeleton";

import styles from "./Text.module.css";
import clampStyles from "css/clamp";
import cx from "classnames";

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
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
  ...props
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
      className={cx(
        styles.text,
        {
          [styles.text]: textTypes.includes(type),
          [styles.title]: titleTypes.includes(type),
          [styles.text1]: type === "text1",
          [styles.text2]: type === "text2",
          [styles.text3]: type === "text3",
          [styles.text4]: type === "text4",
          [styles.text5]: type === "text5",
          [styles.text6]: type === "text6",
          [styles.title1]: type === "title1",
          [styles.title2]: type === "title2",
          [styles.title3]: type === "title3",
          [styles.title4]: type === "title4",
          [styles.title5]: type === "title5",
          [styles.title6]: type === "title6",
          [styles.title6b]: type === "title6b",
          [styles.title7]: type === "title7",
        },
        className,
        clampClasses.join(" ")
      )}
      onClick={onClick}
      data-cy={key}
      tabIndex={tabIndex}
      {...(title && { title: title })}
      {...props}
    >
      {children}
    </Tag>
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
        <Text key={`txt-${l}`} {...props}>
          ...
        </Text>
      ))}
    </Text>
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
  "title6b",
  "title7",
];
export const allTextTypes = [...textTypes, ...titleTypes];

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
  type: PropTypes.oneOf(allTextTypes),
  tag: PropTypes.string, // Support all tags.
  skeleton: PropTypes.bool,
};
