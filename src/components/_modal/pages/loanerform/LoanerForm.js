import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import merge from "lodash/merge";

import { signIn } from "next-auth/client";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Email from "@/components/base/forms/email";
import Input from "@/components/base/forms/input";
import Button from "@/components/base/button";
import Translate, { hasTranslation } from "@/components/base/translate";

import Top from "../base/top";

import styles from "./LoanerForm.module.css";
import { useData } from "@/lib/api/api";
import {
  branchUserParameters,
  branchOrderPolicy,
} from "@/lib/api/branches.fragments";
import useUser, { useAccessToken } from "@/components/hooks/useUser";
import { branchesForUser } from "@/lib/api/user.fragments";

const ERRORS = {
  MISSING_INPUT: "error-missing-input",
};

export function UserParamsForm({ branch, initial, onSubmit }) {
  function validateState() {
    for (let i = 0; i < requiredParameters.length; i++) {
      const { userParameterType } = requiredParameters[i];

      if (!state[userParameterType]) {
        return ERRORS.MISSING_INPUT;
      }
      if (emailMessage) {
        return emailMessage.label;
      }
    }
  }

  const [errorCode, setErrorCode] = useState();
  const [state, setState] = useState(initial || {});
  const [emailMessage, setEmailMessage] = useState();

  const requiredParameters = branch?.userParameters?.filter(
    ({ parameterRequired }) => parameterRequired
  );

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
          label: "order-to-description",
        })}
      </Text>
      <Title type="title4" tag="h4">
        {Translate({
          context: "order",
          label: "order-to-loaner-info",
        })}
      </Title>
      <div className={styles.fields}>
        {requiredParameters?.map(({ userParameterType, description }, idx) => {
          const labelTranslation = {
            context: "form",
            label: `${userParameterType}-label`,
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
            <div key={idx}>
              <Text type="text1" tag="label">
                {description ||
                  (hasTranslation(labelTranslation)
                    ? Translate(labelTranslation)
                    : userParameterType)}
              </Text>
              {userParameterType === "userMail" ? (
                <Email
                  value={state.userMail || ""}
                  onChange={(value, { message }) => {
                    setState({
                      ...state,
                      [userParameterType]: value,
                    });
                    setEmailMessage(message);
                  }}
                  dataCy={`input-${userParameterType}`}
                  placeholder={
                    hasTranslation(placeholderTranslation)
                      ? Translate(placeholderTranslation)
                      : ""
                  }
                  required
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
                  onChange={(value) =>
                    setState({
                      ...state,
                      [userParameterType]: value,
                    })
                  }
                  placeholder={
                    description ||
                    (hasTranslation(placeholderTranslation)
                      ? Translate(placeholderTranslation)
                      : "")
                  }
                  required
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
          context: "header",
          label: "login",
        })}
      </Button>
    </form>
  );
}

/**
 * Will show either a signin button if the provided branch supports
 * borrowerCheck (supports login.bib.dk), and otherwise a loaner formular.
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function LoanerForm({
  branch,
  onSubmit,
  onLogin,
  submitting,
  skeleton,
  initial,
  isVisible,
  onClose,
  doPolicyCheck,
  // modal props
  context,
  modal,
}) {
  const [allowSave, setAllowSave] = useState(!!initial);

  if (skeleton) {
    return (
      <div className={styles.loanerform}>
        <Top.Default />
        <Title type="title4" tag="h3" skeleton={!branch?.name}>
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

  // Order possible for branch
  const orderPossible =
    doPolicyCheck !== false ? branch.orderPolicy?.orderPossible : true;

  return (
    <div className={styles.loanerform}>
      <Top.Default />
      <Title type="title4" tag="h3">
        {Translate({
          context: "order",
          label: "order-to",
          vars: [branch.name],
        })}
      </Title>

      {!orderPossible && (
        <>
          <Text type="text2">
            {Translate({
              context: "order",
              label: "order-not-possible",
            })}
          </Text>
          <Button
            onClick={onClose}
            className={styles.loginbutton}
            disabled={!!submitting}
          >
            {Translate({
              context: "general",
              label: "select-another-library",
            })}
          </Button>
        </>
      )}

      {orderPossible && branch.borrowerCheck && (
        <>
          <Text type="text2">
            {Translate({
              context: "order",
              label: "order-login-required",
              vars: [branch.agencyName],
            })}
          </Text>
          <Button
            onClick={onLogin}
            className={styles.loginbutton}
            disabled={!!submitting}
            tabIndex="0"
          >
            {Translate({
              context: "header",
              label: "login",
            })}
          </Button>
        </>
      )}

      {orderPossible && !branch.borrowerCheck && (
        <UserParamsForm branch={branch} initial={initial} onSubmit={onSubmit} />
      )}
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
 * @returns {component}
 */
export default function Wrap(props) {
  const { onSubmit, branchId, pid, callbackUrl, doPolicyCheck } = props.context;

  // Branch userparams fetch (Fast)
  const { data, isLoading: branchIsLoading } = useData(
    branchId && branchUserParameters({ branchId })
  );

  // PolicyCheck in own request (sometimes slow)
  const { data: policyData, isLoading: policyIsLoading } = useData(
    pid && branchId && branchOrderPolicy({ branchId, pid })
  );
  const mergedData = merge({}, data, policyData);

  const { isAuthenticated } = useUser();
  const accessToken = useAccessToken();

  const { loanerInfo, updateLoanerInfo } = useUser();

  // User branches fetch
  const { data: userData, isLoading: userIsLoading } = useData(
    isAuthenticated && branchesForUser()
  );

  const loggedInAgencyId = userData?.user?.agency?.result?.[0]?.agencyId;
  const branch = mergedData?.branches?.result?.[0];
  const skeleton = branchId && (userIsLoading || branchIsLoading);

  // When beginLogout is true, we mount the iframe
  // that logs out the user
  const [beginLogout, setBeginLogout] = useState(false);

  // When loggedOut is true, we redirect to the signIn page
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    if (loggedOut && branch?.agencyId) {
      signIn(
        "adgangsplatformen",
        { callbackUrl },
        { agency: branch?.agencyId }
      );
    }
  }, [loggedOut]);

  if (!branchId) {
    return null;
  }

  return (
    <>
      {beginLogout && (
        // Iframe hack - for logging out
        // When iframe is done loading, the user is assumed to be logged out
        // Remove this, when its possible to log in via an agency without logging out first
        <iframe
          style={{ display: "none" }}
          onLoad={() => setLoggedOut(true)}
          src={`https://login.bib.dk/logout?access_token=${accessToken}`}
        />
      )}
      {loggedInAgencyId && loggedInAgencyId === branch?.agencyId ? (
        <Text>User already logged in at {branch.agencyName}</Text>
      ) : (
        <LoanerForm
          {...props}
          branch={branch}
          initial={loanerInfo.userParameters}
          onLogin={() => {
            setBeginLogout(true);
          }}
          onSubmit={async (info) => {
            await updateLoanerInfo({
              userParameters: info,
              pickupBranch: branch.branchId,
            });

            // Back to order
            await modal.prev("order");
          }}
          submitting={beginLogout || loggedOut}
          skeleton={skeleton}
          doPolicyCheck={doPolicyCheck}
        />
      )}
    </>
  );
}
Wrap.propTypes = {
  context: { callbackUrl: PropTypes.string },
};
