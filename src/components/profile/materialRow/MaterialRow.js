import Cover from "@/components/base/cover";
import Button from "@/components/base/button";
import Text from "@/components/base/text";
import styles from "./MaterialRow.module.css";
import Title from "@/components/base/title";
import Checkbox from "@/components/base/forms/checkbox";
import ConditionalWrapper from "@/components/base/conditionalwrapper";
import Link from "@/components/base/link";
import cx from "classnames";
import { useEffect, useState } from "react";
import { useMutate } from "@/lib/api/api";
import PropTypes from "prop-types";
import Icon from "@/components/base/icon";
import IconButton from "@/components/base/iconButton";
import { getWorkUrl } from "@/lib/utils";
import ErrorRow from "../errorRow/ErrorRow";

import useBreakpoint from "@/components/hooks/useBreakpoint";
import { useModal } from "@/components/_modal";
import useUser from "@/components/hooks/useUser";
import Translate from "@/components/base/translate";
import {
  dateToDayInMonth,
  timestampToShortDate,
} from "@/utils/datetimeConverter";
import { useRouter } from "next/router";
import { onClickDelete } from "@/components/_modal/pages/deleteOrder/utils";
import { update } from "lodash";

// Set to when warning should be shown
export const DAYS_TO_COUNTDOWN_RED = 5;

export const useLoanDateAnalysis = (dueDateString) => {
  const router = useRouter();
  const locale = router.locale === undefined ? "da" : router.locale;
  const timeFormatter = new Intl.RelativeTimeFormat(locale, { style: "short" });

  const dueDate = new Date(dueDateString);
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + DAYS_TO_COUNTDOWN_RED);
  const daysToDueDate =
    Math.floor((dueDate - today) / (1000 * 60 * 60 * 24)) + 1; // Add 1 so due date today is "in 1 day"

  return {
    dayToText: timeFormatter.format(daysToDueDate, "day"),
    isCountdown: dueDate >= today && dueDate <= futureDate,
    isOverdue: dueDate < today,
    dateString: timestampToShortDate(dueDate),
    daysToDueDate: Math.floor((dueDate - today) / (1000 * 60 * 60 * 24)) + 1, // Add 1 so due date today is "in 1 day"
    daysToDueDateString: `${daysToDueDate} ${
      daysToDueDate === 1
        ? Translate({ context: "units", label: "day" })
        : Translate({ context: "units", label: "days" })
    }`,
  };
};

export const MaterialRowButton = ({
  wrapperClassname,
  size = "small",
  type = "primary",
  ...props
}) => {
  return (
    <div className={cx(styles.buttonContainer, wrapperClassname)}>
      <Button type={type} size={size} {...props} />
    </div>
  );
};

export const MaterialRowIconButton = ({ wrapperClassname, ...props }) => {
  return (
    <div className={cx(wrapperClassname, styles.buttonContainer)}>
      <IconButton {...props} />
    </div>
  );
};

const DynamicColumnDebt = ({ amount, currency }) => (
  <DynamicColumn className={styles.isWarning}>
    <Text type="text1" tag="span">
      {amount} {currency}
    </Text>
  </DynamicColumn>
);

export const DynamicColumnLoan = ({ dueDateString }) => {
  const { isCountdown, isOverdue, dateString, daysToDueDateString } =
    useLoanDateAnalysis(dueDateString);

  return (
    <DynamicColumn>
      <Text type="text2" tag="p">
        <span className={styles.mobileText}>
          {Translate({
            context: "profile",
            label: "to-return",
          })}{" "}
        </span>
        {dateString}
      </Text>
      <div>
        <Icon
          className={styles.ornament}
          size={{ w: 5, h: "auto" }}
          src={"ornament1.svg"}
          alt=""
        />
        <Text
          type="text1"
          className={cx(styles.inlineBlock, {
            [styles.isWarning]: isOverdue || isCountdown,
          })}
          tag="p"
        >
          {isOverdue
            ? Translate({
                context: "profile",
                label: "date-overdue",
              })
            : daysToDueDateString}
        </Text>
      </div>
    </DynamicColumn>
  );
};

const DynamicColumnOrder = ({ pickUpExpiryDate, holdQueuePosition }) => {
  const breakpoint = useBreakpoint();
  const isMobileSize =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";
  const pickUpDate = new Date(pickUpExpiryDate);
  const isReadyToPickup = !!pickUpExpiryDate;
  const dateString = isReadyToPickup ? dateToDayInMonth(pickUpDate) : null;
  const inLineText =
    holdQueuePosition === "1"
      ? `${Translate({
          context: "profile",
          label: "front-of-row",
        })}`
      : `${holdQueuePosition - 1} ${Translate({
          context: "profile",
          label: "in-row",
        })}`;

  return (
    <DynamicColumn>
      <>
        <Text type="text2" tag="p">
          {isReadyToPickup && (
            <span>
              {Translate({
                context: "profile",
                label: "pickup-deadline",
              })}{" "}
            </span>
          )}
          {dateString}
        </Text>
        <div>
          <Icon
            className={styles.ornament}
            size={{ w: 5, h: "auto" }}
            src={"ornament1.svg"}
            alt=""
          />
          <Text
            type={isReadyToPickup || isMobileSize ? "text1" : "text2"}
            tag="p"
            className={cx(styles.inlineBlock, {
              [styles.isReady]: isReadyToPickup,
            })}
          >
            {isReadyToPickup
              ? Translate({
                  context: "profile",
                  label: "ready-to-pickup",
                })
              : inLineText}
          </Text>
        </div>
      </>
    </DynamicColumn>
  );
};

