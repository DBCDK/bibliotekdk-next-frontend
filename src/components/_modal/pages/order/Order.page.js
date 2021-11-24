import { useState, useEffect } from "react";

import filter from "lodash/filter";
import merge from "lodash/merge";

import { useData, useMutate } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import * as userFragments from "@/lib/api/user.fragments";
import {
  submitOrder,
  submitPeriodicaArticleOrder,
} from "@/lib/api/order.mutations";

import useUser from "@/components/hooks/useUser";

import Translate from "@/components/base/translate";

import Top from "../base/top";

import Button from "@/components/base/button";
import Link from "@/components/base/link";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Tag from "@/components/base/forms/tag";
import Email from "@/components/base/forms/email";
import Cover from "@/components/base/cover";
import Arrow from "@/components/base/animation/arrow";

import { branchOrderPolicy } from "@/lib/api/branches.fragments";

import animations from "@/components/base/animation/animations.module.css";

import data from "./dummy.data";

import styles from "./Order.module.css";
import { branchUserParameters } from "@/lib/api/branches.fragments";

/**
 *  Order component function
 *
 * @param {*} param0
 * @returns component
 */
export function Order({
  pid,
  work,
  user,
  initial = {},
  authUser,
  order,
  articleOrder,
  onArticleSubmit,
  onSubmit,
  updateLoanerInfo,
  isLoading = false,
  // new modal props
  context,
  modal,
}) {
  // Validation state
  const [validated, setValidated] = useState(null);

  // Selected pickup branch
  // If none selected, use first branch in the list
  const [pickupBranch, setPickupBranch] = useState(null);

  // Email state
  const [mail, setMail] = useState(null);

  // Sets if user has unsuccessfully tried to submit the order
  const [hasTry, setHasTry] = useState(false);

  useEffect(() => {
    if (initial.pickupBranch) {
      setPickupBranch(initial.pickupBranch);
    }
  }, [initial.pickupBranch]);

  // Update email from user account
  useEffect(() => {
    const userMail = user.userParameters?.userMail;

    if (userMail) {
      const message = null;

      setMail({
        value: userMail,
        valid: { status: true, message },
      });
    }
  }, [user?.userParameters]);

  // Update validation
  useEffect(() => {
    const hasMail = !!mail?.valid?.status;
    const hasBranchId = !!pickupBranch?.branchId;
    const hasPid = !!pid;

    const status = hasMail && hasBranchId && hasPid;
    const details = {
      hasMail: {
        status: hasMail,
        value: mail?.value,
        message: mail?.valid?.message,
      },
      hasBranchId: { status: hasBranchId },
      hasPid: { status: hasPid },
    };

    setValidated({ status, hasTry, details });
  }, [mail, pid, pickupBranch, hasTry]);

  // An order has successfully been submitted
  useEffect(() => {
    if (articleOrder?.data && articleOrder?.isLoading) {
      const index = modal.index();
      // debounce(() => , 100);
      modal.update(index, { articleOrder });
    } else if (order.data && order.isLoading) {
      const index = modal.index();
      // debounce(() => , 100);
      modal.update(index, { order });
    }
  }, [
    order.data,
    order.isLoading,
    articleOrder?.data,
    articleOrder?.isLoading,
  ]);

  const availableAsDigitalCopy =
    pickupBranch?.borrowerCheck &&
    pickupBranch?.digitalCopyAccess &&
    work?.manifestations?.find((m) =>
      m?.onlineAccess?.find((entry) => entry.issn)
    );

  const isArticle = work?.workTypes?.includes("article");

  /**
   *
   * @param {*} value
   * @param {*} valid
   */
  function onMailChange(value, valid) {
    valid &&
      updateLoanerInfo &&
      updateLoanerInfo({ userParameters: { userMail: value } });
    // update mail in state
    setMail({ value, valid });
  }

  // Work props
  const {
    cover: workCover,
    title: workTitle = "...",
    creators: workCreators = [{ name: "..." }],
    manifestations = [],
  } = work;
  // Material by pid
  const material = filter(
    manifestations,
    (manifestation) => manifestation.pid === pid
  )[0];

  // Same type materiel
  const materialsSameType = filter(
    manifestations,
    (m) => m?.materialType === material?.materialType && m?.admin?.requestButton
  );

  const isLoadingBranches = isLoading || (user.name && !user?.agency);
  // Material props
  const {
    title = workTitle,
    creators = workCreators,
    cover = workCover,
    materialType,
  } = material;

  // user props
  const { agency } = user;
  const { userName, userMail, userId, cpr, barcode, cardno, customId } =
    user?.userParameters || {};

  const libraryFallback = Translate({
    context: "general",
    label: "your-library",
  });

  // If user profile has an email, email field will be locked and this message shown
  const lockedMessage = {
    context: "order",
    label: "info-email-message",
    vars: [(agency?.result && agency.result?.[0]?.name) || libraryFallback],
  };

  const urlToEmailArticle = "/hjaelp/saadan-aendrer-du-din-mailadresse/68";

  // Used to assess whether the email field should be locked or not
  const hasBorchk = pickupBranch?.borrowerCheck;

  // Email according to agency borrowerCheck (authUser.mail is from cicero and can not be changed)
  let email = hasBorchk ? authUser.mail || userMail : userMail;

  const name = hasBorchk
    ? authUser.name
    : userName || customId || userId || cpr || cardno || barcode;

  // info skeleton loading class
  const loadingClass = isLoadingBranches ? styles.skeleton : "";

  // Get email messages (from validate object)
  const emailStatus = validated?.details?.hasMail?.status;
  const errorMessage = validated?.details?.hasMail?.message;

  // Set email input message if any
  const message = hasTry && errorMessage;

  // Email validation class'
  const validClass = hasTry && !emailStatus ? styles.invalid : styles.valid;
  const customInvalidClass = hasTry && !emailStatus ? styles.invalidInput : "";

  // Check for email validation and email error messages
  const hasEmail = !!validated?.details?.hasMail?.status;

  const actionMessage =
    hasTry && !hasEmail && validated?.details?.hasMail?.message;

  const invalidClass = actionMessage ? styles.invalid : "";

  return (
    <div className={`${styles.order} ${loadingClass}`}>
      <Top
        title={context.title}
        className={{
          top: styles.top,
        }}
      />
      <div className={styles.edition}>
        <div className={styles.left}>
          <div className={styles.title}>
            <Text type="text1" skeleton={isLoading} lines={1}>
              {title}
            </Text>
          </div>
          <div className={styles.creators}>
            <Text type="text3" skeleton={isLoading} lines={1}>
              {creators.map((c, i) =>
                creators.length > i + 1 ? c.name + ", " : c.name
              )}
            </Text>
          </div>
          <div className={styles.material}>
            {!isArticle && (
              <Link onClick={() => {}} disabled>
                <Text type="text3" skeleton={isLoading} lines={1} clamp>
                  {Translate({
                    context: "order",
                    label: "no-specific-edition",
                  })}
                </Text>
              </Link>
            )}

            <div>
              <Tag tag="span" skeleton={isLoading}>
                {materialType}
              </Tag>
            </div>
          </div>
          {availableAsDigitalCopy && (
            <div className={styles.digitalcopy}>
              <Text type="text4">
                {Translate({
                  context: "order",
                  label: "will-order-digital-copy",
                })}
              </Text>

              <Link
                disabled={false}
                href={"/hjaelp/digital-artikelservice/70"}
                border={{ top: false, bottom: { keepVisible: true } }}
              >
                <Text type="text3">
                  {Translate({
                    context: "order",
                    label: "will-order-digital-copy-delivered-by",
                  })}
                </Text>
              </Link>
            </div>
          )}
        </div>
        <div className={styles.right}>
          <Cover src={cover?.detail} size="thumbnail" skeleton={isLoading} />
        </div>
      </div>
      <div className={styles.pickup}>
        <div className={styles.title}>
          <Title type="title5">
            {Translate({
              context: "order",
              label: availableAsDigitalCopy
                ? "pickup-title-digital-copy"
                : "pickup-title",
            })}
          </Title>
        </div>
        <div className={styles.library}>
          {(isLoadingBranches || pickupBranch) && (
            <Text type="text1" skeleton={isLoadingBranches} lines={1}>
              {pickupBranch?.name}
            </Text>
          )}
          <div
            className={`${styles.link} ${animations["on-hover"]} `}
            onClick={() => {
              !isLoadingBranches &&
                modal.push("pickup", {
                  pid,
                  initial: { agency },
                });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                !isLoadingBranches &&
                  modal.push("pickup", {
                    pid,
                    initial: { agency },
                  });
              }
            }}
          >
            <Link
              className={`${animations["on-focus"]}`}
              disabled={isLoadingBranches}
              onClick={(e) => e.preventDefault()}
              border={{ bottom: { keepVisible: !isLoadingBranches } }}
            >
              <Text type="text3" className={styles.fullLink}>
                {Translate({
                  context: "order",
                  label: availableAsDigitalCopy
                    ? "change-pickup-digital-copy-link"
                    : pickupBranch
                    ? "change-pickup-link"
                    : "pickup-link",
                })}
              </Text>
              <Text type="text3" className={styles.shortLink}>
                {Translate({
                  context: "general",
                  label: pickupBranch ? "change" : "select",
                })}
              </Text>
            </Link>
            <Arrow
              className={`${styles.arrow} ${animations["h-bounce-right"]} ${animations["f-bounce-right"]}`}
            />
          </div>
        </div>

        {(isLoadingBranches || pickupBranch) && (
          <div className={styles.address}>
            <Text type="text3" skeleton={isLoadingBranches} lines={2}>
              {pickupBranch?.postalAddress}
            </Text>
            <Text
              type="text3"
              skeleton={isLoadingBranches}
              lines={0}
            >{`${pickupBranch?.postalCode} ${pickupBranch?.city}`}</Text>
          </div>
        )}
        {!isLoadingBranches &&
          pickupBranch &&
          (!pickupBranch?.pickupAllowed ||
            !pickupBranch?.orderPolicy?.orderPossible) && (
            <div className={`${styles["invalid-pickup"]} ${styles.invalid}`}>
              <Text type="text3">
                {Translate({
                  context: "order",
                  label: "check-policy-fail",
                })}
              </Text>
            </div>
          )}
      </div>
      {(isLoadingBranches || name) && (
        <div className={styles.user}>
          <Title type="title5">
            {Translate({ context: "order", label: "ordered-by" })}
          </Title>
          <div className={styles.name}>
            <Text type="text1" skeleton={isLoadingBranches} lines={1}>
              {name}
            </Text>
          </div>
          <div className={styles.email}>
            <label htmlFor="order-user-email">
              <Text type="text1">
                {Translate({ context: "general", label: "email" })}
              </Text>
            </label>

            <Email
              className={styles.input}
              placeholder={Translate({
                context: "form",
                label: "email-placeholder",
              })}
              invalidClass={customInvalidClass}
              required={true}
              disabled={isLoading || (authUser?.mail && hasBorchk)}
              value={email || ""}
              id="order-user-email"
              // onMount updates email error message (missing email error)
              onMount={(value, valid) => setMail({ value, valid })}
              onBlur={(value, valid) => onMailChange(value, valid)}
              readOnly={isLoading || (authUser?.mail && hasBorchk)}
              skeleton={isLoadingBranches}
            />
            {(isLoadingBranches ||
              (authUser?.mail &&
                lockedMessage &&
                pickupBranch?.borrowerCheck)) && (
              <div className={`${styles.emailMessage}`}>
                <Text
                  type="text3"
                  skeleton={isLoadingBranches}
                  lines={1}
                  tag="span"
                  className={styles.userStatusLink}
                >
                  {Translate(lockedMessage)}
                  &nbsp;
                </Text>
                <Link
                  disabled={isLoadingBranches}
                  href={urlToEmailArticle}
                  border={{ top: false, bottom: { keepVisible: true } }}
                >
                  <Text
                    type="text3"
                    skeleton={isLoadingBranches}
                    lines={1}
                    tag="span"
                    className={styles.userStatusLink}
                  >
                    {Translate({
                      context: "order",
                      label: "change-email-link",
                    })}
                  </Text>
                </Link>
              </div>
            )}

            {message && (
              <div className={`${styles.emailMessage} ${validClass}`}>
                <Text type="text3">{Translate(message)}</Text>
              </div>
            )}
          </div>
        </div>
      )}
      <div className={styles.action}>
        <div className={`${styles.message} ${invalidClass}`}>
          <Text type="text3">
            {Translate({
              context: "order",
              label: actionMessage
                ? `action-${actionMessage.label}`
                : availableAsDigitalCopy
                ? "will-order-digital-copy-details"
                : "order-message-library",
            })}
          </Text>
        </div>
        <Button
          disabled={pickupBranch?.orderPolicy?.orderPossible !== true}
          skeleton={isLoading}
          onClick={() => {
            if (validated.status) {
              modal.push("receipt", {
                pid,
                order: {
                  data: order.data,
                  error: order.error,
                  isLoading: order.isLoading,
                },
                articleOrder: {
                  data: articleOrder?.data,
                  error: articleOrder?.error,
                  isLoading: articleOrder?.isLoading,
                },
                pickupBranch,
              });
              if (availableAsDigitalCopy) {
                onArticleSubmit(pid, pickupBranch.branchId);
              } else {
                onSubmit &&
                  onSubmit(
                    materialsSameType.map((m) => m.pid),
                    pickupBranch
                  );
              }
            } else {
              setHasTry(true);
            }
          }}
        >
          {Translate({ context: "general", label: "accept" })}
        </Button>
      </div>
    </div>
  );
}

