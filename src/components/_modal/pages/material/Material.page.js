import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Top from "../base/top";
import Cover from "@/components/base/cover";
import Icon from "@/components/base/icon";
import styles from "./Material.module.css";
import Translate from "@/components/base/translate";
import { useLoanDateAnalysis } from "@/components/profile/materialRow/versions/MaterialRowLoan";
import { TextWithCheckMark } from "@/components/profile/materialRow/MaterialRow";
import { getWorkUrl } from "@/lib/utils";
import { useModal } from "@/components/_modal";
import Link from "@/components/base/link";
import Recommendations from "@/components/work/recommendations";
import { dateToDayInMonth } from "@/utils/datetimeConverter";
import { onClickDelete } from "../deleteOrder/utils";
import cx from "classnames";
import { useMutate } from "@/lib/api/api";
import { handleRenewLoan } from "@/components/profile/utils";
import { useEffect, useState } from "react";
import { RenewError } from "@/components/profile/materialRow/materialRowTooltip/MaterialRowTooltip";
import {
  handleLoanMutationUpdates,
  handleOrderMutationUpdates,
} from "@/components/profile/utils";
import useUser from "@/components/hooks/useUser";
import Spinner from "react-bootstrap/Spinner";
import Button from "@/components/base/button";

const DynamicContentLoan = ({ dueDateString, dataCyPrefix }) => {
  const { isCountdown, isOverdue, dateString, daysToDueDateString } =
    useLoanDateAnalysis(dueDateString);

  return (
    <>
      <Text
        type="text2"
        className={styles.spacer}
        dataCy={`${dataCyPrefix}-return-date`}
      >
        {Translate({ context: "profile", label: "to-return" })} {dateString}
      </Text>
      <div className={styles.status}>
        <Icon
          className={styles.ornament}
          size={{ w: 5, h: "auto" }}
          src={"ornament1.svg"}
          alt=""
          dataCy={`${dataCyPrefix}-ornament`}
        />
        {isOverdue ? (
          <Text type="text2" dataCy={`${dataCyPrefix}-message`}>
            {Translate({
              context: "profile",
              label: "date-overdue",
            })}
          </Text>
        ) : (
          <Text
            type="text2"
            className={cx({ [styles.isWarning]: isCountdown })}
            dataCy={`${dataCyPrefix}-message`}
          >
            {daysToDueDateString}
          </Text>
        )}
      </div>
    </>
  );
};

const DynamicColumnOrder = ({
  pickUpExpiryDate,
  holdQueuePosition,
  library,
}) => {
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

  if (isReadyToPickup) {
    return (
      <>
        <Text type="text2" tag="p" className={styles.spacer}>
          {Translate({
            context: "profile",
            label: "pickup-at",
          })}{" "}
          {library}
        </Text>
        <Text type="text2" tag="p">
          {Translate({
            context: "profile",
            label: "pickup-deadline",
          })}{" "}
          {dateString}
        </Text>
        <div className={styles.status}>
          <Icon
            className={styles.ornament}
            size={{ w: 5, h: "auto" }}
            src={"ornament1.svg"}
            alt=""
          />
          <Text type="text1" tag="p" className={styles.isReady}>
            {Translate({
              context: "profile",
              label: "ready-to-pickup",
            })}
          </Text>
        </div>
      </>
    );
  }

  return (
    <>
      <Text type="text2" tag="p" className={styles.spacer}>
        {Translate({
          context: "profile",
          label: "pickup-at",
        })}{" "}
        {library}
      </Text>
      <div className={styles.status}>
        <Icon
          className={styles.ornament}
          size={{ w: 5, h: "auto" }}
          src={"ornament1.svg"}
          alt=""
        />
        <Text type="text2" tag="span">
          {inLineText}
        </Text>
      </div>
    </>
  );
};

