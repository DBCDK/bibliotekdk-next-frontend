import PropTypes from "prop-types";
import { useState } from "react";
import debounce from "lodash/debounce";
import find from "lodash/find";

import List from "@/components/base/forms/list";
import Search from "@/components/base/forms/search";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";

import styles from "./Login.module.css";
import animations from "css/animations";
import { useData } from "@/lib/api/api";
import * as libraryFragments from "@/lib/api/library.fragments";
import { signIn } from "next-auth/react";
import getConfig from "next/config";

import Top from "@/components/_modal/pages/base/top";
import Router from "next/router";

import { LOGIN_MODE as LOGIN_MODE } from "@/components/_modal/pages/loanerform/LoanerForm";
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
    <List.FormLink
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
          <Text type="text3">
            <span
              dangerouslySetInnerHTML={{
                __html: matchOthers,
              }}
            />
          </Text>
        )}
      </>
    </List.FormLink>
  );
}

/**
 * Make pickup branches selectable with Radio buttons
 *
 * @param {object}
 * @param data
 * @param className
 * @param isVisible
 * @param onChange
 * @param isLoading
 * @param includeArrows
 * @param modal
 * @param context
 */
export function LoginPickup({
  data,
  className,
  isVisible,
  onChange,
  isLoading,
  includeArrows,
  modal,
  context,
}) {
  const allBranches = data?.result;
  const { mode = LOGIN_MODE.PLAIN_LOGIN, originUrl = null } = context || {};

  const APP_URL =
    getConfig()?.publicRuntimeConfig?.app?.url || "http://localhost:3000";

  // remove all modal params from callbackurl - this is login context
  const regexp = /&modal=+[0-9]*/g;
  const callbackurl = `${APP_URL}${Router.asPath}`.replace(regexp, "");

  const user = useUser();
  const onSelect = (branch) => {
    // edge case: - user is already logged in .. and tries to login in again with same library ..
    // @TODO .. we need a better way (than alert) to pass a message to the user - maybe we should use bootstraps toast ??
    const sameOrigin = branch?.agencyId === user?.loanerInfo?.pickupBranch;
    if (sameOrigin) {
      alert("vælg et andet bibliotek");
      modal.prev();
      return;
    }

    // show loanerform for selected bracnch
    modal.push("loanerform", {
      branchId: branch.branchId,
      doPolicyCheck: false,
      callbackUrl: callbackurl,
      mode,
      originUrl,
      clear: true,
    });
  };

  return (
    <div className={`${styles.login} ${className}`}>
      <Top />
      <div className={styles.search}>
        <Title type="title4" className={styles.title} tag="h2">
          {Translate({ context: "order", label: "pickup-search-title-2" })}
        </Title>
        <Text type="text3">
          {Translate({ context: "order", label: "pickup-search-description" })}
        </Text>
        <Search
          dataCy="pickup-search-input"
          placeholder={Translate({
            context: "order",
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
          disableGroupOutline
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
  const { agency, originUrl = null } = props;

  const [query, setQuery] = useState("");

  const { data, isLoading } = useData(
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
      origin={originUrl}
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
