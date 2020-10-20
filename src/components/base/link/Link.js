import PropTypes from "prop-types";
import { default as NextLink } from "next/link";
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
  target = "_self",
  a = false,
  href = { pathname: "/", query: {} },
}) {
  // Use Storybook link implementation if we are in Storybook mode
  const LinkImpl = useStoryBookLink ? StorybookLink : NextLink;

  // Maybe wrap with an a-tag
  if (typeof children === "string" || a) {
    children = (
      <a href={href.pathname || href} target={target}>
        {children}
      </a>
    );
  }

  // Return the component
  return (
    <span className ={styles.bibdklink}>
      <LinkImpl href={href}>{children}</LinkImpl>
    </span>
  );
}

// PropTypes for component
Link.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  target: PropTypes.oneOf(["_blank", "_self", "_parent", "_top"]),
  a: PropTypes.bool,
  href: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    query: PropTypes.object,
  }),
};
