import PropTypes from "prop-types";

import Section from "@/components/base/section";
import styles from "./QuickFilters.module.css";
import ViewSelector from "../viewselector";

/**
 * The quick filters section
 *
 */
export default function QuickFilters({ onViewSelect, viewSelected }) {
  return (
    <Section contentDivider={null} titleDivider={null} title={null}>
      <div className={styles.quickfilters}>
        <ViewSelector
          className={styles.viewselector}
          onViewSelect={onViewSelect}
          viewSelected={viewSelected}
        />
      </div>
    </Section>
  );
}
QuickFilters.propTypes = {
  viewSelected: PropTypes.string,
  onViewSelect: PropTypes.func,
};
