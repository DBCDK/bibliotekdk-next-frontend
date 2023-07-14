import Svg from "./singleLogo.svg";
import PropTypes from "prop-types";
import styles from "./Logo.module.css";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";

/**
 * Return a svg with inline styling from parameter
 * @param fill
 * @return {JSX.Element}
 * @constructor
 */
export function SvgParser({ fill = "var(--blue)" }) {
  // @TODO size is hardcoded - use var(--pt5) css prop instead
  return <Svg width="40" height="40" fill={fill}></Svg>;
}

/**
 * Component is a svg and some text.
 * @param text
 *  LABEL of the text to show
 * @param href
 *  Where to go when clicke
 * @param fill
 *  Color of text and svg logo
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export default function Logo({
  text = "default_logo_txt",
  href = "/",
  fill = "var(--blue)",
  ...props
}) {
  if (props.skeleton) {
    return <Logo {...props} />;
  }

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
        <SvgParser fill={fill} />

        <Text
          type="text1"
          tag={"div"}
          className={`${color === "white" ? styles.white : ""} ${styles.text}`}
        >
          <div className={styles.logotxt1}>{translated2[0]}</div>
          <div>{translated2[1]}</div>
        </Text>
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
