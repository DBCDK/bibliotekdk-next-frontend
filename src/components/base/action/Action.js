import PropTypes from "prop-types";

import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import Badge from "@/components/base/badge";

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
}) {
  // Use html a or the Link component
  // const Wrap = onClick ? "a" : Link;

  // Set data-cy or dataCy prop according to Wrap element
  // const cy = Wrap === "a" ? { "data-cy": dataCy } : { dataCy };
  const tag = onClick ? { tag: "a" } : {};

  // const [stateBadge, setStateBadge] = useState(<></>);
  // useEffect(() => {
  //   if (badge) {
  //     setStateBadge(<Badge className={styles.badge}>{badge}</Badge>);
  //   } else {
  //     setStateBadge(<></>);
  //   }
  // }, []);

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault(); // Prevent link href direct
        onClick();
      }}
      className={`${className} ${styles.action}`}
      a={Boolean(onClick)}
      {...tag}
      dataCy={dataCy}
      data_underline_animation_disabled={!animation}
      aria-label={title}
    >
      {badge && <Badge className={styles.badge}>{badge}</Badge>}
      <Icon size={{ w: "auto", h: 3 }} src={icon} alt={title}>
        {children}
      </Icon>
      <Text type="text3">{title}</Text>
    </Link>
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
