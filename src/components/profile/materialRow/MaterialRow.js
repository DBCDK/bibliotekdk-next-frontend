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
import {
  handleLoanMutationUpdates,
  handleOrderMutationUpdates,
} from "./../utils";
import { useRouter } from "next/router";
import { onClickDelete } from "@/components/_modal/pages/deleteOrder/utils";
import { handleRenewLoan } from "../utils";
import MaterialRowTooltip from "./materialRowTooltip/MaterialRowTooltip";
import SkeletonMaterialRow from "./skeleton/Skeleton";

// Set to when warning should be shown
export const DAYS_TO_COUNTDOWN_RED = 5;

export const useLoanDateAnalysis = (dueDateString) => {
  const router = useRouter();
  const locale = router.locale === undefined ? "da" : router.locale;
  const timeFormatter = new Intl.RelativeTimeFormat(locale, { style: "short" });

  const dueDate = new Date(dueDateString);
  const today = new Date();
  /**
   * Add 1, since we get dueDate at midnight, they have the whole day to turn in the material
   * On the due date, we want daysToDueDate to be 0, 1 the day before and so on.
   */
  const daysToDueDate =
    Math.floor((dueDate - today) / (1000 * 60 * 60 * 24)) + 1;
  const daysToDueDateString =
    daysToDueDate === 0
      ? Translate({ context: "profile", label: "last-day" })
      : `${daysToDueDate} ${
          daysToDueDate === 1
            ? Translate({ context: "units", label: "day" })
            : Translate({ context: "units", label: "days" })
        }`;

  return {
    dayToText: timeFormatter.format(daysToDueDate, "day"),
    isCountdown: daysToDueDate <= DAYS_TO_COUNTDOWN_RED,
    isOverdue: daysToDueDate < 0,
    dateString: timestampToShortDate(dueDate),
    daysToDueDate: daysToDueDate,
    daysToDueDateString: daysToDueDateString,
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
export const MaterialHeaderRow = ({ column1, column2, column3, className }) => {
  return (
    <div className={`${styles.materialHeaderRow} ${className}`}>
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
    id: materialId,
    type,
    status,
    dataCy,
    removedOrderId,
    library,
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
  const isDebtRow = type === "DEBT";
  return (
    <ConditionalWrapper
      condition={type === "DEBT"}
      wrapper={(children) => (
        <article
          key={"article" + materialId}
          className={cx(styles.materialRow_mobile, {
            [styles.materialRow_green]: status === "GREEN",
            [styles.materialRow_red]: status === "RED",
            [styles.materialRow_debt]: isDebtRow,
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
            [styles.materialRow_mobile_animated]: materialId === removedOrderId,
          })}
          role="button"
          onClick={onClick}
          tabIndex="0"
          onKeyDown={(e) => {
            e.key === "Enter" && onClick();
          }}
          data-cy={dataCy}
        >
          {children}
        </article>
      )}
    >
      {!isDebtRow && (
        <div>{!!image && <Cover src={image} size="fill-width" />}</div>
      )}
      <div className={styles.textContainer}>
        <Title type="text1" tag="h3" id={`material-title-${materialId}`}>
          {title}
        </Title>

        {creator && <Text type="text2">{creator}</Text>}
        {materialType && creationYear && (
          <Text type="text2" className={styles.uppercase}>
            {materialType}, {creationYear}
          </Text>
        )}

        <div className={styles.dynamicContent}>{renderDynamicColumn()}</div>
        {isDebtRow && (
          <div>
            <Text type="text2">{library}</Text>
          </div>
        )}
      </div>

      {!isDebtRow && (
        <div className={styles.arrowright_container}>
          <Icon
            alt=""
            size={{ w: "auto", h: 2 }}
            src="arrowrightblue.svg"
            className={styles.arrowright}
          />
        </div>
      )}
    </ConditionalWrapper>
  );
};

/**
 * shows a span with text and a checkmark icon
 * @param {string} textType
 * @returns
 */
export const RenewedSpan = ({ textType = "text2" }) => {
  return (
    <span className={styles.renewedWrapper}>
      <Text type={textType}>
        {Translate({
          context: "profile",
          label: "renewed",
        })}
      </Text>
      <Icon
        size={{ w: 3, h: "auto" }}
        src={"checkmark_blue.svg"}
        alt=""
        className={styles.renewedIcon}
      />
    </span>
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
    id: materialId,
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
    skeleton,
    //  For checkbox use
    hasCheckbox = false,
    isSelected,
    onSelect,
  } = props;
  const breakpoint = useBreakpoint();
  const { updateUserStatusInfo } = useUser();
  const modal = useModal();
  const [hasDeleteError, setHasDeleteError] = useState(false);
  const [hasRenewError, setHasRenewError] = useState(false);
  const [renewed, setRenewed] = useState(false);
  const [renewedDueDateString, setRenewedDueDateString] = useState(null);
  const orderMutation = useMutate();
  const loanMutation = useMutate();

  const isMobileSize =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";

  useEffect(() => {
    handleLoanMutationUpdates(
      loanMutation,
      setHasRenewError,
      setRenewed,
      setRenewedDueDateString
    );
  }, [loanMutation.error, loanMutation.data]);

  useEffect(() => {
    handleOrderMutationUpdates(
      orderMutation,
      setHasDeleteError,
      () => setRemovedOrderId(materialId),
      updateUserStatusInfo
    );
  }, [orderMutation.error, orderMutation.data]);

  const getStatus = () => {
    switch (type) {
      case "DEBT":
        return null;
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
        return (
          <DynamicColumnLoan
            dueDateString={
              renewedDueDateString ? renewedDueDateString : dueDateString
            }
          />
        );
      case "ORDER":
        return (
          <DynamicColumnOrder
            holdQueuePosition={holdQueuePosition}
            pickUpExpiryDate={pickUpExpiryDate}
          />
        );
      case "BOOKMARK":
        return (
          <div className={styles.dynamicColumnHorizontal}>
            <Button
              type="primary"
              size="small"
              className={styles.bookmarkActionButton}
            >
              {Translate({
                context: "bookmark",
                label: "order",
              })}
            </Button>
            <IconButton>
              {Translate({
                context: "bookmark",
                label: "remove",
              })}
            </IconButton>
          </div>
        );
      default:
        return null;
    }
  };

  function onClickRenew({ loanId, agencyId, loanMutation }) {
    handleRenewLoan({
      loanId,
      agencyId,
      loanMutation,
    });
  }

  const renderDynamicButton = () => {
    switch (type) {
      case "DEBT":
        return null;
      case "LOAN":
        return hasRenewError ? (
          <MaterialRowTooltip labelToTranslate="renew-loan-tooltip" />
        ) : (
          <MaterialRowButton
            dataCy="loan-button"
            onClick={() =>
              onClickRenew({
                loanId: materialId,
                agencyId,
                loanMutation,
              })
            }
          >
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
                materialId,
                agencyId,
                orderMutation,
                title,
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

  const onCheckboxClick = (e) => {
    if (
      e.target instanceof HTMLHeadingElement ||
      e.target instanceof HTMLButtonElement ||
      e.target.getAttribute("data-cy") === "text-fjern"
    ) {
      /* Element clicked is an actionable element, return */
      return;
    }
    if (onSelect) {
      onSelect();
    }
  };

  if (skeleton) {
    return (
      <SkeletonMaterialRow version={isMobileSize ? "mobile" : "desktop"} />
    );
  }

  if (isMobileSize && type !== "BOOKMARK") {
    return (
      <>
        {hasDeleteError && type === "ORDER" && (
          <ErrorRow
            text={Translate({
              context: "profile",
              label: "error-deleting-order",
            })}
          />
        )}
        <MobileMaterialRow
          key={"article" + materialId}
          renderDynamicColumn={renderDynamicColumn}
          status={status}
          setHasDeleteError={setHasDeleteError}
          library={library}
          {...props}
        />
      </>
    );
  }
  const isDebtRow = type === "DEBT";
  return (
    <>
      {hasDeleteError && type === "ORDER" && (
        <ErrorRow
          text={Translate({
            context: "profile",
            label: "error-deleting-order",
          })}
        />
      )}
      <ConditionalWrapper
        condition={hasCheckbox}
        wrapper={(children) => (
          <article
            key={"article" + materialId}
            role="checkbox"
            aria-checked={isSelected}
            tabIndex="0"
            aria-labelledby="chk1-label"
            data-id={materialId}
            onClick={onCheckboxClick}
            className={cx(styles.materialRow, styles.materialRow_wrapper, {
              [styles.materialRow_withGridCheckbox]: type !== "BOOKMARK",
              [styles.materialRow_withFlexCheckbox]: type === "BOOKMARK",
              [styles.materialRow_green]: status === "GREEN",
              [styles.materialRow_red]: status === "RED",
              [styles.materialRow_animated]: materialId === removedOrderId,
            })}
            data-cy={dataCy}
          >
            {children}
          </article>
        )}
        elseWrapper={(children) => (
          <article
            key={"article" + materialId} //to avoid rerendering
            className={cx(styles.materialRow, styles.materialRow_wrapper, {
              [styles.materialRow_green]: status === "GREEN",
              [styles.materialRow_red]: status === "RED",
              [styles.materialRow_animated]: materialId === removedOrderId,
              [styles.debtRow]: isDebtRow,
            })}
            data-cy={dataCy}
          >
            {children}
          </article>
        )}
      >
        <>
          {hasCheckbox && (
            <div className={styles.checkboxContainer}>
              <Checkbox
                checked={isSelected}
                id={`material-row-${materialId}`}
                ariaLabelledBy={`material-title-${materialId}`}
                tabIndex="-1"
                readOnly
              />
            </div>
          )}

          <div
            className={cx(styles.materialInfo, {
              [styles.debtMaterial]: isDebtRow,
            })}
          >
            {!!image && (
              <div className={styles.imageContainer}>
                <Cover src={image} size="fill-width" />
              </div>
            )}
            <div className={styles.textContainer}>
              <ConditionalWrapper
                condition={!!title && !!creator && !!materialId}
                wrapper={(children) => (
                  <Link
                    border={{
                      top: false,
                      bottom: {
                        keepVisible: true,
                      },
                    }}
                    href={getWorkUrl(
                      title,
                      [{ nameSort: creator || "", display: creator || "" }],
                      materialId
                    )}
                    className={styles.blackUnderline}
                  >
                    {children}
                  </Link>
                )}
              >
                {title ? (
                  <Title
                    type="text1"
                    tag="h3"
                    id={`material-title-${materialId}`}
                  >
                    {title}
                  </Title>
                ) : (
                  <Text type="text2">
                    {Translate({ context: "profile", label: "unknowMaterial" })}
                  </Text>
                )}
              </ConditionalWrapper>

              {creator && (
                <Text type="text2" dataCy="creator">
                  {creator}
                </Text>
              )}
              {materialType && (
                <Text
                  type="text2"
                  className={styles.uppercase}
                  dataCy="materialtype-and-creationyear"
                >
                  {materialType} {creationYear && <>, {creationYear}</>}
                </Text>
              )}
            </div>
          </div>

          <div className={cx({ [styles.debtDynamicColumn]: isDebtRow })}>
            {renderDynamicColumn()}
          </div>

          <div className={cx({ [styles.debtLibrary]: isDebtRow })}>
            <Text type="text2">{library}</Text>
          </div>

          {type !== "BOOKMARK" && (
            <>
              <div className={cx({ [styles.debtLibrary]: isDebtRow })}>
                <Text type="text2">{library}</Text>
              </div>

              {renewed ? (
                <RenewedSpan textType="text3" />
              ) : (
                <div>{renderDynamicButton(materialId, agencyId)}</div>
              )}
            </>
          )}
        </>
      </ConditionalWrapper>
    </>
  );
};

MaterialRow.propTypes = {
  id: PropTypes.string.isRequired, //materialId
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  creator: PropTypes.string,
  materialType: PropTypes.string,
  creationYear: PropTypes.string,
  library: PropTypes.string,
  hasCheckbox: PropTypes.bool,
  status: PropTypes.oneOf(["NONE", "GREEN", "RED"]),
  workId: PropTypes.string,
  type: PropTypes.oneOf(["DEBT", "LOAN", "ORDER", "BOOKMARK"]),
  holdQueuePosition: PropTypes.string,
  pickUpExpiryDate: PropTypes.string,
  dueDate: PropTypes.string,
  amount: PropTypes.string,
  currency: PropTypes.string,
  agencyId: PropTypes.string,
  removedOrderId: PropTypes.string,
  setRemovedOrderId: PropTypes.func,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  skeleton: PropTypes.bool,
};

export default MaterialRow;
