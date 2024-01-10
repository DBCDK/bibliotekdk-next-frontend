/* eslint-disable css-modules/no-unused-class */
import Cover from "@/components/base/cover";
import Button from "@/components/base/button";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import ConditionalWrapper from "@/components/base/conditionalwrapper";
import Link from "@/components/base/link";
import cx from "classnames";
import { useEffect, useState } from "react";
import { useMutate } from "@/lib/api/api";
import Icon from "@/components/base/icon";
import { useModal } from "@/components/_modal";
import Translate from "@/components/base/translate";
import { timestampToShortDate } from "@/utils/datetimeConverter";
import { getWorkUrlForProfile, handleLoanMutationUpdates } from "../../utils";
import { useRouter } from "next/router";
import { handleRenewLoan } from "../../utils";
import MaterialRowTooltip from "../materialRowTooltip/MaterialRowTooltip";
import sharedStyles from "../MaterialRow.module.css";
import { TextWithCheckMark } from "../MaterialRow";
import {
  formatMaterialTypesToPresentation,
  formatMaterialTypesToUrl,
} from "@/lib/manifestationFactoryUtils";

// Set to when red text should be used for remaining loan days
const DAYS_TO_COUNTDOWN_RED = 5;

/**
 *
 * @param {string} dueDateString
 * @returns {Object}
 */
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

