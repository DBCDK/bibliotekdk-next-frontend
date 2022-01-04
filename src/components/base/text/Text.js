import PropTypes from "prop-types";

import { cyKey } from "@/utils/trim";

import Skeleton from "@/components/base/skeleton";

import styles from "./Text.module.css";
import { getStyle } from "@/utils/css";
import { useEffect, useRef, useState } from "react";

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
  lines,
  clamp,
  tag = "p",
  onClick = null,
  dataCy = null,
  tabIndex = null,
  id,
}) {
  // Set type of tag.
  // Because this is a text component, p(aragraph) should always be used if possible!
  // Other tags can be used for none-semantic purposes. (eg. skeleton)
  const Tag = tag;

  // ref to dom element
  const el = useRef(null);

  // style used for line clamping
  const [style, setStyle] = useState();

  // calculate height when lineclamping is on and set style
  useEffect(() => {
    if (clamp && lines) {
      const lineHeight = getStyle(el.current, "line-height");
      setStyle({
        WebkitLineClamp: lines,
        maxHeight: lines * parseInt(lineHeight, 10),
      });
    }
  }, []);

  // generate data-cy key if none given
  const key = dataCy || cyKey({ name: children, prefix: "text" });

  return (
    <Tag
      id={id}
      ref={el}
      className={`${styles.text} ${styles[type]} ${className} ${
        clamp && styles.clamp
      }`}
      onClick={onClick}
      data-cy={key}
      style={style}
      tabIndex={tabIndex}
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
function TextSkeleton(props) {
  if (!props.lines) {
    return null;
  }

  const lines = props.lines || 3;

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
  type: PropTypes.oneOf(["text1", "text2", "text3", "text4"]),
  tag: PropTypes.oneOf(["p", "span", "div", "label"]),
  skeleton: PropTypes.bool,
};
