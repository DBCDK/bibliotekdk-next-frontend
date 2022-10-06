import PropTypes from "prop-types";

import Link from "@/components/base/link";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

import styles from "./Skip.module.css";

export default function Skip({ id, className = "", label }) {
  if (typeof window === "undefined") {
    return null;
  }

  const element = document.getElementById(id);

  return (
    <Link
      className={`${styles.skip} ${className}`}
      onClick={() => element?.focus()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          e.preventDefault();
          element?.focus();
        }
      }}
      aria-label={label}
    >
      <Text>
        {Translate({
          context: "general",
          label: "skip",
        })}
      </Text>
    </Link>
  );
}

// PropTypes for component
Skip.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  label: PropTypes.string,
};
