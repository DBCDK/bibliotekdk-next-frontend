import useUser from "@/components/hooks/useUser";
import MaterialRow, {
  DynamicCloumn,
  MaterialRowButton,
} from "../materialRow/MaterialRow";
import Title from "@/components/base/title";
import Button from "@/components/base/button/Button";
import styles from "./LoansAndReservations.module.css";
import Translate from "@/components/base/translate";
import { useRef, useState } from "react";
import ProfileLayout from "../profileLayout";
import Text from "@/components/base/text";
import {
  dateToDayInMonth,
  timestampToShortDate,
} from "@/utils/datetimeConverter";

/**
 * TODO
 * -----
 * Dates ✓
 * Status ✓
 * Dept data ✓
 * Better mock data (different books)
 * checkbox focus style ✓
 * checkbox hover style ✓
 * action placeholders ✓
 * data reducer (material row) ✓
 * Material row standalone mock ✓
 * Last border on link
 * Image height
 * Confirm selection styling
 * Queue numbers & cross library reservertions
 * Actions
 */

// Set to when warning should be shown
const DAYS_TO_COUNTDOWN = 5;

export const dataReducer = (profile, data) => {
  switch (profile) {
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

const getCheckedElements = (parentRef) => {
  const elements = [].slice.call(parentRef.current.children);
  const checkedElements = elements
    .filter((element) => element.ariaChecked === "true")
    .map((element) => element.getAttribute("data-id"));
  return checkedElements;
};

const LoansAndReservations = () => {
  const { loanerInfo } = useUser();
  const { loans, orders, debt } = loanerInfo;
  const [isCheckbox, setIsCheckbox] = useState({
    debts: false,
    loans: false,
    orders: false,
  });
  const loansWrapperRef = useRef();
  const ordersWrapperRef = useRef();

  const onRenewSeveral = () => {
    if (isCheckbox.loans && loansWrapperRef && loansWrapperRef.current) {
      const ids = getCheckedElements(loansWrapperRef);
      alert("Renew ids \n" + ids.join(", "));
    }
  };

  const onDeleteSeveral = () => {
    if (isCheckbox.orders && ordersWrapperRef && ordersWrapperRef.current) {
      const ids = getCheckedElements(ordersWrapperRef);
      alert("Delete ids \n" + ids.join(", "));
    }
  };

  return (
    <ProfileLayout
      title={Translate({ context: "profile", label: "loansAndReservations" })}
    >
      <Text type="text3" className={styles.subHeading}>
        Herlev Bibliotek, Ballerup Bibliotek og Det Kongelige Bibliotek
      </Text>
      <section className={styles.section}>
        <div className={styles.titleRow}>
          <Title type="title5" tag="h3">
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
          />
        ))}
      </section>

      <section className={styles.section} ref={loansWrapperRef}>
        <div className={styles.titleRow}>
          <Title type="title5" tag="h3">
            {Translate({ context: "profile", label: "loans" })}
          </Title>
          <Button
            type="secondary"
            size="small"
            onClick={() => {
              onRenewSeveral();
              setIsCheckbox({ ...isCheckbox, loans: !isCheckbox.loans });
            }}
          >
            {Translate({ context: "profile", label: "renew-more" })}
          </Button>
        </div>

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
              hasCheckbox={isCheckbox.loans}
              id={loan.loanId}
              renderButton={
                <MaterialRowButton
                  buttonText={Translate({ context: "profile", label: "renew" })}
                />
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

      <section className={styles.section} ref={ordersWrapperRef}>
        <div className={styles.titleRow}>
          <Title type="title5" tag="h3">
            {Translate({ context: "profile", label: "orders" })}
          </Title>
          <Button
            type="secondary"
            size="small"
            onClick={() => {
              onDeleteSeveral();
              setIsCheckbox({ ...isCheckbox, orders: !isCheckbox.orders });
            }}
          >
            {Translate({ context: "profile", label: "delete-more" })}
          </Button>
        </div>

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
              hasCheckbox={isCheckbox.orders}
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
                <MaterialRowButton
                  buttonText={Translate({
                    context: "profile",
                    label: "delete",
                  })}
                />
              }
            />
          );
        })}
      </section>
    </ProfileLayout>
  );
};

export default LoansAndReservations;
