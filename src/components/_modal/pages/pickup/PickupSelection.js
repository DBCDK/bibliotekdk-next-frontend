import { useRef, useState, useEffect } from "react";
import List from "@/components/base/forms/list";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./Pickup.module.css";
import animations from "css/animations";
import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";

/**
 *
 * @param {obj} branch
 * @param {obj} modal
 */
function handleOnSelect(branch, modal, context, updateLoanerInfo) {
  // Selected branch and (loggedIn) user branches has same agency
  console.log("AGENCIES ", context.initial?.agencies);
  const sameOrigin = context.initial?.agencies?.find(
    (agency) => agency.result?.[0].agencyId === branch.agencyId
  );

  console.log("SAME ORIGIN ", sameOrigin);
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
  const callbackUID = modal?.stack?.find((m) => m.id === "order").uid;
  if (branch?.borrowerCheck) {
    modal.push("openAdgangsplatform", {
      agencyId: branch.agencyId,
      branchId: branch.branchId,
      agencyName: branch.agencyName,
      callbackUID: callbackUID, //we should always have callbackUID, but if we dont, order modal is not opened after login.
    });
    return;
  } else {
    modal.push("loanerform", {
      branchId: branch.branchId,
      changePickupBranch: true,
    });
  }
}

/**
 * Special component responsible for loading order policy
 * Will not render anything, but needs to be mounted
 */
function PolicyLoader({ branch, onLoad, pid, requireDigitalAccess }) {
  const pickupAllowed = branch?.pickupAllowed;
  let { data } = useData(
    pid &&
      branch?.branchId &&
      branchesFragments.branchOrderPolicy({ branchId: branch.branchId, pid })
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
    <List.FormLink
      selected={selected?.branchId === branch.branchId}
      onSelect={() => onSelect(branch)}
      label={branch.name}
      disabled={disabled}
      className={[
        alternativeMatchClass,
        disabledClass,
        animations["on-hover"],
      ].join(" ")}
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
    branchesFromLogin,
    branchesFromSearch,
    isLoading,
    includeArrows,
    updateLoanerInfo,
    onChange,
    // modal props
    context,
    modal,
  } = { ...props };

  // Get pid from modal context
  const { pid, requireDigitalAccess } = context;

  const loadedOrderPolicies = useRef({});
  const render = useState()[1];

  // Incrementally creates a list of allowed branches as policies load one by one,
  // keeping the order of the original result
  let allPoliciesLoaded = !isLoading;

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

  //TODO: cant we show all agencies?
  const hasMoreMessage =
    allPoliciesLoaded &&
    data?.hitcount > data?.result?.length &&
    Translate({ context: "order", label: "has-more-pickup" });

  return (
    <>
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

      {orderPossibleBranches.length > 0 && (
        <List.Group
          enabled={!isLoading && isVisible}
          data-cy="list-branches"
          className={styles.orderPossibleGroup}
          disableGroupOutline
        >
          {orderPossibleBranches.map((branch, idx) => {
            return (
              <Row
                key={`${branch.branchId}-${idx}`}
                branch={branch}
                selected={selected}
                onSelect={(branch) =>
                  handleOnSelect(branch, modal, context, updateLoanerInfo)
                }
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
    </>
  );
}
