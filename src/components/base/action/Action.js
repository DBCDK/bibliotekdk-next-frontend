import PropTypes from "prop-types";

import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import Badge from "@/components/base/badge";
import AnimationLine from "@/components/base/animation/line";

import styles from "./Action.module.css";

/**
 * Function to create a action menu item
 *
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Action({
  className = "",
  href = "/#",
  badge = null,
  title = "Go!",
  icon = "star.svg",
  animation = false,
  children = null,
  onClick = null,
  dataCy = null,
  ...props
}) {
  // Use html a or the Link component
  const Wrap = onClick ? "a" : Link;

  // Set data-cy or dataCy prop according to Wrap element
  const cy = Wrap === "a" ? { "data-cy": dataCy } : { dataCy };

  return (
    <Wrap
      href={href}
      onClick={(e) => {
        e.preventDefault(); // Prevent link href direct
        onClick();
      }}
      className={`${className} ${styles.action}`}
      {...cy}
      aria-label={title}
      {...props}
    >
      {badge && <Badge className={styles.badge}>{badge}</Badge>}
      <Icon size={{ w: "auto", h: 3 }} src={icon} alt={title}>
        {children}
      </Icon>
      <div className={styles.wrap}>
        <Text type="text3">{title}</Text>
        {animation && <AnimationLine />}
      </div>
    </Wrap>
  );
}

// PropTypes for component
Action.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  title: PropTypes.string,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.object,
  onClick: PropTypes.func,
  dataCy: PropTypes.string,
};
