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
    <div className={styles.skiptomainlink}>
      <Link
        onClick={() => {
          location.href = "#nav-main";
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.keyCode === 13) {
            location.href = "#nav-main";
          }
        }}
      >
        <Text type="text4" tag="span">
          {Translate({
            context: "general",
            label: "SkipToMain",
          })}
        </Text>
      </Link>
    </div>
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
