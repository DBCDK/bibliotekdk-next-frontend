import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Top from "../base/top";
import Cover from "@/components/base/cover";
import Icon from "@/components/base/icon";
import styles from "./Material.module.css";
import Translate from "@/components/base/translate";
import {
  MaterialRowButton,
  useLoanDateAnalysis,
} from "@/components/profile/materialRow/MaterialRow";
import { getWorkUrl } from "@/lib/utils";
import { useModal } from "@/components/_modal";
import Link from "@/components/base/link";
import Recommendations from "@/components/work/recommendations";
import { dateToDayInMonth } from "@/utils/datetimeConverter";
import cx from "classnames";

const DynamicContentLoan = ({ dueDateString }) => {
  const { isCountdown, isOverdue, dateString, daysToDueDateString } =
    useLoanDateAnalysis(dueDateString);

  return (
    <>
      <Text type="text2" className={styles.spacer}>
        {Translate({ context: "profile", label: "to-return" })} {dateString}
      </Text>
      <div className={styles.status}>
        <Icon
          className={styles.ornament}
          size={{ w: 5, h: "auto" }}
          src={"ornament1.svg"}
          alt=""
        />
        {isOverdue ? (
          <Text type="text2">
            {Translate({
              context: "profile",
              label: "date-overdue",
            })}
          </Text>
        ) : (
          <Text
            type="text2"
            className={cx({ [styles.isWarning]: isCountdown })}
          >
            {daysToDueDateString}
          </Text>
        )}
      </div>
    </>
  );
};

const DynamicColumnOrder = ({ pickUpExpiryDate, holdQueuePosition }) => {
  const pickUpDate = new Date(pickUpExpiryDate);
  const isReadyToPickup = !!pickUpExpiryDate;
  const dateString = isReadyToPickup ? dateToDayInMonth(pickUpDate) : null;

  if (isReadyToPickup) {
    return (
      <>
        <Text type="text2" tag="p" className={styles.spacer}>
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
    <div className={cx(styles.status, styles.spacer)}>
      <Icon
        className={styles.ornament}
        size={{ w: 5, h: "auto" }}
        src={"ornament1.svg"}
        alt=""
      />
      <Text type="text2" tag="span">
        {holdQueuePosition === "1"
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
    id,
    agencyId,
    orderMutation,
  } = context;

  const modal = useModal();

  const renderDynamicContent = () => {
    switch (type) {
      case "LOAN":
        return <DynamicContentLoan dueDateString={dueDateString} />;
      case "ORDER":
        return (
          <DynamicColumnOrder
            pickUpExpiryDate={pickUpExpiryDate}
            holdQueuePosition={holdQueuePosition}
          />
        );
    }
  };

  const renderDynamicButton = () => {
    switch (type) {
      case "LOAN":
        return (
          <MaterialRowButton size="medium" wrapperClassname={styles.button}>
            {Translate({ context: "profile", label: "renew" })}
          </MaterialRowButton>
        );
      case "ORDER":
        return (
          <MaterialRowButton
            type="secondary"
            size="medium"
            wrapperClassname={styles.button}
            onClick={() => onClickDelete({ id, agencyId, orderMutation })}
          >
            {Translate({
              context: "profile",
              label: "delete-order",
            })}
          </MaterialRowButton>
        );
    }
  };

  function onClickDelete({ orderId, agencyId, orderMutation }) {
    modal.push("deleteOrder", {
      label: Translate({ context: "profile", label: "delete-order" }),
      mobile: true,
      isReadyToPickup: !!pickUpExpiryDate,
      orderId: orderId,
      agencyId: agencyId,
      orderMutation: orderMutation,
    });
  }

  return (
    <article className={styles.Material}>
      <Top title={label} titleTag="h4" />
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
            <Text type="text2" className={styles.spacer}>
              {creator}
            </Text>
          )}
          {materialType && creationYear && (
            <Text type="text2" className={cx(styles.spacer, styles.uppercase)}>
              {materialType}, {creationYear}
            </Text>
          )}

          {renderDynamicContent()}

          {renderDynamicButton()}
        </div>
        <div>
          <Cover src={image} size="fill-width" />
        </div>
      </div>

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
          Gå til bogen
        </Text>
      </Link>

      <Text type="text2">Udlånt af</Text>
      <Text type="text1">Sorø bibliotek</Text>
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
