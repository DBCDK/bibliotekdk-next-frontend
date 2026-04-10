import PropTypes from "prop-types";
import styles from "./Logo.module.css";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import Translate from "@/components/base/translate";
import useTestUser from "@/components/hooks/useTestUser";
import useSiteConfig from "@/components/hooks/useSiteConfig";

import LogoWithText from "./logo_text.svg";
import BibdkLogoWithText from "./bibdk/logo_text.svg";
import StudiebibLogoWithText from "./studiebib/logo_text.svg";

const LOGO_VARIANTS = {
  bibliotekdk: BibdkLogoWithText,
  studiebib: StudiebibLogoWithText,
};

const DEFAULT_COLORS = {
  logo: "var(--blue)",
  text: "var(--mine-shaft)",
};

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
 * @param colors
 *  Colors for svg logo and text
 * @returns {React.JSX.Element}
 */
export default function Logo({ href = "/", colors, ...props }) {
  const { logo } = useSiteConfig();
  const LogoVariant = LOGO_VARIANTS[logo?.variant] || LogoWithText;
  const resolvedColors = {
    ...DEFAULT_COLORS,
    ...colors,
  };

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
        <LogoVariant
          style={{
            "--logo-color": resolvedColors.logo,
            "--logo-text-color": resolvedColors.text,
          }}
          className={styles.defaultLogo}
          alt={Translate({ context: "logo", label: "default_logo_text" })}
        />
      </div>
      <TestUserActive />
    </Link>
  );
}

// PropTypes for Button component
Logo.propTypes = {
  colors: PropTypes.shape({
    logo: PropTypes.string,
    text: PropTypes.string,
  }),
  href: PropTypes.string,
};