const Material = ({ context }) => {
  const {
    label,
    title,
    creator,
    creators,
    materialType,
    creationYear,
    image,
    workId,
    dueDateString,
    type,
    pickUpExpiryDate,
    holdQueuePosition,
    materialId,
    agencyId,
    setHasDeleteError,
    setRemovedOrderId,
    library,
  } = context;
  const modal = useModal();
  const orderMutation = useMutate();
  const loanMutation = useMutate();
  const [renewed, setRenewed] = useState(false);
  const [hasRenewError, setHasRenewError] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false); // For spinner usage
  const [renewedDueDateString, setRenewedDueDateString] = useState(null);
  const { updateUserStatusInfo } = useUser();

  useEffect(() => {
    //RENEW LOAN: when we open modal for a new book,
    //reset variables to avoid showing errors/renwed status and new due date of previous book
    setRenewed(false);
    setHasRenewError(false);
    setRenewedDueDateString(null);
  }, [materialId]);

  useEffect(() => {
    handleLoanMutationUpdates(
      loanMutation,
      setHasRenewError,
      setRenewed,
      setRenewedDueDateString
    );
    if (loanMutation?.data?.renewLoan?.renewed) {
      //update loans from modal, since we want the loans page to refresh and show the new data.
      // we dont do this for desktop. on desktop we show the new dueDate and "fonyet".
      // If we refetched, the list would order again and we wouldnt know when to show "fonyet".
      setRenewed(true);
      updateUserStatusInfo("LOAN");
    }
  }, [loanMutation.error, loanMutation.data]);

  useEffect(() => {
    handleOrderMutationUpdates(
      orderMutation,
      setHasDeleteError,
      () => setRemovedOrderId(materialId),
      updateUserStatusInfo
    );
  }, [orderMutation.error, orderMutation.data]);

  const renderDynamicContent = () => {
    switch (type) {
      case "LOAN":
        return (
          <DynamicContentLoan
            dueDateString={
              renewedDueDateString ? renewedDueDateString : dueDateString
            }
            dataCyPrefix="dyn-cont-loan"
          />
        );
      case "ORDER":
        return (
          <DynamicColumnOrder
            pickUpExpiryDate={pickUpExpiryDate}
            holdQueuePosition={holdQueuePosition}
            library={library}
          />
        );
    }
  };

  async function handleClickRenew() {
    setIsRenewing(true);
    await handleRenewLoan({
      loanId: materialId,
      agencyId,
      loanMutation,
    });
    setIsRenewing(false);
  }

  /**
   * shown when loanMutation updates with either a data content or an error
   */
  const AfterRenewMessage = ({ hasRenewError, renewed }) => {
    if (hasRenewError)
      return <RenewError isColumn={false} customClass={styles.renewError} />;
    if (renewed) return <TextWithCheckMark textType="text2" />;
  };

  const renderDynamicButton = () => {
    switch (type) {
      case "LOAN":
        return (
          <div className={styles.buttonRowWrapper}>
            <div className={cx(styles.buttonContainer, styles.button)}>
              <Button
                size="medium"
                disabled={hasRenewError || renewed}
                dataCy="loan-button"
                onClick={handleClickRenew}
                onKeyPress={(e) => {
                  e.key === "Enter" && handleClickRenew();
                }}
              >
                {isRenewing ? (
                  <Spinner
                    animation="border"
                    role="status"
                    variant="light"
                    className={styles.spinner}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  Translate({ context: "profile", label: "renew" })
                )}
              </Button>
            </div>
            <AfterRenewMessage
              hasRenewError={hasRenewError}
              renewed={renewed}
            />
          </div>
        );
      case "ORDER":
        return (
          <div className={styles.buttonRowWrapperOrder}>
            <div className={cx(styles.buttonContainer, styles.buttonDelete)}>
              <Button
                type="secondary"
                size="medium"
                onClick={() => {
                  onClickDelete({
                    modal,
                    mobile: true,
                    pickUpExpiryDate,
                    materialId,
                    agencyId,
                    orderMutation,
                    title,
                  });
                }}
                onKeyPress={(e) => {
                  e.key === "Enter" &&
                    onClickDelete({
                      modal,
                      mobile: true,
                      pickUpExpiryDate,
                      materialId,
                      agencyId,
                      orderMutation,
                      title,
                    });
                }}
                dataCy="order-button"
              >
                {Translate({
                  context: "profile",
                  label: "delete-order",
                })}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <article className={styles.Material} data-cy="loans-and-reservations-modal">
      <Top
        title={label}
        titleTag="h4"
        className={{ top: styles.topElement, title: styles.topTitle }}
      />
      <hr />
      <div className={styles.splitContainer}>
        <div>
          {/**
           * This is the main titel of the article
           * h3 used as it's correct for the context
           * https://stackoverflow.com/questions/38448811/is-it-semantically-correct-to-use-h1-in-a-dialog
           * */}
          <Title type="title5" tag="h3">
            {title}
          </Title>
          {creator && (
            <Text type="text2" className={styles.spacer} dataCy="creator">
              {creator}
            </Text>
          )}
          {materialType && creationYear && (
            <Text
              type="text2"
              className={cx(styles.spacer, styles.uppercase)}
              dataCy="materialtype-and-creationyear"
            >
              {materialType}, {creationYear}
            </Text>
          )}

          {renderDynamicContent()}
        </div>
        <div>
          <Cover src={image} size="fill-width" />
        </div>
      </div>
      {renderDynamicButton()}

      <Link
        border={{
          top: false,
          bottom: {
            keepVisible: true,
          },
        }}
        href={getWorkUrl(title, creators, workId)}
      >
        <Text className={styles.link} type="text2" tag="span">
          <Translate context="profile" label="goToBook" />
        </Text>
      </Link>

      {type === "LOAN" && (
        <>
          <Text type="text2">
            <Translate context="profile" label="lentBy" />
          </Text>
          <Text type="text1">{library}</Text>
        </>
      )}

      <div className={styles.recommendationsContainer}>
        <Recommendations
          workId={workId}
          anchor-label={Translate({
            context: "recommendations",
            label: "remindsOf",
          })}
          headerTag="h3"
          titleDivider={false}
        />
      </div>
    </article>
  );
};

export default Material;
