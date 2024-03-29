import LogoWithText from "./logo_text.svg";
import PropTypes from "prop-types";
import styles from "./Logo.module.css";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import Translate from "@/components/base/translate";
import cx from "classnames";
import useTestUser from "@/components/hooks/useTestUser";

/**
 * Mark when test user mode is active
 */
function TestUserActive() {
  const { enabled } = useTestUser();
  if (!enabled) {
    return null;
  }

  return (
    <div
      style={{
        background: "brown",
        height: 4,
        width: 160,
        marginTop: 8,
        position: "absolute",
      }}
    ></div>
  );
}
/**
 * Component is a svg and some text.
 * @param href
 *  Where to go when clicked
 * @param type
 *  Color of text and svg logo
 * @returns {React.JSX.Element}
 */
export default function Logo({ href = "/", type = "BLUE", ...props }) {
  if (props.skeleton) {
    return <Logo {...props} />;
  }

  return (
    <Link
      border={false}
      href={href}
      dataCy={cyKey({
        name: "logo",
      })}
    >
      <div className={styles.display_flex}>
        <LogoWithText
          style={{ color: type === "BLUE" ? "var(--blue)" : "var(--white)" }}
          className={cx({
            [styles.defaultLogo_Blue]: type === "BLUE",
            [styles.defaultLogo_White]: type === "WHITE",
          })}
          alt={Translate({ context: "logo", label: "default_logo_text" })}
        />
      </div>
      <TestUserActive />
    </Link>
  );
}

// PropTypes for Button component
Logo.propTypes = {
  type: PropTypes.oneOf(["BLUE", "WHITE"]),
  href: PropTypes.string,
};
