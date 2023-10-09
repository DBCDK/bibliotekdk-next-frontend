import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Email from "@/components/base/forms/email";
import Input from "@/components/base/forms/input";
import Button from "@/components/base/button";
import Translate, { hasTranslation } from "@/components/base/translate";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";

import Top from "../base/top";

import styles from "./LoanerForm.module.css";
import { useData } from "@/lib/api/api";
import useUser from "@/components/hooks/useUser";
import * as branchesFragments from "@/lib/api/branches.fragments";
import { useModal } from "@/components/_modal";
import { openOrderModal } from "@/components/work/utils";
import { validateEmail } from "@/utils/validateEmail";
import { getLabel } from "@/components/base/forms/email/Email";
import Tooltip from "@/components/base/tooltip/Tooltip";

const ERRORS = {
  MISSING_INPUT: "error-missing-input",
};

export function UserParamsForm({
  branch,
  initial,
  onSubmit,
  originUrl,
  skeleton,
  storeLoanerInfo,
  setStoreLoanerInfo,
}) {
  const [errorCode, setErrorCode] = useState();
  const [state, setState] = useState(initial || {});
  const [validMail, setValidMail] = useState(true);

  const requiredParameters = branch?.userParameters?.filter(
    ({ parameterRequired }) => parameterRequired
  );

  const emailRequired =
    requiredParameters.filter((p) => p.userParameterType === "userMail")
      .length > 0;

  function validateState() {
    for (let i = 0; i < requiredParameters.length; i++) {
      const { userParameterType } = requiredParameters[i];
      if (!state[userParameterType]) {
        return ERRORS.MISSING_INPUT;
      }
    }
    if (emailRequired) {
      const validMail = validateEmail(state.userMail);
      setValidMail(validMail);
      const emailError = getLabel(state.userMail, validMail);
      if (emailError) {
        return emailError.label;
      }
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
          onSubmit(state, storeLoanerInfo);
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
      <span className={styles.checkBoxSpan}>
        <Checkbox
          checked={storeLoanerInfo}
          onChange={(checked) => setStoreLoanerInfo(checked)}
          id="loanerform-checkbox"
          ariaLabelledBy="loanerform-checkbox-label"
        />
        <Text
          tag="label"
          id="loanerform-checkbox-label"
          lines={1}
          skeleton={skeleton}
          type="text3"
          dataCy="loanerinfo-checkbox-label"
        >
          {Translate({ context: "order", label: "save-info-in-browser" })}
        </Text>
        <Tooltip labelToTranslate="close-window" placement="top" />
      </span>
      {/* onclick triggers submit form */}
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
 *  Shows login formular for FFU libraries without adgangsplatform login.
 * @param {Object} branch
 * @param {function} onSubmit
 * @param {Object} skeleton
 * @param {Object} initial
 * @param {Object} context
 * @param {boolean} storeLoanerInfo
 * @param {function} setStoreLoanerInfo
 * @returns JSX element
 */
export function LoanerForm({
  branch,
  onSubmit,
  skeleton,
  initial,
  // modal props
  context,
  storeLoanerInfo,
  setStoreLoanerInfo,
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

  return (
    <div className={styles.loanerform}>
      <Top />
      <Title type="title4" tag="h3">
        {Translate({
          context: "order",
          label: "order-to",
          vars: [branch.name],
        })}
      </Title>

      <UserParamsForm
        branch={branch}
        initial={initial}
        onSubmit={onSubmit}
        originUrl={originUrl}
        skeleton={skeleton}
        storeLoanerInfo={storeLoanerInfo}
        setStoreLoanerInfo={setStoreLoanerInfo}
      />
    </div>
  );
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
 * @returns {React.ReactElement | null}
 */
export default function Wrap(props) {
  const modal = useModal();
  const {
    branchId,
    //order modal props
    pids,
    selectedAccesses,
    workId,
    singleManifestation,
    //check if we open order new modal or we we go back to order modal
    changePickupBranch = false,
  } = props.context;
  const { data, isLoading: branchIsLoading } = useData(
    branchId && branchesFragments.branchUserParameters({ branchId })
  );

  const branch = data?.branches?.result?.[0];

  const { loanerInfo, updateLoanerInfo, deleteSessionData } = useUser();

  //remove userdata when modal is closed - if user doesnt want to store data
  useEffect(() => {
    if (modal?.isVisible === false) {
      deleteUserDataFromSession();
    }
  }, [modal?.isVisible]);

  //remove userdata when window is closed - if user doesnt want to store data
  useEffect(() => {
    window.addEventListener("beforeunload", deleteUserDataFromSession);
    return () => {
      window.removeEventListener("beforeunload", deleteUserDataFromSession);
    };
  }, [JSON.stringify(loanerInfo)]);

  /**
   * We remove session data for libraries without loanercheck
   * if user doesnt want to store data for next order.
   * This can be relevant on public computers, when user forgets to close the browser window
   * we dont do this for authenticated users,
   * because authenticated users have a logout button to remove session data.
   */
  function deleteUserDataFromSession() {
    if (!loanerInfo?.allowSessionStorage) {
      deleteSessionData();
    }
  }

  async function updateAllowSessionStorage(value) {
    await updateLoanerInfo({
      allowSessionStorage: value,
    });
  }

  async function onSubmit(info) {
    await updateLoanerInfo({
      userParameters: info,
      pickupBranch: branchId,
    });

    if (changePickupBranch) {
      props.modal.prev("order");
    } else {
      openOrderModal({
        modal,
        pids,
        selectedAccesses,
        workId,
        singleManifestation,
      });
    }
  }

  if (!branchId) {
    return null;
  }

  return (
    <>
      <LoanerForm
        {...props}
        branch={branch}
        initial={loanerInfo.userParameters}
        onSubmit={onSubmit}
        skeleton={branchIsLoading}
        onClose={() => props.modal.prev()}
        storeLoanerInfo={loanerInfo?.allowSessionStorage}
        setStoreLoanerInfo={updateAllowSessionStorage}
      />
    </>
  );
}
Wrap.propTypes = {
  context: PropTypes.object,
};
