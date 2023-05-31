import useUser from "@/components/hooks/useUser";
import MaterialRow, {
  DynamicColumn,
  MaterialHeaderRow,
  MaterialRowButton,
  MaterialRowIconButton,
} from "../materialRow/MaterialRow";
import Title from "@/components/base/title";
import styles from "./LoansAndReservations.module.css";
import Translate from "@/components/base/translate";
import ProfileLayout from "../profileLayout";
import Text from "@/components/base/text";
import { encodeString } from "@/lib/utils";
import {
  dateToDayInMonth,
  timestampToShortDate,
} from "@/utils/datetimeConverter";
import cx from "classnames";
import { useRouter } from "next/router";

/**
 * TODO
 * ----
 * user library
 * order data when fbi-api is ready
 */

// Set to when warning should be shown
const DAYS_TO_COUNTDOWN = 5;

export const dataReducer = (dataType, data) => {
  switch (dataType) {
    case "loan": {
      return {
        image: data.manifestation.cover.thumbnail,
        title: data.manifestation.titles.main[0],
        creator: data.manifestation.creators[0].display,
        materialType: data.manifestation.materialTypes[0].specific,
        creationYear: data.manifestation.recordCreationDate.substring(0, 4),
        id: data.loanId,
        workId: "work-of:" + data.manifestation.pid,
      };
    }
    case "order": {
      return {
        image: data.manifestation.cover.thumbnail,
        title: data.manifestation.titles.main[0],
        creator: data.manifestation.creators[0].display,
        materialType: data.manifestation.materialTypes[0].specific,
        creationYear: data.manifestation.recordCreationDate.substring(0, 4),
        library: data.pickUpBranch.agencyName,
        holdQueuePosition: data.holdQueuePosition,
        id: data.orderId,
        workId: "work-of:" + data.manifestation.pid,
      };
    }
  }
};

