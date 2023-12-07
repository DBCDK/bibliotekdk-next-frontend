import InfoDropdown from "@/components/base/infoDropdown/InfoDropdown";
import { useData } from "@/lib/api/api";
import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";
import styles from "./CqlErrorMessage.module.css";

function parseErrorMessage(errorMessage) {
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
  if (!errormessage) {
    return null;
  }

  const message = parseErrorMessage(errormessage);

  return (
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
  );
}

export default function Wrap({ cql }) {
  const bigResponse = useData(doComplexSearchAll({ cql, offset: 0, limit: 1 }));
  return CqlErrorMessage(bigResponse?.data?.complexSearch?.errorMessage);
}