export const LoanColumn = ({ dueDateString }) => {
  const { isCountdown, isOverdue, dateString, daysToDueDateString } =
    useLoanDateAnalysis(dueDateString);

  return (
    <div className={sharedStyles.dynamicColumn} data-cy="dynamic-column">
      <Text type="text2" tag="p">
        <span className={sharedStyles.mobileText}>
          {Translate({
            context: "profile",
            label: "to-return",
          })}{" "}
        </span>
        {dateString}
      </Text>
      <div>
        <Icon
          className={sharedStyles.ornament}
          size={{ w: 5, h: "auto" }}
          src={"ornament1.svg"}
          alt=""
        />
        <Text
          type="text1"
          className={cx(sharedStyles.inlineBlock, {
            [sharedStyles.isWarning]: isOverdue || isCountdown,
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
    </div>
  );
};

const getStatus = (dueDateString) => {
  const dueDate = new Date(dueDateString);
  const today = new Date();
  const isOverdue = dueDate < today;
  return isOverdue ? "RED" : "NONE";
};

/**
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
const MaterialRowLoan = (props) => {
  const {
    image,
    workId,
    materialId,
    flatMaterialTypes,
    title,
    titles,
    creator,
    creators,
    edition,
    creationYear,
    dueDateString,
    library,
    dataCy,
    isMobileSize,
    agencyId,
  } = props;
  const [hasRenewError, setHasRenewError] = useState(false);
  const modal = useModal();
  const [status, setStatus] = useState(
    dueDateString ? getStatus(dueDateString) : "NONE"
  );
  const loanMutation = useMutate();
  const [renewed, setRenewed] = useState(false);
  const [renewedDueDateString, setRenewedDueDateString] = useState(null);

  useEffect(() => {
    if (renewedDueDateString) {
      const renewedStatus = getStatus(renewedDueDateString);
      setStatus(renewedStatus);
    }
  }, [renewedDueDateString]);

  useEffect(() => {
    handleLoanMutationUpdates(
      loanMutation,
      setHasRenewError,
      setRenewed,
      setRenewedDueDateString
    );
  }, [loanMutation.error, loanMutation.data]);

  const onClickRenew = ({ loanId, agencyId, loanMutation }) => {
    handleRenewLoan({
      loanId,
      agencyId,
      loanMutation,
    });
  };

  const onMobileItemClick = () => {
    modal.push("material", {
      label: Translate({
        context: "profile",
        label: "your-loan",
      }),
      type: "LOAN",
      ...props,
    });
  };

  if (isMobileSize) {
    return (
      <article
        className={cx(sharedStyles.materialRow_mobile, {
          [sharedStyles.materialRow_green]: status === "GREEN",
          [sharedStyles.materialRow_red]: status === "RED",
        })}
        role="button"
        onClick={onMobileItemClick}
        tabIndex="0"
        onKeyDown={(e) => {
          e.key === "Enter" && onMobileItemClick();
        }}
        data-cy={`articleRow-${dataCy}`}
      >
        <div>{!!image && <Cover src={image} size="fill-width" />}</div>
        <div className={sharedStyles.textContainer}>
          <Title type="text1" tag="h3" id={`material-title-${materialId}`}>
            {title}
          </Title>

          {creator && <Text type="text2">{creator}</Text>}
          {flatMaterialTypes && creationYear && (
            <Text type="text2" className={sharedStyles.uppercase}>
              {formatMaterialTypesToPresentation(flatMaterialTypes)},{" "}
              {creationYear}
            </Text>
          )}

          <div className={sharedStyles.dynamicContent}>
            <LoanColumn
              dueDateString={
                renewedDueDateString ? renewedDueDateString : dueDateString
              }
            />
          </div>
        </div>

        <div className={sharedStyles.arrowright_container}>
          <Icon
            alt=""
            size={{ w: "auto", h: 2 }}
            src="arrowrightblue.svg"
            className={sharedStyles.arrowright}
          />
        </div>
      </article>
    );
  }

  return (
    <article
      key={"article" + materialId} //to avoid rerendering
      className={cx(
        sharedStyles.materialRow,
        sharedStyles.materialRow_wrapper,
        {
          [sharedStyles.materialRow_green]: status === "GREEN",
          [sharedStyles.materialRow_red]: status === "RED",
        }
      )}
      data-cy={`articleRow-${dataCy}`}
    >
      <div className={sharedStyles.materialInfo}>
        {!!image && (
          <div className={sharedStyles.imageContainer}>
            <Cover src={image} size="fill-width" />
          </div>
        )}
        <div className={sharedStyles.textContainer}>
          <ConditionalWrapper
            condition={!!title && !!materialId}
            wrapper={(children) => (
              <Link
                border={{
                  top: false,
                  bottom: {
                    keepVisible: true,
                  },
                }}
                href={getWorkUrlForProfile({
                  workId: workId,
                  materialTypeAsUrl:
                    formatMaterialTypesToUrl(flatMaterialTypes),
                  titles: titles,
                  creators: creators,
                  scrollToEdition: true,
                })}
                className={sharedStyles.blackUnderline}
              >
                {children}
              </Link>
            )}
          >
            {title ? (
              <Title type="text1" tag="h3" id={`material-title-${materialId}`}>
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
          {flatMaterialTypes && (
            <Text
              type="text2"
              className={sharedStyles.uppercase}
              dataCy="materialtype-and-creationyear"
            >
              {formatMaterialTypesToPresentation(flatMaterialTypes)}{" "}
              {creationYear && <>, {creationYear}</>}
              {edition && <span>{edition}</span>}
            </Text>
          )}
        </div>
      </div>
      <div>
        <LoanColumn
          dueDateString={
            renewedDueDateString ? renewedDueDateString : dueDateString
          }
        />
      </div>

      <div>
        <Text type="text2">{library}</Text>
      </div>

      {renewed ? (
        <TextWithCheckMark textType="text3" />
      ) : (
        <div>
          {hasRenewError ? (
            <MaterialRowTooltip labelToTranslate="renew-loan-tooltip" />
          ) : (
            <div className={sharedStyles.buttonContainer}>
              <Button
                type="primary"
                size="small"
                dataCy="loan-button"
                onClick={() =>
                  onClickRenew({
                    loanId: materialId,
                    agencyId,
                    loanMutation,
                  })
                }
                {...props}
              >
                {Translate({ context: "profile", label: "renew" })}
              </Button>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default MaterialRowLoan;
