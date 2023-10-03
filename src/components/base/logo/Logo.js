import LogoWithText from "./logo_text.svg";
import LogoWithoutText from "./logo_notext.svg";
import PropTypes from "prop-types";
import styles from "./Logo.module.css";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import cx from "classnames";

/**
 * Return a svg with inline styling from parameter
 * @param fill
 * @return {JSX.Element}
 */
const DefaultLogo = ({ fill = "var(--blue)" }) => {
  return (
    <LogoWithText
      style={{ color: fill }}
      className={cx({
        [styles.defaultLogo_Blue]: fill === "var(--blue)",
        [styles.defaultLogo_White]: fill === "var(--white)",
      })}
    />
  );
};

/**
 * Return a svg with inline styling from parameter
 * @param fill
 * @return {JSX.Element}
 */
const SmallLogo = ({ fill = "var(--blue)" }) => {
  return <LogoWithoutText width="var(--pt5)" height="var(--pt5)" fill={fill} />;
};

/**
 * Component is a svg and some text.
 * @param text
 *  LABEL of the text to show
 * @param href
 *  Where to go when clicked
 * @param fill
 *  Color of text and svg logo
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export default function Logo({
  text = "default_logo_text",
  href = "/",
  fill = "var(--blue)",
  ...props
}) {
  if (props.skeleton) {
    return <Logo {...props} />;
  }

  const isDefault = text === "default_logo_text";
  const translated = Translate({ context: "logo", label: text });
  let color = "default";
  if (fill === "var(--white)") {
    color = "white";
  }

  const translated2 = translated.map(
    (translation) => translation.props.children
  );

  return (
    <Link
      border={false}
      href={href}
      dataCy={cyKey({
        name: "logo",
      })}
    >
      <div className={styles.display_flex}>
        {isDefault ? (
          <DefaultLogo fill={fill} />
        ) : (
          <>
            <SmallLogo fill={fill} />

            <Text
              type="text1"
              tag={"div"}
              className={`${color === "white" ? styles.white : ""} ${
                styles.text
              }`}
            >
              <div className={styles.logotxt1}>{translated2[0]}</div>
              <div>{translated2[1]}</div>
            </Text>
          </>
        )}
      </div>
    </Link>
  );
}

// PropTypes for Button component
Logo.propTypes = {
  text: PropTypes.oneOf(["default_logo_text", "help_logo_text"]),
  fill: PropTypes.oneOf(["var(--blue)", "var(--white)"]),
  href: PropTypes.string,
};