const LoansAndReservations = () => {
  const { loanerInfo, updateLoanerInfo } = useUser();
  const { loans, orders, debt, agency } = loanerInfo;
  const router = useRouter();
  const locale = router.locale === undefined ? "da" : router.locale;
  const timeFormatter = new Intl.RelativeTimeFormat(locale, { style: "short" });
  const libraryString = agency?.result[0].agencyName || "";

  const onDeleteOrder = (id) => {
    const newOrders = loanerInfo.orders;
    const index = newOrders.map((item) => item.orderId).indexOf(id);
    newOrders.splice(index, 1);
    // TODO proper mutate function
    updateLoanerInfo({ ...loanerInfo }, { orders: newOrders });
  };

  return (
    <ProfileLayout
      title={Translate({ context: "profile", label: "loansAndReservations" })}
    >
      <Text type="text3" className={styles.subHeading}>
        {Translate({ context: "profile", label: "loans-subtext" })}{" "}
        <span className={styles.yourLibraries}>
          {Translate({ context: "profile", label: "your-libraries" })}
        </span>
      </Text>
      <section className={styles.section}>
        <div className={styles.titleRow}>
          <Title
            type="title5"
            tag="h2"
            id={`sublink-${encodeString(
              Translate({
                context: "profile",
                label: "debt",
                requestedLang: "da",
              })
            )}`}
          >
            {Translate({ context: "profile", label: "debt" })}
          </Title>
        </div>

        <MaterialHeaderRow
          column1={Translate({ context: "profile", label: "material" })}
          column2={Translate({ context: "profile", label: "price" })}
          column3={Translate({ context: "profile", label: "loaner-library" })}
        />
        {debt?.map((intermediate, i) => (
          <MaterialRow
            key={`intermediate-${intermediate.title}-#${i}`}
            title={intermediate.title}
            library={libraryString}
            dynamicColumn={
              <DynamicColumn className={styles.isWarning}>
                <Text type="text1" tag="span">
                  {intermediate.amount} kr
                </Text>
              </DynamicColumn>
            }
            status="RED"
            id={`debt-${i}`}
          />
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.titleRow}>
          <Title
            type="title5"
            tag="h2"
            id={`sublink-${encodeString(
              Translate({
                context: "profile",
                label: "loans",
                requestedLang: "da",
              })
            )}`}
          >
            {Translate({ context: "profile", label: "loans" })}
          </Title>
        </div>

        <MaterialHeaderRow
          column1={Translate({ context: "profile", label: "material" })}
          column2={Translate({ context: "profile", label: "return-deadline" })}
          column3={Translate({ context: "profile", label: "loaner-library" })}
        />
        {loans?.map((loan, i) => {
          const dueDate = new Date(loan.dueDate);
          const today = new Date();
          const futureDate = new Date();
          futureDate.setDate(today.getDate() + DAYS_TO_COUNTDOWN);
          const daysToDueDate =
            Math.floor((dueDate - today) / (1000 * 60 * 60 * 24)) + 1; // Add 1 so due date today is "in 1 day"
          const dayToText = timeFormatter.format(daysToDueDate, "day");
          const isCountdown = dueDate >= today && dueDate <= futureDate;
          const isOverdue = dueDate < today;
          const dateString = timestampToShortDate(dueDate);

          return (
            <MaterialRow
              {...dataReducer("loan", loan)}
              key={`loan-${loan.loanId}-#${i}`}
              library={libraryString}
              renderButton={
                <MaterialRowButton>
                  {Translate({ context: "profile", label: "renew" })}
                </MaterialRowButton>
              }
              dynamicColumn={
                <DynamicColumn>
                  {isOverdue ? (
                    <>
                      <Text type="text2" tag="span">
                        {dateString}
                      </Text>
                      <Text type="text1" className={styles.isWarning}>
                        {Translate({
                          context: "profile",
                          label: "date-overdue",
                        })}
                      </Text>
                    </>
                  ) : isCountdown ? (
                    <>
                      <Text type="text2" tag="span">
                        {dateString}
                      </Text>
                      <Text
                        type="text1"
                        tag="span"
                        className={cx(styles.isWarning, styles.upperCase)}
                      >
                        {dayToText}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text type="text2" tag="span">
                        {dateString}
                      </Text>
                      <Text
                        type="text2"
                        tag="span"
                        className={styles.upperCase}
                      >
                        {dayToText}
                      </Text>
                    </>
                  )}
                </DynamicColumn>
              }
              status={isOverdue ? "RED" : "NONE"}
            />
          );
        })}
      </section>

      <section className={styles.section}>
        <div className={styles.titleRow}>
          <Title
            type="title5"
            tag="h2"
            id={`sublink-${encodeString(
              Translate({
                context: "profile",
                label: "orders",
                requestedLang: "da",
              })
            )}`}
          >
            {Translate({ context: "profile", label: "orders" })}
          </Title>
        </div>

        <MaterialHeaderRow
          column1={Translate({ context: "profile", label: "material" })}
          column2={Translate({ context: "profile", label: "status" })}
          column3={Translate({ context: "profile", label: "pickup-at" })}
        />
        {orders?.map((order, i) => {
          const pickUpDate = new Date(order.pickUpExpiryDate);
          const isReadyToPickup = !!order.pickUpExpiryDate;
          const dateString = isReadyToPickup
            ? dateToDayInMonth(pickUpDate)
            : null;

          return (
            <MaterialRow
              {...dataReducer("order", order)}
              key={`loan-${order.loanId}-#${i}`}
              status={isReadyToPickup ? "GREEN" : "NONE"}
              dynamicColumn={
                <DynamicColumn>
                  {isReadyToPickup ? (
                    <>
                      <Text type="text1" tag="span" className={styles.isReady}>
                        {Translate({
                          context: "profile",
                          label: "ready-to-pickup",
                        })}
                      </Text>
                      <Text type="text2" tag="span">
                        {Translate({
                          context: "profile",
                          label: "pickup-deadline",
                        })}
                         {dateString}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text type="text2" tag="span">
                        {order.holdQueuePosition === "1"
                          ? `${Translate({
                              context: "profile",
                              label: "front-of-row",
                            })}`
                          : `${order.holdQueuePosition - 1} ${Translate({
                              context: "profile",
                              label: "in-row",
                            })}`}
                      </Text>
                    </>
                  )}
                </DynamicColumn>
              }
              renderButton={
                <MaterialRowIconButton
                  onClick={() => onDeleteOrder(order.orderId)}
                >
                  {Translate({
                    context: "profile",
                    label: "delete",
                  })}
                </MaterialRowIconButton>
              }
            />
          );
        })}
      </section>
    </ProfileLayout>
  );
};

export default LoansAndReservations;
