import PropTypes from "prop-types";
import { useInView } from "react-intersection-observer";
import { useEffect, useState, useMemo } from "react";

import Link from "@/components/base/link";
import List from "@/components/base/forms/list";
import Search from "@/components/base/forms/search";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";

import { Back } from "@/components/modal";

import Arrow from "@/components/base/animation/arrow";

import styles from "./Pickup.module.css";
import animations from "@/components/base/animation/animations.module.css";

import { useData } from "@/lib/api/api";

import * as libraryFragments from "@/lib/api/library.fragments";

/**
 * Make pickup branches selectable with Radio buttons
 *
 * @param {object} props
 * @param {object} props.agency
 * @param {className} props.string
 * @param {function} props.onClose
 * @param {function} props.onSelect
 * @param {object} props.selected The selected branch object
 * @param {function} props._ref
 */
export function Pickup({
  data,
  className,
  onClose,
  onSelect,
  selected,
  isVisible,
  onChange,
  isLoading,
}) {
  const context = { context: "order" };

  // Observe when bottom of list i visible
  const [ref, inView] = useInView({
    /* Optional options */
    threshold: 0,
  });

  // tabIndex
  const tabIndex = isVisible ? "0" : "-1";

  // Add shadow to bottom of scroll area, if last element is not visible
  const shadowClass = inView ? "" : styles.shadow;

  return (
    <div className={`${styles.pickup} ${className}`}>
      <Back
        isVisible={isVisible}
        handleClose={onClose}
        className={styles.back}
      />
      <div className={styles.search}>
        <Title type="title4" className={styles.title}>
          {Translate({ ...context, label: "pickup-search-title" })}
        </Title>
        <Text type="text3" className={styles.description}>
          {Translate({ ...context, label: "pickup-search-description" })}
        </Text>
        <Search
          className={styles.input}
          onChange={(value) => onChange(value)}
        />
      </div>
      <div className={`${styles.scrollArea} ${shadowClass}`}>
        {data?.result.length > 0 && (
          <List.Group
            enabled={!isLoading && isVisible}
            data-cy="allowed-branches"
          >
            {data.result.map((branch, idx) => {
              return (
                <List.Select
                  key={`${branch.branchId}-${idx}`}
                  selected={selected?.branchId === branch.branchId}
                  onSelect={() => onSelect(branch)}
                  label={branch.name}
                  className={[styles.radiobutton, animations["on-hover"]].join(
                    " "
                  )}
                >
                  <Text
                    lines="1"
                    skeleton={isLoading}
                    type="text2"
                    className={[
                      styles.library,
                      animations["h-border-bottom"],
                      animations["h-color-blue"],
                    ].join(" ")}
                  >
                    {branch.name}
                  </Text>
                </List.Select>
              );
            })}
          </List.Group>
        )}
        <div ref={ref} />
      </div>
    </div>
  );
}

Pickup.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  selected: PropTypes.object,
  onChange: PropTypes.func,
};

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  const [query, setQuery] = useState(null);

  const { data, isLoading, error } = useData(
    libraryFragments.search({ q: query })
  );

  if (error) {
    return "some error occured :(";
  }

  const dummyData = {
    hitcount: 5,
    result: [
      { name: "This is some branch name", branchId: "00" },
      { name: "This is some other branch name", branchId: "01" },
      { name: "This is also a branch name", branchId: "02" },
      { name: "A branch name", branchId: "03" },
      { name: "Also a bracndh name", branchId: "04" },
      { name: "This is some branch name", branchId: "05" },
      { name: "This is some other branch name", branchId: "06" },
      { name: "This is also a branch name", branchId: "07" },
      { name: "A branch name", branchId: "08" },
      { name: "Also a bracndh name", branchId: "09" },
    ],
  };

  return (
    <Pickup
      {...props}
      isLoading={isLoading}
      data={isLoading ? dummyData : data?.branches}
      onChange={(q) => setQuery(q)}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  skeleton: PropTypes.bool,
};
