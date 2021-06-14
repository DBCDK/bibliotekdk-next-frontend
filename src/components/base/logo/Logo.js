import Svg from "./singleLogo.svg";
import PropTypes from "prop-types";
import styles from "@/components/base/logo/Logo.module.css";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import classNames from "classnames/bind";

/**
 * Split given text in <spans>. Split by newline (\\n). We need
 * TWO backslashes since drupal escapes by default.
 * @param text
 * @return {*}
 * @constructor
 */
function NewlineInText(text) {
  return text.split("\\n").map((str, index) => {
    // on mobile devices one of the slashes is shown - make sure it it NOT there (replace)
    return <span key={str + index}>{str.replace("\\", "")}</span>;
  });
}

export function SvgParser({ fill = "var(--blue)" }) {
  // @TODO size is hardcoded - use var(--pt5) css prop instead
  return <Svg width="40" height="40" fill={fill}></Svg>;
}

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
  return (
    <div className={styles.wrapper}>
      <Link
        className={styles.logoWrap}
        border={false}
        href={href}
        dataCy={cyKey({
          name: "logo",
        })}
      >
        <SvgParser fill={fill} />

        <Text
          type="text4"
          className={classNames(
            styles.logotxt,
            color === "white" ? styles.white : ""
          )}
          tag="span"
        >
          {NewlineInText(translated)}
        </Text>
      </Link>
    </div>
  );
}

// PropTypes for Button component
Logo.propTypes = {
  text: PropTypes.oneOf(["default_logo_text", "help_logo_text"]),
  fill: PropTypes.oneOf(["var(--blue)", "var(--white)"]),
  href: PropTypes.string,
};
