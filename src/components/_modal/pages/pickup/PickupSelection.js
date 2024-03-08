import { useEffect, useRef, useState } from "react";
import List from "@/components/base/forms/list";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./Pickup.module.css";
import animations from "@/components/base/animation/animations.module.css";
import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import find from "lodash/find";
import cx from "classnames";
import { handleOnSelect } from "@/components/_modal/utils";

/**
 * Special component responsible for loading order policy
 * Will not render anything, but needs to be mounted
 */
function PolicyLoader({ branch, onLoad, pid, pids, requireDigitalAccess }) {
  const pickupAllowed = branch?.pickupAllowed;
  let { data } = useData(
    (pid || pids) &&
      branch?.branchId &&
      branchesFragments.branchOrderPolicy({
        branchId: branch.branchId,
        pids: pids || [pid],
      })
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

/**
 * Row that desplays a branch
 * @param {Object} branch
 * @param {boolean} selected
 * @param {function} onSelect
 * @param {boolean} isLoading
 * @param {boolean} includeArrows
 * @param {Object} _ref
 * @returns {React.JSX.Element}
 */
function Row({ branch, selected, onSelect, isLoading, includeArrows, _ref }) {
  // Check for a highlight key matching on "name" prop
  const matchName = find(branch.highlights, {
    key: "name",
  });
  // If found, use matchned name (wraps match in <mark>...</mark>)
  const title = matchName?.value || branch.name;

  // If none found use a alternative match if any found
  const matchOthers = !matchName ? branch.highlights?.[0]?.value : null;

  const disabled = !branch.pickupAllowed;

  return (
    <List.FormLink
      selected={selected?.branchId === branch.branchId}
      onSelect={() => onSelect(branch)}
      label={branch.name}
      disabled={disabled}
      className={cx(animations["on-hover"], {
        [styles.squeeze]: matchOthers,
        [styles.disabled]: disabled,
      })}
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
          <Text type="text3" className={styles.alternativeMatch}>
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

export default function PickupSelection(props) {
  const {
    data,
    selected,
    isVisible,
    isLoading,
    includeArrows,
    updateLoanerInfo,
    // modal props
    context,
    modal,
  } = { ...props };
  // Get pid from modal context
  const { pid, requireDigitalAccess, showAllBranches, pids } = context;

  const loadedOrderPolicies = useRef({});
  const render = useState()[1];
  // Incrementally creates a list of allowed branches as policies load one by one,
  // keeping the order of the original result
  let allPoliciesLoaded = !isLoading;

  //policies are only checked for single orders currently, since they check for pids
  // if we did this for multiorder, we could potentially block a branch for all orders,
  // eventhough only one order is not possible on that specific branch
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

  //for multiorder, we look at pickupAllowed since we dont have policies
  const pickUpAllowedBranches =
    data?.result?.filter((branch) => branch.pickupAllowed) || [];

  const pickUpNotAllowedBranches =
    data?.result?.filter((branch) => !branch.pickupAllowed) || [];

  const selectableBranches = showAllBranches
    ? pickUpAllowedBranches
    : orderPossibleBranches;

  const showSelectableBranches = selectableBranches.length > 0;

  const nonSelectableBranches = showAllBranches
    ? pickUpNotAllowedBranches
    : orderNotPossibleBranches;

  const showNonSelectableBranches = nonSelectableBranches.length > 0;

  //we retrieve max 10 results, if the hitcount is higher, it means there are more matches, but we dont show them
  //therefor, we ask the user to refine her search
  const tryMoreSpecificMessage =
    allPoliciesLoaded &&
    data?.hitcount > data?.result?.length &&
    Translate({ context: "order", label: "has-more-pickup" });

  //we dont show "Tjekker om der er flere mulige afhentningssteder ...", for multiorder (=showAllBranches)
  // since we dont look at policies for multiorder
  const showWaitingForPolicies = !allPoliciesLoaded && !showAllBranches;

  return (
    <>
      {/* This only loads order policies, does not render anything */}
      {!showAllBranches &&
        data?.result
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
                pids={pids}
                requireDigitalAccess={requireDigitalAccess}
              />
            );
          })}

      {showSelectableBranches && (
        <List.Group
          enabled={!isLoading && isVisible}
          data-cy="list-branches"
          className={styles.orderPossibleGroup}
          disableGroupOutline
        >
          {selectableBranches.map((branch, idx) => {
            return (
              <Row
                key={`${branch.branchId}-${idx}`}
                branch={branch}
                selected={selected}
                onSelect={(branch) =>
                  handleOnSelect({
                    branch: branch,
                    modal: modal,
                    context: context,
                    updateLoanerInfo: updateLoanerInfo,
                  })
                }
                modal={modal}
                isLoading={isLoading}
                includeArrows={includeArrows}
              />
            );
          })}
        </List.Group>
      )}
      {showWaitingForPolicies && (
        <Text type="text2" className={styles.loadingText}>
          {Translate({ context: "order", label: "check-policy-loading" })}
        </Text>
      )}
      {tryMoreSpecificMessage && (
        <Text type="text2" className={styles.loadingText}>
          {tryMoreSpecificMessage}
        </Text>
      )}
      {/** show pickup not allowed branches here  */}
      {showNonSelectableBranches && (
        <>
          <Text type="text1" className={styles.pickupNotAllowedTitle}>
            {Translate({ context: "order", label: "pickup-not-allowed" })}
          </Text>
          <ul>
            {nonSelectableBranches.map((branch, idx) => {
              return (
                <li key={`${branch.branchId}-${idx}`}>
                  <Text type="text3">{branch.name}</Text>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
