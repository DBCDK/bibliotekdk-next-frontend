import PropTypes from "prop-types";

import useFilters from "@/components/hooks/useFilters";

import Text from "@/components/base/text";
import Link, { LinkOnlyInternalAnimations } from "@/components/base/link";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";

import styles from "./QuickFilters.module.css";
import React from "react";
import { FilterTypeEnum } from "@/lib/enums";

/**
 * The quick filters section
 *
 */
export function QuickFilters({ onFiltersClick }) {
  const { getCount: getFiltersCount } = useFilters();

  const countFilters = getFiltersCount([FilterTypeEnum.WORK_TYPES]).toString();

  return (
    <LinkOnlyInternalAnimations
      tabIndex="-1"
      className={`${styles.section}`}
      onClick={() => onFiltersClick()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          onFiltersClick();
        }
      }}
      border={false}
    >
      <div className={styles.link}>
        <Icon src="settings.svg" size={2} />
        <Link
          dataCy="view-all-filters"
          border={{ bottom: { keepVisible: true } }}
        >
          <Text type="text3" tag="span">
            {Translate({
              context: "search",
              label:
                countFilters === "0" ? "showAllFilters" : "showAllFiltersCount",
              vars: countFilters === "0" ? null : [countFilters],
            })}
          </Text>
        </Link>
      </div>
    </LinkOnlyInternalAnimations>
  );
}

export default function Wrap(props) {
  return <QuickFilters {...props} />;
}

QuickFilters.propTypes = {
  viewSelected: PropTypes.string,
  onViewSelect: PropTypes.func,
};