export function OrderSkeleton(props) {
  const { work, user, order } = data;

  return (
    <Order
      pid="some-pid"
      work={work}
      user={user}
      order={order}
      articleOrder={order}
      context={{ label: "title-order" }}
      modal={{}}
      className={`${props.className} ${styles.skeleton}`}
      isLoading={true}
    />
  );
}

/**
 * Wrap is a react component responsible for loading
 * data and displaying the right variant of the component
 *
 * @param {Object} props Component props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  // context
  const { context } = props;

  // internal pid state -> used to reset modal
  const [pid, setPid] = useState(null);

  const orderMutation = useMutate();
  const articleOrderMutation = useMutate();

  /**
   * Order
   */
  useEffect(() => {
    if (context.pid) {
      // When order modal opens, we reset previous order status
      // making it possible to order a manifestation multiple times
      orderMutation.reset();
      setPid(context.pid);
    }
  }, [context.pid]);

  /**
   * Work data
   */
  const { data, isLoading, isSlow, error } = useData(
    workFragments.detailsAllManifestations({ workId: context.workId })
  );

  const covers = useData(workFragments.covers({ workId: context.workId }));

  const mergedWork = merge({}, covers.data, data);

  /**
   * User
   */
  const { authUser, loanerInfo, updateLoanerInfo } = useUser();

  /**
   * Branches, details, policies, and userParams
   */

  // Fetch branches and order policies for (loggedIn) user
  const {
    data: orderPolicy,
    isLoading: policyIsLoading,
    error: orderPolicyError,
  } = useData(pid && authUser.name && userFragments.orderPolicy({ pid }));

  // scope
  const defaultUserPickupBranch = orderPolicy?.user?.agency?.result[0];

  // fetch user parameters for the selected pickup
  // OBS! Pickup can differs from users own branches.
  const { data: userParams, isLoading: userParamsIsLoading } = useData(
    loanerInfo?.pickupBranch &&
      branchUserParameters({ branchId: loanerInfo.pickupBranch })
  );

  // scope
  const selectedBranch = userParams?.branches?.result?.[0];

  // Fetch order policies for selected pickupBranch (if pickupBranch differes from user agency branches)
  // check if orderpolicy already exist for selected pickupbranch
  const shouldFetchOrderPolicy =
    pid && selectedBranch?.branchId && !selectedBranch?.orderPolicy;

  // Fetch Orderpolicy for selected branch, if not already exist
  const { data: selectedBranchPolicyData, isLoading: branchPolicyIsLoading } =
    useData(
      shouldFetchOrderPolicy &&
        branchOrderPolicy({ branchId: selectedBranch?.branchId, pid })
    );

  // scope
  const pickupBranchOrderPolicy =
    selectedBranchPolicyData?.branches?.result?.[0];

  // If found, merge fetched orderPolicy into pickupBranch
  const mergedSelectedBranch =
    pickupBranchOrderPolicy &&
    merge({}, selectedBranch, pickupBranchOrderPolicy);

  // Merge user and branches
  const mergedUser = merge({}, loanerInfo, orderPolicy?.user);

  if (isLoading) {
    return <OrderSkeleton isSlow={isSlow} />;
  }

  if (error) {
    return <div>Error :( !!!!!</div>;
  }

  return (
    <Order
      work={mergedWork?.work}
      authUser={authUser}
      user={(!userParamsIsLoading && mergedUser) || {}}
      initial={{
        pickupBranch:
          mergedSelectedBranch ||
          selectedBranch ||
          defaultUserPickupBranch ||
          null,
      }}
      isLoading={
        isLoading ||
        policyIsLoading ||
        userParamsIsLoading ||
        branchPolicyIsLoading
      }
      pid={context.pid}
      order={orderMutation}
      articleOrder={articleOrderMutation}
      updateLoanerInfo={updateLoanerInfo}
      onArticleSubmit={(pid, pickUpBranch) => {
        articleOrderMutation.post(
          submitPeriodicaArticleOrder({
            pid,
            pickUpBranch,
            userName: loanerInfo?.userParameters?.userName,
            userMail: loanerInfo?.userParameters?.userMail,
          })
        );
      }}
      onSubmit={(pids, pickupBranch) => {
        orderMutation.post(
          submitOrder({
            pids,
            branchId: pickupBranch.branchId,
            userParameters: loanerInfo.userParameters,
          })
        );
      }}
      {...props}
    />
  );
}
