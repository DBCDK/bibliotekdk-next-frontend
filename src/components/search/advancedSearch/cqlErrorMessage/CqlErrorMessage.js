import InfoDropdown from "@/components/base/infoDropdown/InfoDropdown";
import { useData } from "@/lib/api/api";
import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";
import styles from "./CqlErrorMessage.module.css";
import Icon from "@/components/base/icon/Icon";
import { useState } from "react";
import isEmpty from "lodash/isEmpty";
import { symbol } from "prop-types";

function parseErrorMessage(errorMessage) {
  if (isEmpty(errorMessage)) {
    return {
      explanation: "Nice work",
      location: location,
      full: "Well done",
    };
  }
  // first sentence of errormessage is (kind of) explanation
  const explanation = errorMessage.split(",")[0];
  // last part is location of error - starts with at: ---> .. and then the rest
  const locationIndex = errorMessage.indexOf("at:");
  const location = errorMessage.substring(locationIndex);

  return {
    explanation: explanation,
    location: location,
    full: errorMessage,
  };
}

export function CqlErrorMessage(errormessage) {
  const [src, setSrc] = useState("status__on_shelf.svg");
  const [showError, setShowError] = useState(false);
  if (errormessage) {
    setTimeout(() => {
      setSrc("status__not_for_loan.svg");
    }, 300);
  } else {
    setTimeout(() => {
      setSrc("status__on_shelf.svg");
    }, 300);
  }

  const message = parseErrorMessage(errormessage);

  return (
    <div className={styles.syntaxContainer}>
      <Icon
        src={src}
        size={{ w: 2, h: "auto" }}
        onClick={() => setShowError(!showError)}
        className={styles.action}
      />
      {showError && (
        <div className={styles.errorWrapper}>
          <div className={styles.errorMessage}>
            <div>{message.explanation}</div>
            <div>{message.location}</div>
          </div>
          <div className={styles.errorFull}>
            <InfoDropdown buttonText="full error message" label="Full error">
              {message.full}
            </InfoDropdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Wrap({ cql }) {
  const bigResponse = useData(doComplexSearchAll({ cql, offset: 0, limit: 1 }));

  return CqlErrorMessage(bigResponse?.data?.complexSearch?.errorMessage);
}
