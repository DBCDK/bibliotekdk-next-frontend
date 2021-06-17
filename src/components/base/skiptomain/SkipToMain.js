import Link from "@/components/base/link";
import styles from "./SkipToMain.module.css";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";

/**
 * Set anchor hash in url
 * @return {JSX.Element}
 * @constructor
 */
export function SkipToMainLink() {
  return (
    <Link
      className={styles.skiptomainlink}
      onClick={(e) => {
        location.href = "#nav-main";
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          location.href = "#nav-main";
        }
      }}
    >
      <Text type="text4">
        {Translate({
          context: "general",
          label: "SkipToMain",
        })}
      </Text>
    </Link>
  );
}

/**
 * Insert an anchor in page
 * @return {JSX.Element}
 * @constructor
 */
export function SkipToMainAnchor() {
  return <div id="nav-main"></div>;
}
