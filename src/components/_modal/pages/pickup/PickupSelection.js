import { useEffect, useRef, useState } from "react";
import List from "@/components/base/forms/list";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./Pickup.module.css";
import animations from "css/animations";
import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import find from "lodash/find";
import cx from "classnames";
import { handleOnSelect } from "@/components/_modal/utils";

/**
 * Special component responsible for loading order policy
 * Will not render anything, but needs to be mounted
 */
function PolicyLoader({ branch, onLoad, pid, requireDigitalAccess }) {
  const pickupAllowed = branch?.pickupAllowed;
  let { data } = useData(
    pid &&
      branch?.branchId &&
      branchesFragments.branchOrderPolicy({
        branchId: branch.branchId,
        pids: [pid],
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
  const { pid, requireDigitalAccess, showAllBranches } = context; //TODO is it enough to only check for ONE pid? BIBDK2021-2203

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

  //for multiorder, we look at pickupAllowed since we dont want to
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

  const hasMoreMessage =
    allPoliciesLoaded &&
    data?.hitcount > data?.result?.length &&
    Translate({ context: "order", label: "has-more-pickup" });

  return (
    <>
      {/* This only loads order policies, does not render anything */}
      {data?.result
        ?.filter((branch) => branch.branchId)
        .map((branch) => {
          const key = `${branch.branchId}_${pid}`;
          return (
            <PolicyLoader //TODO can actually handle several pids at once! BIBDK2021-2203
              key={key}
              branch={branch}
              onLoad={(policy) => {
                loadedOrderPolicies.current[key] = policy;
                render({});
              }}
              pid={pid}
              //pids=
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
      {!allPoliciesLoaded && !showAllBranches && (
        <Text type="text2" className={styles.loadingText}>
          {Translate({ context: "order", label: "check-policy-loading" })}
        </Text>
      )}
      {hasMoreMessage && (
        <Text type="text2" className={styles.loadingText}>
          {hasMoreMessage}
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
