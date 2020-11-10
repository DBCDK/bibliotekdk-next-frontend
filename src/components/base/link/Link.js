import PropTypes from "prop-types";
import { default as NextLink } from "next/link";

import AnimationLine from "../../base/animation/line";

import styles from "./Link.module.css";

const useStoryBookLink = !!process.env.STORYBOOK_ACTIVE;

/**
 * We use this link in Storybook
 * for testing purposes.
 *
 * It creates an alert instead of following the link
 *
 * @param {Object} props
 */
function StorybookLink({ children, href }) {
  return (
    <React.Fragment>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          href: href.pathname || href,
          onClick: (e) => {
            e.preventDefault();
            alert(JSON.stringify(href));
          },
        })
      )}
    </React.Fragment>
  );
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Link({
  children = "Im a hyperlink now!",
  a = true,
  href = { pathname: "/", query: {} },
  target = "_self",
  border = true,
  onFocus = null,
  dataCy = "link",
  className = "",
}) {
  // Use Storybook link implementation if we are in Storybook mode
  const LinkImpl = useStoryBookLink ? StorybookLink : NextLink;

  // no wrap - no border
  if (!a) {
    border = false;
  }

  // Maybe wrap with an a-tag
  if (a) {
    const animationClass = border ? styles.border : "";

    children = (
      <a
        href={href.pathname || href}
        data-cy={dataCy}
        target={target}
        onFocus={onFocus}
        className={`${styles.link} ${animationClass} ${className}`}
      >
        {children}
        {border && <AnimationLine keepVisible />}
      </a>
    );
  }

  // Return the component
  return (
    <LinkImpl href={href} shallow={true}>
      {children}
    </LinkImpl>
  );
}

// PropTypes for component
Link.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  target: PropTypes.oneOf(["_blank", "_self", "_parent", "_top"]),
  a: PropTypes.bool,
  dataCy: PropTypes.string,
  border: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  href: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    query: PropTypes.object,
  }),
};
