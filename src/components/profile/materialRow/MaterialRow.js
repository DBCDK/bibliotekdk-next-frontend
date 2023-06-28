import Cover from "@/components/base/cover";
import Button from "@/components/base/button";
import Text from "@/components/base/text";
import styles from "./MaterialRow.module.css";
import Title from "@/components/base/title";
import Checkbox from "@/components/base/forms/checkbox";
import ConditionalWrapper from "@/components/base/conditionalwrapper";
import Link from "@/components/base/link";
import cx from "classnames";
import { useState } from "react";
import PropTypes from "prop-types";
import Icon from "@/components/base/icon";
import IconButton from "@/components/base/iconButton";
import { getWorkUrl } from "@/lib/utils";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { useModal } from "@/components/_modal";
import Translate from "@/components/base/translate";
import {
  dateToDayInMonth,
  timestampToShortDate,
} from "@/utils/datetimeConverter";
import { useRouter } from "next/router";
import useUser from "@/components/hooks/useUser";

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
              : holdQueuePosition === "1"
              ? `${Translate({
                  context: "profile",
                  label: "front-of-row",
                })}`
              : `${holdQueuePosition - 1} ${Translate({
                  context: "profile",
                  label: "in-row",
                })}`}
          </Text>
        </div>
      </>
    </DynamicColumn>
  );
};

const DynamicColumn = ({ className, ...props }) => (
  <div className={cx(styles.dynamicColumn, className)} {...props} />
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
  const { image, creator, materialType, creationYear, title, id, type } = props;
  const modal = useModal();

  const onClick = () => {
    modal.push("material", {
      label: Translate({ context: "profile", label: "your-loan" }),
      ...props,
    });
  };

  return (
    <ConditionalWrapper
      condition={type === "DEBT"}
      wrapper={(children) => (
        <article className={styles.materialRow_mobile}>{children}</article>
      )}
      elseWrapper={(children) => (
        <article
          className={styles.materialRow_mobile}
          role="button"
          onClick={onClick}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onClick();
            }
          }}
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
    hasCheckbox = false,
    id,
    workId,
    type,
    holdQueuePosition,
    pickUpExpiryDate,
    dueDateString,
    amount,
    currency,
  } = props;
  const [isChecked, setIsChecked] = useState(false);
  const breakpoint = useBreakpoint();
  const { updateLoanerInfo } = useUser();
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

  const onDeleteOrder = (id) => {
    const newOrders = loanerInfo.orders;
    const index = newOrders.map((item) => item.orderId).indexOf(id);
    newOrders.splice(index, 1);
    // TODO proper mutate function
    updateLoanerInfo({ ...loanerInfo }, { orders: newOrders });
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

  const renderDynamicButton = () => {
    switch (type) {
      case "DEBT":
        return null;
      case "LOAN":
        return (
          <MaterialRowButton>
            {Translate({ context: "profile", label: "renew" })}
          </MaterialRowButton>
        );
      case "ORDER":
        return (
          <MaterialRowIconButton onClick={() => onDeleteOrder(order.orderId)}>
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

  if (isMobileSize)
    return (
      <MobileMaterialRow renderDynamicColumn={renderDynamicColumn} {...props} />
    );

  return (
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
            }
          )}
        >
          {children}
        </article>
      )}
      elseWrapper={(children) => (
        <article
          className={cx(styles.materialRow, styles.materialRow_wrapper, {
            [styles.materialRow_green]: status === "GREEN",
            [styles.materialRow_red]: status === "RED",
          })}
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
              tabIndex={-1}
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

            {creator && <Text type="text2">{creator}</Text>}
            {materialType && creationYear && (
              <Text type="text2" className={styles.uppercase}>
                {materialType}, {creationYear}
              </Text>
            )}
          </div>
        </div>

        <div>{renderDynamicColumn()}</div>

        <div>
          <Text type="text2">{library}</Text>
        </div>

        <div>{renderDynamicButton()}</div>
      </>
    </ConditionalWrapper>
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
