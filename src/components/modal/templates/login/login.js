import PropTypes from "prop-types";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import find from "lodash/find";

import List from "@/components/base/forms/list";
import Search from "@/components/base/forms/search";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";

import { Back, Top } from "@/components/modal";

import styles from "./login.module.css";
import animations from "@/components/base/animation/animations.module.css";

import { useData } from "@/lib/api/api";

import * as libraryFragments from "@/lib/api/library.fragments";
import { useRouter } from "next/router";
import { branchOrderPolicy } from "@/lib/api/branches.fragments";

import { LoginForm } from "@/components/modal/templates/order/layers/loanerform/LoanerForm";

function Row({
  branch,
  selected,
  onSelect,
  isLoading,
  disabled,
  includeArrows,
  _ref,
}) {
  console.log(branch, "BRANCH");

  // Check for a highlight key matching on "name" prop
  const matchName = find(branch.highlights, {
    key: "name",
  });
  // If found, use matchned name (wraps match in <mark>...</mark>)
  const title = matchName?.value || branch.name;

  // If none found use a alternative match if any found
  const matchOthers = !matchName ? branch.highlights?.[0]?.value : null;

  disabled = disabled || !branch.pickupAllowed;

  const alternativeMatchClass = matchOthers ? styles.squeeze : "";
  const disabledClass = disabled ? styles.disabled : "";

  return (
    <List.Select
      selected={selected?.branchId === branch.branchId}
      onSelect={() => onSelect(branch)}
      label={branch.name}
      disabled={disabled}
      className={[
        styles.radiobutton,
        alternativeMatchClass,
        disabledClass,
        animations["on-hover"],
      ].join(" ")}
      includeArrows={includeArrows}
      _ref={_ref}
    >
      <>
        <Text
          lines="1"
          skeleton={isLoading}
          type="text2"
          dataCy={`text-${branch.name}`}
          className={[
            styles.library,
            animations["h-border-bottom"],
            animations["h-color-blue"],
          ].join(" ")}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: title,
            }}
          />
        </Text>
        {matchOthers && (
          <Text type="text3" className={styles.alternativeMatch}>
            <span
              dangerouslySetInnerHTML={{
                __html: matchOthers,
              }}
            />
          </Text>
        )}
      </>
    </List.Select>
  );
}

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
export function LoginPickup({
  data,
  className,
  onClose,
  onSelect,
  selected,
  isVisible,
  onChange,
  isLoading,
  includeArrows,
}) {
  const context = { context: "order" };

  const router = useRouter();
  const pid = router.query.order;

  // Observe when bottom of list i visible
  const [ref, inView] = useInView({
    /* Optional options */
    threshold: 0,
  });

  // tabIndex
  const tabIndex = isVisible ? "0" : "-1";

  // Add shadow to bottom of scroll area, if last element is not visible
  const shadowClass = inView ? "" : styles.shadow;

  const render = useState()[1];

  const orderPossibleBranches = data?.result;
  console.log(orderPossibleBranches, "BRANCHES");

  return (
    <div className={`${styles.pickup} ${className}`}>
      {/* This only load order policies, does not render anything */}
      <Top />
      <div className={`${styles.scrollArea} ${shadowClass}`}>
        <div className={styles.search}>
          <Title type="title4" className={styles.title}>
            {Translate({ ...context, label: "pickup-search-title" })}
          </Title>
          <Text type="text3" className={styles.description}>
            {Translate({ ...context, label: "pickup-search-description" })}
          </Text>
          <Search
            tabIndex={tabIndex}
            dataCy="pickup-search-input"
            placeholder={Translate({
              ...context,
              label: "pickup-input-placeholder",
            })}
            className={styles.input}
            onChange={debounce((value) => onChange(value), 100)}
          />
        </div>
        {!isLoading && (
          <List.Group
            data-cy="list-branches"
            className={styles.orderPossibleGroup}
          >
            {orderPossibleBranches?.map((branch, idx) => {
              return (
                <Row
                  key={`${branch.branchId}-${idx}`}
                  branch={branch}
                  selected={selected}
                  onSelect={onSelect}
                  isLoading={isLoading}
                  includeArrows={includeArrows}
                />
              );
            })}
          </List.Group>
        )}
        )}
      </div>
    </div>
  );
}

LoginPickup.propTypes = {
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
  let { agency } = props;

  const [query, setQuery] = useState("");

  /* const { data, isLoading, error } = useData(
    libraryFragments.search({ q: query || "" })
  );*/
  const { data, isLoading, error } = useData(
    libraryFragments.pickupsearch({ q: query || "" })
  );

  const dummyData = {
    hitcount: 10,
    result: [
      { name: "This is some branch name" },
      { name: "This is some other branch name" },
      { name: "This is also a branch name" },
      { name: "A branch name" },
      { name: "Also a bracndh name" },
      { name: "This is some branch name" },
      { name: "This is some other branch name" },
      { name: "This is also a branch name" },
      { name: "A branch name" },
      { name: "Also a bracndh name" },
    ],
  };

  const branches = !query ? agency : data?.branches;
  const includeArrows = !!query;

  return (
    <LoginPickup
      {...props}
      isLoading={isLoading}
      data={isLoading ? dummyData : branches}
      onChange={(q) => setQuery(q)}
      includeArrows={includeArrows}
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