const DynamicColumn = ({ className, ...props }) => (
  <div
    className={cx(styles.dynamicColumn, className)}
    data-cy="dynamic-column"
    {...props}
  />
);

/* Use as section header to describe the content of the columns */
export const MaterialHeaderRow = ({ column1, column2, column3 }) => {
  return (
    <div className={styles.materialHeaderRow}>
      <div>
        <Text type="text3">{column1}</Text>
      </div>
      <div>
        <Text type="text3">{column2}</Text>
      </div>
      <div>
        <Text type="text3">{column3}</Text>
      </div>
      <div />
    </div>
  );
};

/**
 * Use for checkbox functionality
 * @param parentRef of parent html element, which contains your group of material rows
 * @returns the 'data-id' of the material row (id from component parameter)
 */
export const getCheckedElements = (parentRef) => {
  const elements = [].slice.call(parentRef.current.children);
  return elements
    .filter((element) => element.ariaChecked === "true")
    .map((element) => element.getAttribute("data-id"));
};

const MobileMaterialRow = ({ renderDynamicColumn, ...props }) => {
  const {
    image,
    creator,
    materialType,
    creationYear,
    title,
    id,
    type,
    status,
    dataCy,
    removedOrderId,
  } = props;

  const modal = useModal();

  const onClick = () => {
    modal.push("material", {
      label: Translate({
        context: "profile",
        label: `your-${type === "LOAN" ? "loan" : "order"}`,
      }),
      ...props,
    });
  };

  return (
    <ConditionalWrapper
      condition={type === "DEBT"}
      wrapper={(children) => (
        <article
          className={cx(styles.materialRow_mobile, {
            [styles.materialRow_green]: status === "GREEN",
            [styles.materialRow_red]: status === "RED",
          })}
          data-cy={dataCy}
        >
          {children}
        </article>
      )}
      elseWrapper={(children) => (
        <article
          className={cx(styles.materialRow_mobile, {
            [styles.materialRow_green]: status === "GREEN",
            [styles.materialRow_red]: status === "RED",
            [styles.materialRow_mobile_animated]: id === removedOrderId,
          })}
          role="button"
          onClick={onClick}
          tabIndex="0"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onClick();
            }
          }}
          data-cy={dataCy}
        >
          {children}
        </article>
      )}
    >
      <div className={styles.imageContainer_mobile}>
        {!!image && <Cover src={image} size="fill-width" />}
      </div>
      <div>
        <Title
          type="title8"
          tag="h3"
          className={styles.materialTitle}
          id={`material-title-${id}`}
        >
          {title}
        </Title>
        {creator && <Text type="text2">{creator}</Text>}
        {materialType && creationYear && (
          <Text type="text2" className={styles.uppercase}>
            {materialType}, {creationYear}
          </Text>
        )}

        <div className={styles.dynamicContent}>{renderDynamicColumn()}</div>
      </div>
      <div className={styles.arrowright_container}>
        <Icon
          alt=""
          size={{ w: "auto", h: 2 }}
          src="arrowrightblue.svg"
          className={styles.arrowright}
        />
      </div>
    </ConditionalWrapper>
  );
};

