import { useData } from "@/lib/api/api";
import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";
import styles from "./CqlErrorMessage.module.css";
import { useState } from "react";
import isEmpty from "lodash/isEmpty";
import Text from "@/components/base/text";
import isEqual from "lodash/isEqual";
import cx from "classnames";
import { IconLink } from "@/components/base/iconlink/IconLink";
import animations from "css/animations";
import Link from "@/components/base/link";
import CloseSvg from "@/public/icons/close_grey.svg";
import RedSvg from "@/public/icons/status__not_for_loan.svg";
import GreenSvg from "@/public/icons/status__on_shelf.svg";
import Translate, { hasTranslation } from "@/components/base/translate";

function parseErrorMessage(errorMessage) {
  // first sentence of errormessage is (kind of) explanation
  const explanation = errorMessage?.split(",")[0];
  // last part is location of error - starts with at: ---> .. and then the rest
  const locationIndex = errorMessage?.indexOf("at:");
  const location = errorMessage?.substring(locationIndex);

  if (isEmpty(errorMessage)) {
    return {
      explanation: "Nice work",
      location: location,
      full: "Well done",
    };
  }

  return {
    explanation: explanation,
    location: location,
    full: errorMessage,
  };
}

export function CqlErrorMessage(errormessage) {
  const [svg, setSvg] = useState("red");
  const [showError, setShowError] = useState(false);
  if (errormessage) {
    setTimeout(() => {
      setSvg("red");
    }, 300);
  } else {
    setTimeout(() => {
      setSvg("green");
    }, 300);
  }

  const message = parseErrorMessage(errormessage);

  const link_translation = {
    context: "advanced_search_cql",
    label: "cql_error_link_href",
  };

  return (
    <div className={styles.syntaxContainer} aria-expanded={showError}>
      {!showError && (
        <Link
          border={false}
          className={cx(styles.action_bubble)}
          onClick={() => setShowError(!showError)}
        >
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
      )}
      {showError && (
        <Text
          type={"text3"}
          className={cx(styles.errorMessage, {
            [styles.noError]: !errormessage,
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
              <div className={styles.explanation}>{message.explanation}</div>
              {!isEqual(message.location, message.explanation) && (
                <div className={styles.location}>{message.location}</div>
              )}
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

export default function Wrap({ cql = "" }) {
  const bigResponse = useData(doComplexSearchAll({ cql, offset: 0, limit: 1 }));

  return CqlErrorMessage(bigResponse?.data?.complexSearch?.errorMessage);
}
