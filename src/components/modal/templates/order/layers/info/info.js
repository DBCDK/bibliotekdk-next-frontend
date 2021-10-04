import { useRouter } from "next/router";
import merge from "lodash/merge";

import Link from "@/components/base/link";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Tag from "@/components/base/forms/tag";
import Email from "@/components/base/forms/email";
import Cover from "@/components/base/cover";
import Arrow from "@/components/base/animation/arrow";

import { useData } from "@/lib/api/api";

import useUser from "@/components/hooks/useUser";

import { branchOrderPolicy } from "@/lib/api/branches.fragments";

import animations from "@/components/base/animation/animations.module.css";

import styles from "./Info.module.css";

export function Info({
  material,
  user,
  authUser,
  className,
  onLayerSelect,
  pickupBranch,
  onMailChange,
  isVisible,
  isLoading,
  validated,
}) {
  const context = { context: "order" };

  const isLoadingBranches = isLoading || (user.name && !user?.agency);

  // Mateiral props
  const { title, creators, materialType, cover } = material;

  // user props
  const { userName, userMail, agency } = user;

  // Only show validation if user has already tried to submit order (but validation failed)
  const hasTry = validated?.hasTry;

  // Get email messages (from validate object)
  const emailStatus = validated?.details?.hasMail?.status;
  const errorMessage = validated?.details?.hasMail?.message;

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

  const orderNotPossibleMessage = {
    context: "order",
    label: "check-policy-fail",
  };

  const messageFromLibrary = {
    context: "order",
    label: "order-message-library",
  };

  const LibrarySelect = Translate({
    ...context,
    label: pickupBranch ? "change-pickup-link" : "pickup-link",
  });

  const LibrarySelectShort = Translate({
    context: "general",
    label: pickupBranch ? "change" : "select",
  });

  // Used to assess whether the email field should be locked or not
  const hasBorchk = pickupBranch?.borrowerCheck;

  // Email according to agency borrowerCheck (authUser.mail is from cicero and can not be changed)
  const email = hasBorchk ? authUser.mail : userMail;

  // info skeleton loading class
  const loadingClass = isLoadingBranches ? styles.skeleton : "";

  // Set email input message if any
  const message = (hasTry && errorMessage) || messageFromLibrary;

  // Email validation class'
  const validClass = hasTry && !emailStatus ? styles.invalid : styles.valid;
  const customInvalidClass = hasTry && !emailStatus ? styles.invalidInput : "";

  return (
    <div className={`${styles.info} ${loadingClass} ${className}`}>
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
            <Tag tag="span" skeleton={isLoading}>
              {materialType}
            </Tag>
            <Link onClick={() => onLayerSelect("edition")} disabled>
              <Text type="text3" skeleton={isLoading} lines={1}>
                {Translate({ ...context, label: "no-specific-edition" })}
              </Text>
            </Link>
          </div>
        </div>
        <div className={styles.right}>
          <Cover src={cover?.detail} size="thumbnail" skeleton={isLoading} />
        </div>
      </div>
      <div className={styles.pickup}>
        <div className={styles.title}>
          <Title type="title5">
            {Translate({ ...context, label: "pickup-title" })}
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
            onClick={() => !isLoadingBranches && onLayerSelect("pickup")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                !isLoadingBranches && onLayerSelect("pickup");
              }
            }}
          >
            <Link
              className={`${animations["on-focus"]}`}
              disabled={isLoadingBranches}
              onClick={(e) => e.preventDefault()}
              border={{ bottom: { keepVisible: !isLoadingBranches } }}
              tabIndex={isVisible ? "0" : "-1"}
            >
              <Text type="text3" className={styles.fullLink}>
                {LibrarySelect}
              </Text>
              <Text type="text3" className={styles.shortLink}>
                {LibrarySelectShort}
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
              <Text type="text3">{Translate(orderNotPossibleMessage)}</Text>
            </div>
          )}
      </div>
      {(isLoadingBranches || userName) && (
        <div className={styles.user}>
          <Title type="title5">
            {Translate({ ...context, label: "ordered-by" })}
          </Title>
          <div className={styles.name}>
            <Text type="text1" skeleton={isLoadingBranches} lines={1}>
              {userName}
            </Text>
          </div>
          <div className={styles.email}>
            <label htmlFor="order-user-email">
              <Text type="text1">
                {Translate({ context: "general", label: "email" })}
              </Text>
            </label>

            {(isLoadingBranches || (authUser?.mail && lockedMessage)) && (
              <div className={`${styles.emailMessage}`}>
                <Text type="text3" skeleton={isLoadingBranches} lines={1}>
                  {Translate(lockedMessage)}
                </Text>
              </div>
            )}
            <Email
              className={styles.input}
              placeholder={Translate({
                context: "form",
                label: "email-placeholder",
              })}
              invalidClass={customInvalidClass}
              required={true}
              disabled={isLoading || (authUser?.mail && hasBorchk)}
              tabIndex={isVisible ? "0" : "-1"}
              value={email || ""}
              id="order-user-email"
              onBlur={(value, valid) => onMailChange(value, valid)}
              onMount={(value, valid) => onMailChange(value, valid)}
              readOnly={isLoading || (authUser?.mail && hasBorchk)}
              skeleton={isLoadingBranches}
            />

            {message && (
              <div className={`${styles.emailMessage} ${validClass}`}>
                <Text type="text3">{Translate(message)}</Text>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  // Get query from props - fallback to url query
  const query = props.query || useRouter()?.query;

  // get pid/order from url
  const pid = query?.order;

  const { pickupBranch } = props;

  // authUser from useUser() is used if no authUser is found in props
  const { authUser } = useUser();

  // fetch orderPolicy if it doesnt exist
  const shouldFetchOrderPolicy =
    pid && pickupBranch?.branchId && !pickupBranch?.orderPolicy;

  // PolicyCheck in own request (sometimes slow)
  const { data: policyData, isLoading: policyIsLoading } = useData(
    shouldFetchOrderPolicy &&
      branchOrderPolicy({ branchId: pickupBranch?.branchId, pid })
  );

  // If found, merge orderPolicy into pickupBranch
  const orderPolicy = policyData?.branches?.result[0];
  const mergedData = orderPolicy && merge({}, pickupBranch, orderPolicy);

  return (
    <Info
      {...props}
      isLoading={props.isLoading || policyIsLoading}
      pickupBranch={mergedData || pickupBranch}
      authUser={props.authUser || authUser}
    />
  );
}
