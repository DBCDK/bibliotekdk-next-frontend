import PropTypes from "prop-types";

import Skeleton from "@/components/base/skeleton";

import styles from "./Title.module.css";
import { useEffect, useRef, useState } from "react";
import { getStyle } from "@/utils/css";

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

  // ref to dom element
  const el = useRef(null);

  // style used for line clamping
  const [style, setStyle] = useState();

  // Calc lineheight if clamp is set
  const lineHeight =
    clamp && el && el.current && getStyle(el.current, "line-height");

  // calculate height when lineclamping is on and set style
  useEffect(() => {
    if (clamp && lines && lineHeight) {
      setStyle({
        WebkitLineClamp: lines,
        maxHeight: lines * parseInt(lineHeight, 10),
      });
    }
  }, [lineHeight, lines]);

  delete props.skeleton;

  return (
    <Tag
      {...props}
      ref={el}
      className={`${styles.title} ${styles[type]} ${className} ${
        clamp && styles.clamp
      }`}
      style={style}
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
  const lines = props.lines || 1;

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
  ]),
  skeleton: PropTypes.bool,
};
