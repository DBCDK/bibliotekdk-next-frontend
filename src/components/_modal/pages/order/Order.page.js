import { useState, useEffect, useMemo } from "react";

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
import { getIsPeriodicaLike } from "@/lib/utils";
import TjoolTjip from "@/components/base/tjooltjip";
import { LOGIN_MODE } from "@/components/_modal/pages/loanerform/LoanerForm";

function LinkArrow({ onClick, disabled, children, className = "" }) {
  return (
    <div
      className={`${styles.link} ${animations["on-hover"]} ${className}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          onClick(e);
        }
      }}
    >
      <Link
        className={`${animations["on-focus"]}`}
        disabled={disabled}
        onClick={(e) => e.preventDefault()}
        border={{ bottom: { keepVisible: !disabled } }}
      >
        {children}
      </Link>
      <Arrow
        className={`${styles.arrow} ${animations["h-bounce-right"]} ${animations["f-bounce-right"]}`}
      />
    </div>
  );
}

export function Edition({
  isLoading,
  work = {},
  singleManifestation = false,
  isArticle = false,
  isPeriodicaLike = false,
  availableAsDigitalCopy = false,
  isArticleRequest = false,
  context,
  material = {},
  showOrderTxt = true,
  modal = {},
}) {
  const {
    cover: workCover,
    title: workTitle = "...",
    creators: workCreators = [{ name: "..." }],
    manifestations = [],
  } = work;

  const {
    title = workTitle,
    creators = workCreators,
    cover = workCover,
    materialType,
  } = material;

  return (
    <div className={styles.edition}>
      <div className={styles.left}>
        <div className={styles.title}>
          <Text type="text1" skeleton={isLoading} lines={1}>
            {work?.fullTitle}
          </Text>
        </div>
        <div className={styles.creators}>
          <Text type="text3" skeleton={isLoading} lines={1}>
            {creators.map((c, i) =>
              creators.length > i + 1 ? c.name + ", " : c.name
            )}
          </Text>
        </div>
        {singleManifestation && (
          <div>
            <Text
              type="text3"
              skeleton={isLoading}
              lines={1}
              dataCy="additional_edition_info"
            >
              {material.datePublished},&nbsp;
              {material.publisher &&
                material.publisher.map((pub, index) => pub)}
              &nbsp;
              {material.edition && "," + material.edition}
            </Text>
          </div>
        )}
        <div className={styles.material}>
          {!isArticle &&
            !isPeriodicaLike &&
            !singleManifestation &&
            showOrderTxt && (
              <Link onClick={() => {}} disabled>
                <Text type="text3" skeleton={isLoading} lines={1} clamp>
                  {Translate({
                    context: "order",
                    label: "no-specific-edition",
                  })}
                </Text>
              </Link>
            )}
          {singleManifestation && showOrderTxt && (
            <Link onClick={() => {}} disabled>
              <Text type="text3" skeleton={isLoading} lines={1} clamp>
                {Translate({
                  context: "order",
                  label: "specific-edition",
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
        {availableAsDigitalCopy ? (
          <div className={styles.articletype}>
            <Text type="text4">
              {Translate({
                context: "order",
                label: "will-order-digital-copy",
              })}
            </Text>
          </div>
        ) : isArticleRequest ? (
          <div className={styles.articletype}>
            <Text type="text4">
              {Translate({
                context: "general",
                label: "article",
              })}
            </Text>
          </div>
        ) : context?.periodicaForm ? (
          <div className={styles.articletype}>
            <Text type="text4">
              {Translate({
                context: "general",
                label: "volume",
              })}
            </Text>
          </div>
        ) : null}
        {context?.periodicaForm && (
          <div className={styles.periodicasummary}>
            {Object.entries(context?.periodicaForm).map(([key, value]) => (
              <Text type="text3" key={key}>
                {Translate({
                  context: "order-periodica",
                  label: `label-${key}`,
                })}
                : {value}
              </Text>
            ))}
          </div>
        )}
        {isPeriodicaLike && (
          <LinkArrow
            onClick={() => {
              modal.push("periodicaform", {
                periodicaForm: context?.periodicaForm,
              });
            }}
            disabled={false}
            className={styles.periodicaformlink}
          >
            <Text type="text3">
              {Translate({
                context: "order-periodica",
                label: "title",
              })}
            </Text>
          </LinkArrow>
        )}
      </div>
      <div className={styles.right}>
        <Cover src={cover?.detail} size="thumbnail" skeleton={isLoading} />
      </div>
    </div>
  );
}

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
  isAuthenticated,
  order,
  articleOrder,
  onArticleSubmit,
  onSubmit,
  updateLoanerInfo,
  isLoading = false,
  // new modal props
  context,
  modal,
  singleManifestation = false,
}) {
  // Selected pickup branch
  // If none selected, use first branch in the list
  const [pickupBranch, setPickupBranch] = useState(null);

  // Email state
  let [mail, setMail] = useState(null);

  // Sets if user has unsuccessfully tried to submit the order
  const [hasTry, setHasTry] = useState(false);

  const isArticle = work?.workTypes?.includes("article");
  const isPeriodicaLike = getIsPeriodicaLike(work);

  const isArticleRequest =
    !!context?.periodicaForm?.titleOfComponent ||
    !!context?.periodicaForm?.authorOfComponent ||
    !!context?.periodicaForm?.pagination;

  const isPhysical = !!work?.manifestations?.find(
    (m) => m?.admin?.requestButton
  );
  const isDigitalCopy = !!work?.manifestations?.find((m) =>
    m?.onlineAccess?.find((entry) => entry.issn)
  );

  const availableAsPhysicalCopy =
    pickupBranch?.pickupAllowed &&
    pickupBranch?.orderPolicy?.orderPossible &&
    isPhysical;

  const availableAsDigitalCopy =
    pickupBranch?.digitalCopyAccess &&
    isDigitalCopy &&
    (isPeriodicaLike ? isArticleRequest : true);

  const requireDigitalAccess = isDigitalCopy && !isPhysical;
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
      updateLoanerInfo({ userParameters: { userMail: userMail } });
      setMail({
        value: userMail,
        valid: { status: true, message },
      });
    }
  }, [user?.userParameters]);

  const validated = useMemo(() => {
    const hasMail = !!mail?.valid?.status;
    const hasBranchId = !!pickupBranch?.branchId;
    const hasPid = !!pid;
    const requireYear = !!isPeriodicaLike;
    const hasYear = !!context?.periodicaForm?.publicationDateOfComponent;

    const status =
      hasMail && hasBranchId && hasPid && (requireYear ? hasYear : true);

    const details = {
      hasMail: {
        status: hasMail,
        value: mail?.value,
        message: mail?.valid?.message,
      },
      hasBranchId: { status: hasBranchId },
      hasPid: { status: hasPid },
      requireYear: {
        status: hasYear,
        message: requireYear && !hasYear && { label: "require-year" },
      },
    };

    return { status, hasTry, details };
  }, [
    mail,
    pid,
    pickupBranch,
    hasTry,
    context?.periodicaForm?.publicationDateOfComponent,
  ]);

  // An order has successfully been submitted
  useEffect(() => {
    if (modal && modal.isVisible) {
      // call update if data or isLoading is changed
      if (articleOrder?.isLoading || articleOrder?.data) {
        const index = modal.index();
        modal.update(index, { articleOrder });
      } else if (order.isLoading || order.data) {
        const index = modal.index();
        modal.update(index, { order });
      }
    }
  }, [
    order.data,
    order.isLoading,
    articleOrder?.data,
    articleOrder?.isLoading,
  ]);

  /**
   *
   * @param {*} value
   * @param {*} valid
   */
  function onMailChange(value, valid) {
    valid.status &&
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

  let orderPids;
  if (singleManifestation) {
    orderPids = [pid];
  } else {
    orderPids = materialsSameType.map((m) => m.pid);
  }

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
    vars: [agency?.result?.[0]?.agencyName || libraryFallback],
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
    hasTry &&
    (validated?.details?.requireYear?.message ||
      (!hasEmail && validated?.details?.hasMail?.message));

  const invalidClass = actionMessage ? styles.invalid : "";

  return (
    <div className={`${styles.order} ${loadingClass}`}>
      <Top
        title={context?.title}
        className={{
          top: styles.top,
        }}
      />

      <Edition
        isLoading={isLoading}
        work={work}
        singleManifestation={singleManifestation}
        isArticle={isArticle}
        isPeriodicaLike={isPeriodicaLike}
        availableAsDigitalCopy={availableAsDigitalCopy}
        isArticleRequest={isArticleRequest}
        context={context}
        material={material}
        modal={modal}
      />

      <div className={styles.pickup}>
        <div className={styles.title}>
          <Title type="title5">
            {Translate({
              context: "order",
              label:
                availableAsDigitalCopy || (!isAuthenticated && isDigitalCopy)
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
          <LinkArrow
            onClick={() => {
              !isLoadingBranches &&
                modal.push("pickup", {
                  pid,
                  initial: { agency },
                  requireDigitalAccess,
                  mode: isDigitalCopy
                    ? LOGIN_MODE.SUBSCRIPTION
                    : LOGIN_MODE.ORDER_PHYSICAL,
                });
            }}
            disabled={isLoadingBranches}
          >
            <Text type="text3" className={styles.fullLink}>
              {Translate({
                context: "order",
                label:
                  availableAsDigitalCopy || (!isAuthenticated && isDigitalCopy)
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
          </LinkArrow>
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
          !availableAsPhysicalCopy &&
          !availableAsDigitalCopy && (
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
              <Text type="text1" className={styles.textinline}>
                {Translate({ context: "general", label: "email" })}
              </Text>
              {(isLoadingBranches ||
                (authUser?.mail &&
                  lockedMessage &&
                  pickupBranch?.borrowerCheck)) && (
                <TjoolTjip
                  placement="right"
                  labelToTranslate="tooltip_change_email"
                  customClass={styles.tooltip}
                />
              )}
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
              onMount={(e, valid) =>
                setMail({ value: e?.target?.value, valid })
              }
              onBlur={(e, valid) => onMailChange(e?.target?.value, valid)}
              readOnly={isLoading || (authUser?.mail && hasBorchk)}
              skeleton={isLoadingBranches}
            />

            {message && (
              <div className={`${styles.emailMessage} ${validClass}`}>
                <Text type="text3">{Translate(message)}</Text>
              </div>
            )}
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
              </div>
            )}
          </div>
        </div>
      )}
      <div className={styles.action}>
        <div className={`${styles.message} ${invalidClass}`}>
          {actionMessage ? (
            <Text type="text3">
              {Translate({
                context: "order",
                label: `action-${actionMessage.label}`,
              })}
            </Text>
          ) : availableAsDigitalCopy ? (
            <Link
              target="_blank"
              disabled={false}
              href={"/hjaelp/digital-artikelservice/84"}
              border={{ top: false, bottom: { keepVisible: true } }}
            >
              <Text type="text3">
                {Translate({
                  context: "order",
                  label: "will-order-digital-copy-delivered-by",
                })}
              </Text>
            </Link>
          ) : (
            <Text type="text3">
              {Translate({
                context: "order",
                label: "order-message-library",
              })}
            </Text>
          )}
        </div>
        <Button
          disabled={!availableAsDigitalCopy && !availableAsPhysicalCopy}
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
                onArticleSubmit(
                  pid,
                  pickupBranch.branchId,
                  context?.periodicaForm
                );
              } else {
                onSubmit &&
                  onSubmit(orderPids, pickupBranch, context?.periodicaForm);
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
      articleOrderMutation.reset();
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
  const {
    authUser,
    loanerInfo,
    updateLoanerInfo,
    isAuthenticated,
    isGuestUser,
  } = useUser();

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

  if (isLoading || covers.isLoading) {
    return <OrderSkeleton isSlow={isSlow} />;
  }

  if (error || !mergedWork?.work) {
    return <div>Error :( !!!!!</div>;
  }

  return (
    <Order
      work={mergedWork?.work}
      authUser={authUser}
      isAuthenticated={isAuthenticated || isGuestUser}
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
      onArticleSubmit={(pid, pickUpBranch, periodicaForm = {}) => {
        articleOrderMutation.post(
          submitPeriodicaArticleOrder({
            pid,
            pickUpBranch,
            userName: loanerInfo?.userParameters?.userName,
            userMail: loanerInfo?.userParameters?.userMail,
            ...periodicaForm,
          })
        );
      }}
      onSubmit={(pids, pickupBranch, periodicaForm = {}) => {
        orderMutation.post(
          submitOrder({
            pids,
            branchId: pickupBranch.branchId,
            userParameters: loanerInfo.userParameters,
            ...periodicaForm,
          })
        );
      }}
      singleManifestation={
        context.orderType && context.orderType === "singleManifestation"
      }
      {...props}
    />
  );
}
