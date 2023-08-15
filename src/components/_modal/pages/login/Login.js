import PropTypes from "prop-types";
import { useState } from "react";
import debounce from "lodash/debounce";
import find from "lodash/find";

import Button from "@/components/base/button";
import List from "@/components/base/forms/list";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Search from "@/components/base/forms/search";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import useUser from "@/components/hooks/useUser";
import Top from "@/components/_modal/pages/base/top";
import { LOGIN_MODE } from "@/components/_modal/pages/login/utils";

import animations from "css/animations";
import { useData } from "@/lib/api/api";
import * as libraryFragments from "@/lib/api/library.fragments";

import styles from "./Login.module.css";

import { signIn } from "next-auth/react";
import getConfig from "next/config";
import Router from "next/router";
import { showLogin } from "./utils";

function Select({
  branch,
  onSelect,
  isLoading,
  disabled,
  includeArrows,
  _ref,
}) {
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
 * @param {obj}
 * @param {boolean}data
 * @param className
 * @param {boolean} isVisible
 * @param {function} onChange
 * @param {boolean} hasQuery dont show loading skeleton if there is no query / before user has typed anything
 * @param {boolean} isLoading
 * @param includeArrows
 * @param {obj} modal
 * @param {obj} context
 * @param {string} title
 */
export function LoginPickup({
  data,
  isVisible,
  onChange,
  hasQuery,
  isLoading,
  includeArrows,
  modal,
  context,
}) {
  const allBranches = data?.result;
  const {
    title,
    mode = LOGIN_MODE.PLAIN_LOGIN,
    originUrl = null,
  } = context || {};
  const APP_URL =
    getConfig()?.publicRuntimeConfig?.app?.url || "http://localhost:3000";

  // remove all modal params from callbackurl - this is login context
  const regexp = /&modal=+[0-9]*/g;
  const callbackurl = `${APP_URL}${Router.asPath}`.replace(regexp, "");
  const showResultsList = hasQuery && allBranches?.length > 0;
  const showMitIDLogin = !hasQuery || !allBranches || allBranches.length < 1;
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

    if (branch?.borrowerCheck) {
      modal.push("openAdgangsplatform", {
        callbackUrl: callbackurl, //TODO find correct callbackUrl for header and from order button (add bestil modal)
        agencyId: branch.agencyId,
        agencyName: originUrl ? originUrl : branch.agencyName, //TODO do we have originUrl and how does it look like?
      });
      return;
    }
    if (showLogin(mode)) {
      modal.push("loanerform", {
        branchId: branch.branchId,
        doPolicyCheck: false,
        callbackUrl: callbackurl, //TODO remove
        mode,
        originUrl,
        clear: true,
      });
    } else {
      modal.push("loginNotSupported", {
        libraryName: branch.agencyName,
      });
    }
  };

  const onLogin = () => {
    signIn(
      "adgangsplatformen",
      { callbackUrl: callbackurl },
      { force_login: 1, idp: "nemlogin" }
    );
  };

  return (
    <div className={styles.login}>
      <Top />
      <div>
        <Title type="title4" className={styles.title} tag="h2">
          {title}
        </Title>
        <section className={styles.libraryLoginSection}>
          <Text type="text2">
            {Translate({ context: "login", label: "login-via-library" })}
          </Text>
          <Search
            dataCy="pickup-search-input"
            placeholder={Translate({
              context: "order",
              label: "pickup-input-placeholder",
            })}
            className={styles.search}
            onChange={debounce((value) => onChange(value), 100)}
          />
          <Text type="text3">
            {Translate({ context: "login", label: "use-loan-info" })}
          </Text>
        </section>
      </div>
      {showResultsList && (
        <List.Group
          enabled={!isLoading && isVisible}
          data-cy="list-branches"
          disableGroupOutline
        >
          {allBranches.map((branch, idx) => {
            return (
              <Select
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
      {showMitIDLogin && (
        <section className={styles.mitIDSection}>
          <Text type="text2">
            {Translate({ context: "login", label: "or-mit-id" })}
          </Text>
          <Button
            data-cy="mitid-button"
            type="secondary"
            size="large"
            className={styles.mitIDButton}
            onClick={onLogin}
          >
            <Icon
              src="MitID.svg"
              alt="mitID"
              size={{ h: "2" }}
              className={styles.mitIDIcon}
            />
          </Button>
          <Link
            href="/hjaelp/ny-bruger/45"
            className={styles.createLibraryUserLink}
            border={{ bottom: { keepVisible: true } }}
          >
            <Text type="text3" tag="span">
              {Translate({ context: "login", label: "create-library-user" })}
            </Text>
          </Link>
        </section>
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
      { name: "Also a branch name" },
      { name: "This is some branch name" },
      { name: "This is some other branch name" },
      { name: "This is also a branch name" },
      { name: "A branch name" },
      { name: "Also a branch name" },
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
      hasQuery={!!query}
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
