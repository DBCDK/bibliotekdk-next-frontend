import PropTypes from "prop-types";
import styles from "./Logo.module.css";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import Translate from "@/components/base/translate";
import useTestUser from "@/components/hooks/useTestUser";
import useSiteConfig from "@/components/hooks/useSiteConfig";
import useBreakpoint from "@/components/hooks/useBreakpoint";

import LogoWithText from "./logo_text.svg";
import LogoWithoutText from "./logo_notext.svg";
import BibdkLogoWithText from "./bibdk/logo_text.svg";
import BibdkLogoWithoutText from "./bibdk/logo_notext.svg";
import StudiebibLogoWithText from "./studiebib/logo_text.svg";
import StudiebibLogoWithoutText from "./studiebib/logo_notext.svg";

const LOGO_VARIANTS = {
  default: {
    withText: LogoWithText,
    withoutText: LogoWithoutText,
  },
  bibliotekdk: {
    withText: BibdkLogoWithText,
    withoutText: BibdkLogoWithoutText,
  },
  studiebib: {
    withText: StudiebibLogoWithText,
    withoutText: StudiebibLogoWithoutText,
  },
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
export default function Logo({
  href = "/",
  colors,
  mobileWithoutText = false,
  ...props
}) {
  const { logo, site } = useSiteConfig();
  const breakpoint = useBreakpoint();
  const isMobile = mobileWithoutText && ["xs", "sm"].includes(breakpoint);
  const logoVariant = LOGO_VARIANTS[logo?.variant] || LOGO_VARIANTS.default;
  const LogoVariant = isMobile ? logoVariant.withoutText : logoVariant.withText;
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
      <div
        className={`${styles.display_flex} ${
          site === "studiebib" ? styles.studiebibMobile : ""
        }`}
      >
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
  mobileWithoutText: PropTypes.bool,
};