const MaterialRow = (props) => {
  const {
    image,
    title,
    creator,
    creators,
    materialType,
    creationYear,
    library,
    agencyId,
    hasCheckbox = false,
    id,
    workId,
    type,
    holdQueuePosition,
    pickUpExpiryDate,
    dueDateString,
    amount,
    currency,
    dataCy,
    removedOrderId,
    setRemovedOrderId,
  } = props;
  const [isChecked, setIsChecked] = useState(false);
  const breakpoint = useBreakpoint();
  const { updateOrderInfo } = useUser();
  const modal = useModal();
  const [hasError, setHasError] = useState(false);
  const orderMutation = useMutate(); //keep here to avoid entire page updte on orderMutation update

  const isMobileSize =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";

  const getStatus = () => {
    switch (type) {
      case "DEBT":
        return "RED";
      case "LOAN": {
        const dueDate = new Date(dueDateString);
        const today = new Date();
        const isOverdue = dueDate < today;
        return isOverdue ? "RED" : "NONE";
      }
      case "ORDER":
        return !!pickUpExpiryDate ? "GREEN" : "NONE";
      default:
        return "NONE";
    }
  };

  const status = getStatus();

  const renderDynamicColumn = () => {
    switch (type) {
      case "DEBT":
        return <DynamicColumnDebt amount={amount} currency={currency} />;
      case "LOAN":
        return <DynamicColumnLoan dueDateString={dueDateString} />;
      case "ORDER":
        return (
          <DynamicColumnOrder
            holdQueuePosition={holdQueuePosition}
            pickUpExpiryDate={pickUpExpiryDate}
          />
        );
      default:
        return null;
    }
  };

  async function onCloseModal({ success, message, orderId }) {
    console.log("success ", success);
    if (success) {
      setRemovedOrderId(orderId);
      setTimeout(() => {
        updateOrderInfo();
      }, 4000);
      setHasError(false);
    } else {
      setHasError(true);
    }
  }

  const renderDynamicButton = () => {
    switch (type) {
      case "DEBT":
        return null;
      case "LOAN":
        return (
          <MaterialRowButton dataCy="loan-button">
            {Translate({ context: "profile", label: "renew" })}
          </MaterialRowButton>
        );
      case "ORDER":
        return (
          <MaterialRowIconButton
            onClick={() =>
              onClickDelete({
                modal,
                mobile: false,
                pickUpExpiryDate,
                id,
                agencyId,
                orderMutation,
                onCloseModal,
              })
            }
            dataCy="order-button"
          >
            {Translate({
              context: "profile",
              label: "delete",
            })}
          </MaterialRowIconButton>
        );
      default:
        return null;
    }
  };

  if (isMobileSize) {
    return (
      <MobileMaterialRow
        renderDynamicColumn={renderDynamicColumn}
        status={status}
        onCloseModal={onCloseModal}
        removedOrderId={removedOrderId}
        {...props}
      />
    );
  }

  return (
    <>
      {hasError && <ErrorRow />}
      <ConditionalWrapper
        condition={hasCheckbox}
        wrapper={(children) => (
          <article
            role="checkbox"
            aria-checked={isChecked}
            tabIndex="0"
            aria-labelledby="chk1-label"
            data-id={id}
            onClick={() => setIsChecked(!isChecked)}
            className={cx(
              styles.materialRow,
              styles.materialRow_withCheckbox,
              styles.materialRow_wrapper,
              {
                [styles.materialRow_green]: status === "GREEN",
                [styles.materialRow_red]: status === "RED",
                [styles.materialRow_animated]: id === removedOrderId, //TODO maybe delete here if checkbox only for lån
              }
            )}
            data-cy={dataCy}
          >
            {children}
          </article>
        )}
        elseWrapper={(children) => (
          <article
            key={"article" + id}
            className={cx(styles.materialRow, styles.materialRow_wrapper, {
              [styles.materialRow_green]: status === "GREEN",
              [styles.materialRow_red]: status === "RED",
              [styles.materialRow_animated]: id === removedOrderId, //TODO do i need both?
            })}
            data-cy={dataCy}
          >
            {children}
          </article>
        )}
      >
        <>
          {hasCheckbox && (
            <div>
              <Checkbox
                checked={isChecked}
                id={`material-row-${id}`}
                aria-labelledby={`material-title-${id}`}
                tabIndex="-1"
              />
            </div>
          )}

          <div className={styles.materialInfo}>
            {!!image && (
              <div className={styles.imageContainer}>
                <Cover src={image} size="fill-width" />
              </div>
            )}
            <div>
              <ConditionalWrapper
                condition={!!title && !!creator && !!id}
                wrapper={(children) => (
                  <Link
                    border={{
                      top: false,
                      bottom: {
                        keepVisible: true,
                      },
                    }}
                    href={getWorkUrl(title, creators, workId)}
                    className={styles.blackUnderline}
                  >
                    {children}
                  </Link>
                )}
              >
                <Title
                  type="title8"
                  tag="h3"
                  className={styles.materialTitle}
                  id={`material-title-${id}`}
                >
                  {title}
                </Title>
              </ConditionalWrapper>

              {creator && (
                <Text type="text2" dataCy="creator">
                  {creator}
                </Text>
              )}
              {materialType && creationYear && (
                <Text
                  type="text2"
                  className={styles.uppercase}
                  dataCy="materialtype-and-creationyear"
                >
                  {materialType}, {creationYear}
                </Text>
              )}
            </div>
          </div>

          <div>{renderDynamicColumn()}</div>

          <div>
            <Text type="text2">{library}</Text>
          </div>

          <div>{renderDynamicButton(id, agencyId)}</div>
        </>
      </ConditionalWrapper>
    </>
  );
};

MaterialRow.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  creator: PropTypes.string,
  materialType: PropTypes.string,
  creationYear: PropTypes.string,
  library: PropTypes.string.isRequired,
  hasCheckbox: PropTypes.bool,
  id: PropTypes.string.isRequired,
  status: PropTypes.oneOf(["NONE", "GREEN", "RED"]),
  workId: PropTypes.string,
  type: PropTypes.oneOf(["DEBT", "LOAN", "ORDER"]),
  holdQueuePosition: PropTypes.string,
  pickUpExpiryDate: PropTypes.string,
  dueDate: PropTypes.string,
  amount: PropTypes.string,
  currency: PropTypes.string,
};

export default MaterialRow;
