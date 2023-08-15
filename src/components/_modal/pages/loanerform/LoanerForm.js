import React, { useState } from "react";
import PropTypes from "prop-types";

import merge from "lodash/merge";

import { signIn } from "next-auth/react";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Email from "@/components/base/forms/email";
import Input from "@/components/base/forms/input";
import Button from "@/components/base/button";
import Translate, { hasTranslation } from "@/components/base/translate";

import Top from "../base/top";

import styles from "./LoanerForm.module.css";
import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import useUser from "@/components/hooks/useUser";
import * as userFragments from "@/lib/api/user.fragments";
import { manifestationsForAccessFactory } from "@/lib/api/manifestation.fragments";
import { inferAccessTypes } from "@/components/_modal/pages/edition/utils";
import { validateEmail } from "@/utils/validateEmail";
import { getLabel } from "@/components/base/forms/email/Email";

const ERRORS = {
  MISSING_INPUT: "error-missing-input",
};

export function UserParamsForm({ branch, initial, onSubmit, mode, originUrl }) {
  const [errorCode, setErrorCode] = useState();
  const [state, setState] = useState(initial || {});
  const [validMail, setValidMail] = useState(true);

  const requiredParameters = branch?.userParameters?.filter(
    ({ parameterRequired }) => parameterRequired
  );
  function validateState() {
    for (let i = 0; i < requiredParameters.length; i++) {
      const { userParameterType } = requiredParameters[i];
      if (!state[userParameterType]) {
        return ERRORS.MISSING_INPUT;
      }
    }
    const validMail = validateEmail(state.userMail);
    setValidMail(validMail);
    const emailError = getLabel(state.userMail, validMail);
    if (emailError) {
      return emailError.label;
    }
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const error = validateState();
        setErrorCode(error);
        if (!error) {
          onSubmit(state);
        }
      }}
    >
      <Text type="text2">
        {Translate({
          context: "order",
          label: "fillout-loaner-info",
          vars: originUrl || [branch?.agencyName || branch?.name],
        })}
      </Text>
      <div className={styles.fields}>
        {requiredParameters?.map(({ userParameterType, description }, idx) => {
          const labelKey = `${userParameterType}-label`;
          const labelTranslation = {
            context: "form",
            label: labelKey,
          };
          const placeholderTranslation = {
            context: "form",
            label: `${userParameterType}-placeholder`,
          };
          const explainTranslation = {
            context: "form",
            label: `${userParameterType}-explain`,
          };

          return (
            <div key={idx} className={styles.field}>
              <Text type="text2" tag="label" id={labelKey}>
                {description ||
                  (hasTranslation(labelTranslation)
                    ? Translate(labelTranslation)
                    : userParameterType)}
              </Text>
              {userParameterType === "userMail" ? (
                <Email
                  valid={validMail}
                  value={state.userMail || ""}
                  onChange={(e) =>
                    setState({
                      ...state,
                      [userParameterType]: e?.target?.value,
                    })
                  }
                  dataCy={`input-${userParameterType}`}
                  placeholder={
                    hasTranslation(placeholderTranslation)
                      ? Translate(placeholderTranslation)
                      : ""
                  }
                  aria-labelledby={labelKey}
                />
              ) : (
                <Input
                  value={state[userParameterType]}
                  type={
                    ((userParameterType === "userId" ||
                      userParameterType === "cpr") &&
                      "password") ||
                    "text"
                  }
                  dataCy={`input-${userParameterType}`}
                  onChange={(e) =>
                    setState({
                      ...state,
                      [userParameterType]: e?.target?.value,
                    })
                  }
                  placeholder={
                    description ||
                    (hasTranslation(placeholderTranslation)
                      ? Translate(placeholderTranslation)
                      : "")
                  }
                  required
                  aria-labelledby={labelKey}
                />
              )}
              {hasTranslation(explainTranslation) && (
                <Text type="text3" className={styles.explain}>
                  {Translate(explainTranslation)}
                </Text>
              )}
            </div>
          );
        })}
        {errorCode && (
          <Text type="text3" className={styles.error}>
            {Translate({ context: "form", label: errorCode })}
          </Text>
        )}
      </div>

      <Text type="text3" className={styles.guestlogin}>
        {Translate({
          context: "order",
          label: "order-guest-login-description",
          vars: [branch.agencyName],
        })}
      </Text>
      <Button onClick={() => {}} tabIndex="0">
        {Translate({
          context: "order",
          label: "go-to-order",
        })}
      </Button>
    </form>
  );
}

/**
 * Change originUrl to something readable (eg ebscohost.search.com -> Ebsco)
 *
 * 0931 - PJO - we keep this method for now - but return the origin .. wait
 * for design to make up their mind
 *
 * @param originUrl
 * @returns {string|*}
 */

function originUrlToUrlName(originUrl) {
  return originUrl;
  // these are for dda (demand drive acquisition)
  // translate urls to something readable

  // TODO: Figure out why this code is here
  //  Ebook central Ebsco
  // if (originUrl && mode === LOGIN_MODE.DDA) {
  //   if (originUrl.indexOf("ebookcentral") !== -1) {
  //     return "Ebook central";
  //   }
  //   if (originUrl.indexOf("ebscohost") !== -1) {
  //     return "Ebsco";
  //   }
  //   return originUrl;
  // }
}

