import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import find from "lodash/find";

import List from "@/components/base/forms/list";
import Search from "@/components/base/forms/search";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";

import { Back } from "@/components/modal";
import styles from "./Login.module.css";
import animations from "@/components/base/animation/animations.module.css";
import { useData } from "@/lib/api/api";
import * as libraryFragments from "@/lib/api/library.fragments";
import { signIn } from "next-auth/client";
import getConfig from "next/config";

import Top from "@/components/_modal/pages/base/top";
import Router from "next/router";
import useUser from "@/components/hooks/useUser";

function Row({ branch, onSelect, isLoading, disabled, includeArrows, _ref }) {
  // Check for a highlight key matching on "name" prop
  const matchName = find(branch.highlights, {
    key: "name",
  });
  // If found, use matchned name (wraps match in <mark>...</mark>)
  const title = matchName?.value || branch.name;

  // If none found use a alternative match if any found
  const matchOthers = !matchName ? branch.highlights?.[0]?.value : null;
  disabled = false;

  return (
    <List.Select
      onSelect={() => onSelect(branch)}
      label={branch.name}
      disabled={disabled}
      className={[animations["on-hover"]].join(" ")}
      includeArrows={includeArrows}
      _ref={_ref}
    >
      <>
        <Text
          lines={1}
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

function PickupList() {}

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
  isVisible,
  onChange,
  isLoading,
  includeArrows,
  modal,
}) {
  const context = { context: "order" };
  const allBranches = data?.result;

  let [pickupBranch, setPickupBranch] = useState(null);

  const APP_URL =
    getConfig()?.publicRuntimeConfig?.app?.url || "http://localhost:3000";

  const onBack = () => {
    setPickupBranch(null);
  };

  // show loanerform for selected bracnch
  const onSelect = (branch) => {
    modal.push("loanerform", {
      branchId: branch.branchId,
      doPolicyCheck: false,
      onSubmit: (branch) => {
        modal.clear();
      },
      callbackUrl: `${APP_URL}${Router.asPath}`,
    });
  };

  return (
    <div className={`${styles.loanerform} ${className}`}>
      <Top.Default />
      {/* a branch has been selected -> if no borrowercheck -> show loanerform */}
      {pickupBranch === null && (
        <div className={`${styles.scrollArea} `}>
          <div className={styles.search}>
            <Title type="title4" className={styles.title}>
              {Translate({ ...context, label: "pickup-search-title" })}
            </Title>
            <Text type="text3">
              {Translate({ ...context, label: "pickup-search-description" })}
            </Text>
            <Search
              dataCy="pickup-search-input"
              placeholder={Translate({
                ...context,
                label: "pickup-input-placeholder",
              })}
              className={styles.input}
              onChange={debounce((value) => onChange(value), 100)}
            />
          </div>
          {allBranches?.length > 0 && (
            <List.Group
              enabled={!isLoading && isVisible}
              data-cy="list-branches"
              className={styles.orderPossibleGroup}
            >
              {allBranches.map((branch, idx) => {
                return (
                  <Row
                    key={`${branch.branchId}-${idx}`}
                    branch={branch}
                    onSelect={onSelect}
                    isLoading={isLoading}
                    includeArrows={includeArrows}
                  />
                );
              })}
            </List.Group>
          )}
        </div>
      )}
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
  const { agency } = props;

  const [query, setQuery] = useState("");

  const { data, isLoading, error } = useData(
    libraryFragments.search({ q: query || "" })
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
      onLogin={signIn}
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
