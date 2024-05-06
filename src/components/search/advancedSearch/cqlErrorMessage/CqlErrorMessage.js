import styles from "./CqlErrorMessage.module.css";
import { useEffect, useState } from "react";
import Text from "@/components/base/text";
import cx from "classnames";
import { IconLink } from "@/components/base/iconlink/IconLink";
import animations from "@/components/base/animation/animations.module.css";
import Link from "@/components/base/link";
import CloseSvg from "@/public/icons/close_grey.svg";
import RedSvg from "@/public/icons/status__red.svg";
import GreenSvg from "@/public/icons/status__green.svg";
import Translate, { hasTranslation } from "@/components/base/translate";

export function CqlErrorMessage({ message }) {
  const [svg, setSvg] = useState("red");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (message) {
      timeoutId = setTimeout(() => {
        setSvg("red");
      }, 300);
    } else {
      setSvg("green");
    }

    return () => timeoutId && clearTimeout(timeoutId);
  }, [message]);

  const link_translation = {
    context: "advanced_search_cql",
    label: "cql_error_link_href",
  };

  return (
    <div className={styles.syntaxContainer} aria-expanded={showError}>
      {!showError && (
        <div className={cx(styles.action_bubble)}>
          <Link border={false} onClick={() => setShowError(!showError)}>
            {svg === "green" && (
              <GreenSvg
                className={cx(animations["h-elastic"], animations["f-elastic"])}
              />
            )}
            {svg === "red" && (
              <RedSvg
                className={cx(animations["h-elastic"], animations["f-elastic"])}
              />
            )}
          </Link>
        </div>
      )}
      {showError && (
        <Text
          type={"text3"}
          className={cx(styles.errorMessage, {
            [styles.noError]: !message,
          })}
        >
          <Link
            border={false}
            className={cx(styles.close)}
            onClick={() => setShowError((prev) => !prev)}
          >
            <CloseSvg
              className={cx(animations["h-elastic"], animations["f-elastic"])}
            />
          </Link>
          {svg === "green" && (
            <div>
              {Translate({
                context: "advanced_search_cql",
                label: "cql_error_success",
              })}
            </div>
          )}
          {svg === "red" && (
            <>
              <div
                className={styles.explanation}
                dangerouslySetInnerHTML={{ __html: message }}
              ></div>

              <IconLink
                className={styles.link}
                iconPlacement={"right"}
                iconStyle={{ marginTop: "var(--pt05)" }}
                iconOrientation={180}
                disabled={!hasTranslation(link_translation)}
                href={Translate(link_translation)}
              >
                {Translate({
                  context: "advanced_search_cql",
                  label: "cql_error_link_text",
                })}
              </IconLink>
            </>
          )}
        </Text>
      )}
    </div>
  );
}
