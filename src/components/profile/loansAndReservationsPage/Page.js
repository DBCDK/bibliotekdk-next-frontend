import useUser from "@/components/hooks/useUser";
import MaterialRow, {
  DynamicCloumn,
  MaterialHeaderRow,
  MaterialRowButton,
} from "../materialRow/MaterialRow";
import Title from "@/components/base/title";
import styles from "./LoansAndReservations.module.css";
import Translate from "@/components/base/translate";
import ProfileLayout from "../profileLayout";
import Text from "@/components/base/text";
import {
  dateToDayInMonth,
  timestampToShortDate,
} from "@/utils/datetimeConverter";

/**
 * TODO
 * ----
 * empty list
 * link underline
 * link href
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
        library: "Herlev bibliotek", // TODO
        id: data.loanId,
      };
    }
    case "order": {
      return {
        image: data.manifestation.cover.thumbnail,
        title: data.manifestation.titles.main[0],
        creator: data.manifestation.creators[0].display,
        materialType: data.manifestation.materialTypes[0].specific,
        creationYear: data.manifestation.recordCreationDate.substring(0, 4),
        library: data.pickupBranch.agencyName,
        id: data.orderId,
      };
    }
  }
};

const LoansAndReservations = () => {
  const { loanerInfo, updateLoanerInfo } = useUser();
  const { loans, orders, debt } = loanerInfo;

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
          <Title type="title5" tag="h2">
            {Translate({ context: "profile", label: "debt" })}
          </Title>
        </div>

        {debt?.map((intermediate, i) => (
          <MaterialRow
            key={`intermediate-${intermediate.title}-#${i}`}
            title={intermediate.title}
            library={"Herlev bibliotek"} // TODO
            dynamicColumn={
              <DynamicCloumn className={styles.isWarning}>
                {intermediate.amount} kr
              </DynamicCloumn>
            }
            status="RED"
            id={`debt-${i}`}
          />
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.titleRow}>
          <Title type="title5" tag="h2">
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
          const daysToDueDate = Math.floor(
            (dueDate - today) / (1000 * 60 * 60 * 24)
          );
          const isCountdown = dueDate >= today && dueDate <= futureDate;
          const isOverdue = dueDate < today;
          const dateString = timestampToShortDate(dueDate);

          return (
            <MaterialRow
              {...dataReducer("loan", loan)}
              key={`loan-${loan.loanId}-#${i}`}
              id={loan.loanId}
              renderButton={
                <MaterialRowButton>
                  {Translate({ context: "profile", label: "renew" })}
                </MaterialRowButton>
              }
              dynamicColumn={
                <DynamicCloumn>
                  {isOverdue ? (
                    <>
                      <span className={styles.isWarning}>{dateString}</span>
                      <span className={styles.isWarning}>
                        {Translate({
                          context: "profile",
                          label: "date-overdue",
                        })}
                      </span>
                    </>
                  ) : isCountdown ? (
                    <>
                      <span>{dateString}</span>
                      <span className={styles.isWarning}>
                        {Translate({ context: "profile", label: "in" })}{" "}
                        {daysToDueDate}{" "}
                        {daysToDueDate === 1
                          ? Translate({ context: "units", label: "day" })
                          : Translate({ context: "units", label: "days" })}
                      </span>
                    </>
                  ) : (
                    <span>{dateString}</span>
                  )}
                </DynamicCloumn>
              }
              status={isOverdue ? "RED" : "NONE"}
            />
          );
        })}
      </section>

      <section className={styles.section}>
        <div className={styles.titleRow}>
          <Title type="title5" tag="h2">
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
                <DynamicCloumn>
                  {isReadyToPickup ? (
                    <span className={styles.isReady}>
                      {Translate({
                        context: "profile",
                        label: "ready-to-pickup",
                      })}
                    </span>
                  ) : null}
                  <span>
                    {Translate({
                      context: "profile",
                      label: "pickup-deadline",
                    })}
                     {dateString}
                  </span>
                </DynamicCloumn>
              }
              renderButton={
                <MaterialRowButton onClick={() => onDeleteOrder(order.orderId)}>
                  {Translate({
                    context: "profile",
                    label: "delete",
                  })}
                </MaterialRowButton>
              }
            />
          );
        })}
      </section>
    </ProfileLayout>
  );
};

export default LoansAndReservations;
