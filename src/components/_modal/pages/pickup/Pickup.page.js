import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import find from "lodash/find";

import getConfig from "next/config";

const APP_URL =
  getConfig()?.publicRuntimeConfig?.app?.url || "http://localhost:3000";

import List from "@/components/base/forms/list";
import Search from "@/components/base/forms/search";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";

import Top from "../base/top";

import styles from "./Pickup.module.css";
import animations from "@/components/base/animation/animations.module.css";

import useUser from "@/components/hooks/useUser";

import { useData } from "@/lib/api/api";

import * as libraryFragments from "@/lib/api/library.fragments";

import { branchOrderPolicy } from "@/lib/api/branches.fragments";

import { LOGIN_PURPOSE } from "@/components/_modal/pages/loanerform/LoanerForm";

/**
 * Special component responsible for loading order policy
 * Will not render anything, but needs to be mounted
 */
function PolicyLoader({ branch, onLoad, pid, requireDigitalAccess }) {
  const pickupAllowed = branch?.pickupAllowed;
  let { data } = useData(
    pid &&
      branch?.branchId &&
      branchOrderPolicy({ branchId: branch.branchId, pid })
  );

  const orderPolicy =
    branch?.orderPolicy || data?.branches?.result?.[0]?.orderPolicy;

  const digitalCopyAccess = data?.branches?.result?.[0]?.digitalCopyAccess;

  useEffect(() => {
    if (orderPolicy || !pickupAllowed) {
      onLoad({
        pickupAllowed,
        orderPossible: requireDigitalAccess
          ? digitalCopyAccess
          : !pickupAllowed
          ? false
          : orderPolicy?.orderPossible,
      });
    }
  }, [digitalCopyAccess, orderPolicy, pickupAllowed]);

  return null;
}

function Row({
  branch,
  selected,
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
 * @param {className} props.string
 * @param {function} props.onClose
 * @param {object} props.selected The selected branch object
 * @param {function} props._ref
 */
export function Pickup({
  data,
  selected,
  isVisible,
  onChange,
  isLoading,
  includeArrows,
  updateLoanerInfo,
  // modal props
  context,
  modal,
}) {
  // Get pid from modal context
  const {
    pid,
    requireDigitalAccess,
    purpose = LOGIN_PURPOSE.PLAIN_LOGIN,
  } = context;

  /**
   *
   * @param {obj} branch
   * @param {obj} modal
   */
  function handleOnSelect(branch, modal) {
    // Selected branch and (loggedIn) user branches has same agency
    const sameOrigin =
      branch.agencyId === context.initial?.agency?.result?.[0].agencyId;

    // New selected branch has borrowercheck
    const hasBorchk = branch.borrowerCheck;
    // if selected branch has same origin as user agency
    if (sameOrigin && hasBorchk) {
      // Set new branch without new log-in
      updateLoanerInfo({ pickupBranch: branch.branchId });
      // update context at previous modal
      modal.prev();
      return;
    }

    // open loanerform
    modal.push("loanerform", {
      branchId: branch.branchId,
      pid,
      purpose,
    });
  }

  const loadedOrderPolicies = useRef({});
  const render = useState()[1];

  // Incrementally creates a list of allowed branches as policies load one by one,
  // keeping the order of the original result
  let allPoliciesLoaded = isLoading ? false : true;

  const orderPossibleBranches =
    data?.result?.filter((branch) => {
      if (!allPoliciesLoaded) {
        return false;
      }
      if (!loadedOrderPolicies.current[`${branch.branchId}_${pid}`]) {
        allPoliciesLoaded = false;
        return false;
      }
      return loadedOrderPolicies.current[`${branch.branchId}_${pid}`]
        ?.orderPossible;
    }) || [];

  const orderNotPossibleBranches =
    (allPoliciesLoaded &&
      data?.result?.filter(
        (branch) =>
          !loadedOrderPolicies.current[`${branch.branchId}_${pid}`]
            ?.orderPossible
      )) ||
    [];

  const hasMoreMessage =
    allPoliciesLoaded &&
    data?.hitcount > data?.result?.length &&
    Translate({ context: "order", label: "has-more-pickup" });

  return (
    <div className={`${styles.pickup}`}>
      <Top title={context.label} />
      {/* This only load order policies, does not render anything */}
      {data?.result
        ?.filter((branch) => branch.branchId)
        .map((branch) => {
          const key = `${branch.branchId}_${pid}`;
          return (
            <PolicyLoader
              key={key}
              branch={branch}
              onLoad={(policy) => {
                loadedOrderPolicies.current[key] = policy;
                render({});
              }}
              pid={pid}
              requireDigitalAccess={requireDigitalAccess}
            />
          );
        })}

      <div className={styles.search}>
        <Title type="title4" className={styles.title}>
          {Translate({
            context: "order",
            label:
              purpose === LOGIN_PURPOSE.ORDER_PHYSICAL
                ? "pickup-search-title"
                : "pickup-search-title-2",
          })}
        </Title>
        <Text type="text3" className={styles.description}>
          {Translate({
            context: "order",
            label: "pickup-search-description",
          })}
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

      {orderPossibleBranches.length > 0 && (
        <List.Group
          enabled={!isLoading && isVisible}
          data-cy="list-branches"
          className={styles.orderPossibleGroup}
        >
          {orderPossibleBranches.map((branch, idx) => {
            return (
              <Row
                key={`${branch.branchId}-${idx}`}
                branch={branch}
                selected={selected}
                onSelect={(branch) => handleOnSelect(branch, modal)}
                modal={modal}
                isLoading={isLoading}
                includeArrows={includeArrows}
              />
            );
          })}
        </List.Group>
      )}
      {!allPoliciesLoaded && (
        <Text type="text2" className={styles.loadingText}>
          {Translate({ context: "order", label: "check-policy-loading" })}
        </Text>
      )}
      {hasMoreMessage && (
        <Text type="text2" className={styles.loadingText}>
          {hasMoreMessage}
        </Text>
      )}
      {orderNotPossibleBranches.length > 0 && (
        <>
          <Text type="text1" className={styles.pickupNotAllowedTitle}>
            {Translate({ context: "order", label: "pickup-not-allowed" })}
          </Text>
          <ul>
            {orderNotPossibleBranches.map((branch, idx) => {
              return (
                <li key={`${branch.branchId}-${idx}`}>
                  <Text type="text3">{branch.name}</Text>
                </li>
              );
            })}
          </ul>
        </>
      )}
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
  const { initial } = props.context;

  const [query, setQuery] = useState("");

  const { updateLoanerInfo } = useUser();

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

  const branches = !query ? initial?.agency : data?.branches;
  const includeArrows = !!query;

  return (
    <Pickup
      {...props}
      updateLoanerInfo={(info) => {
        updateLoanerInfo(info);
      }}
      isLoading={isLoading}
      data={isLoading ? dummyData : branches}
      onChange={(q) => setQuery(q)}
      includeArrows={includeArrows}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  onChange: PropTypes.func,
  skeleton: PropTypes.bool,
};