/**
 *  Shows login formular for FFU libraries without adgangsplatform login.
 * @param {obj} branch
 * @param {func} onSubmit
 * @param {obj} skeleton
 * @param {obj} initial
 * @param {obj} context
 * @param {obj} digitalCopyAccess
 * @returns JSX element
 */
export function LoanerForm({
  branch,
  onSubmit,
  skeleton,
  initial,
  // modal props
  context,
}) {
  let { originUrl = null } = context || {};

  if (skeleton) {
    return (
      <div className={styles.loanerform}>
        <Top />
        <Title type="title4" tag="h3" skeleton={true}>
          {Translate({
            context: "order",
            label: "order-to",
            vars: [branch?.name || "-"],
          })}
        </Title>
        <Text type="text2" skeleton={true} lines={2} />
        <Button className={styles.loginbutton} skeleton={true}>
          loading...
        </Button>
      </div>
    );
  }

  if (!branch) {
    return null;
  }

  const origin = originUrlToUrlName(originUrl);
  return (
    <div className={styles.loanerform}>
      <Top />
      <Title type="title4" tag="h3">
        {Translate({
          context: "order",
          label: "order-to",
          vars: origin ? [origin] : [branch.name],
        })}
      </Title>

      <UserParamsForm
        branch={branch}
        initial={initial}
        onSubmit={onSubmit}
        originUrl={originUrl}
      />
    </div>
  );
}

/**
 * Get a callback url for sign in.
 *
 * Remove modals except for the third one.
 *     scenarios:
 *     a. user logins from a page eg. infomedia
 *     b. user logins from a modal eg. order
 *       if user logins in from a modal the top stack will be the original modal.
 *       two last elements in stack are "login" and "loanerform" - login ALWAYS
 *       happens via - login->loanerform -- so if user comes from another modal
 *       it will be on top - redirect to that
 *
 * @param modal
 * @param pickupBranch
 * @returns {string}
 */
function getCallbackUrl(modal, pickupBranch) {
  const stack = modal.stack;
  let callback = window.location.href;
  // remove modal from callback - if any
  const regex = /[&|?]modal=[0-9]*/;
  callback = callback.replace(regex, "");
  if (stack.length > 2) {
    // pick top element in stack
    callback =
      callback + (callback.includes("?") ? "&" : "?") + "modal=" + stack[0].uid;
  }
  return pickupBranch
    ? callback +
        (callback.includes("?") ? "&" : "?") +
        "setPickupAgency=" +
        pickupBranch
    : callback;
}

LoanerForm.propTypes = {
  branch: PropTypes.object,
  onSubmit: PropTypes.func,
  onLogin: PropTypes.func,
  submitting: PropTypes.bool,
  skeleton: PropTypes.bool,
  initial: PropTypes.object,
};

/**
 * Will hook up the LoanerForm with needed data
 * It will look for the URL query parameter 'branch', and use this id
 * to fetch the branch. Furthermore, it fetches some data for the potentially
 * logged in user, to determine if its already logged in / or need to logout->login.
 *
 * If the loaner formular is submitted, other components may retrieve the data
 * with the userLoanerInfo hook.
 *
 * @returns {component}
 */
export default function Wrap(props) {
  const { branchId, pid, doPolicyCheck, clear } = props.context;

  // Branch userparams fetch (Fast)
  const { data, isLoading: branchIsLoading } = useData(
    branchId && branchesFragments.branchUserParameters({ branchId })
  );

  // PolicyCheck in own request (sometimes slow)
  const { data: policyData } = useData(
    pid && branchId && branchesFragments.branchOrderPolicy({ branchId, pid })
  );
  const mergedData = merge({}, data, policyData);

  const { isAuthenticated } = useUser();

  const { loanerInfo, updateLoanerInfo } = useUser();

  // User branches fetch
  const { data: userData, isLoading: userIsLoading } = useData(
    isAuthenticated && userFragments.branchesForUser()
  );

  const loggedInAgencyId = userData?.user?.agency?.result?.[0]?.agencyId;
  const branch = mergedData?.branches?.result?.[0];
  const skeleton =
    (branchId && (userIsLoading || branchIsLoading)) ||
    loggedInAgencyId === branch?.agencyId;

  async function onSubmit(info) {
    await updateLoanerInfo({
      userParameters: info,
      pickupBranch: branch.branchId,
    });
    if (clear) {
      props.modal.clear();
    } else {
      // Back to order
      props.modal.prev("order");
    }
  }

  const { data: manifestationData } = useData(
    pid && manifestationsForAccessFactory({ pid })
  );
  const { isDigitalCopy, isPeriodicaLike } = inferAccessTypes(
    null,
    branch?.agencyId,
    manifestationData?.manifestations
  );

  if (!branchId) {
    return null;
  }

  return (
    <>
      <LoanerForm
        {...props}
        branch={branch}
        initial={loanerInfo.userParameters}
        onLogin={() => {
          const callback = getCallbackUrl(props.modal, branch?.branchId);
          signIn(
            "adgangsplatformen",
            { callbackUrl: callback },
            { agency: branch?.agencyId, force_login: 1 }
          );
        }}
        onSubmit={onSubmit}
        skeleton={skeleton}
        doPolicyCheck={doPolicyCheck} //TODO can we check this in the form?
        digitalCopyAccess={
          isDigitalCopy && !isPeriodicaLike && branch?.digitalCopyAccess
        }
        onClose={() => props.modal.prev()}
      />
    </>
  );
}
Wrap.propTypes = {
  context: PropTypes.object,
};
