import { useData } from "@/lib/api/api";
import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";
import styles from "./CqlErrorMessage.module.css";
import Icon from "@/components/base/icon/Icon";
import { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import cx from "classnames";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

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

const green = "status__on_shelf.svg";
const red = "status__not_for_loan.svg";

export function CqlErrorMessage({ errorMessage, isLoading, error }) {
  const { showPopover, setCqlButtonDisabled } = useAdvancedSearchContext();

  const [showCqlError, setShowCqlError] = useState(false);
  const [src, setSrc] = useState(green);
  const [message, setMessage] = useState({
    explanation: "",
    location: "",
    full: "",
  });

  useEffect(() => {
    if (!isLoading && !error) {
      if (errorMessage) {
        setSrc(red);
        setMessage(parseErrorMessage(errorMessage));
        setCqlButtonDisabled(true);
      } else {
        setSrc(green);
        setMessage(parseErrorMessage(errorMessage));
        setCqlButtonDisabled(false);
      }
    }
  }, [errorMessage, isLoading]);

  useEffect(() => {
    if (src === green || !showPopover) {
      setShowCqlError(false);
    }
  }, [src, showPopover]);

  return (
    <div className={styles.syntaxContainer}>
      <div aria-expanded={showCqlError} className={cx(styles.popoverAnimation)}>
        <div
          aria-expanded={showCqlError}
          data-unclickable={src === green}
          className={cx(styles.popoverAnimation_advancedSearch)}
        >
          <div
            aria-expanded={showCqlError}
            data-unclickable={src === green}
            className={styles.action_container}
            hidden={!showPopover}
          >
            <Icon
              src={src}
              size={{ w: 2, h: 2 }}
              {...(src !== green && {
                onClick: () => setShowCqlError((prev) => !prev),
              })}
            />
          </div>
          <div aria-expanded={showCqlError} className={styles.explanation}>
            {message.explanation}
          </div>
          <div aria-expanded={showCqlError} className={styles.location}>
            {message.location}
          </div>
          <div aria-expanded={showCqlError} className={styles.full}>
            {message.full}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Wrap({ cql }) {
  const bigResponse = useData(doComplexSearchAll({ cql, offset: 0, limit: 1 }));

  return (
    <CqlErrorMessage
      errorMessage={bigResponse?.data?.complexSearch?.errorMessage}
      isLoading={bigResponse?.isLoading}
      error={bigResponse?.error}
    />
  );
}
