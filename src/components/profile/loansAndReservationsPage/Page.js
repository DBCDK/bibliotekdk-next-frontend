import useUser from "@/components/hooks/useUser";
import MaterialRow, { MaterialHeaderRow } from "../materialRow/MaterialRow";
import Title from "@/components/base/title";
import styles from "./LoansAndReservations.module.css";
import Translate from "@/components/base/translate";
import ProfileLayout from "../profileLayout";
import Text from "@/components/base/text";
import { encodeString, extractCreatorPrioritiseCorporation } from "@/lib/utils";
import useBreakpoint from "@/components/hooks/useBreakpoint";

export const dataReducer = (dataType, data) => {
  switch (dataType) {
    case "DEBT": {
      return {
        type: "DEBT",
        amount: data.amount,
        title: data.title,
        currency: data.currency,
      };
    }
    case "LOAN": {
      return {
        type: "LOAN",
        image: data.manifestation.cover.thumbnail,
        title: data.manifestation.titles.main[0],
        creator: extractCreatorPrioritiseCorporation(
          data.manifestation.creators
        )?.[0]?.display,
        creators: data.manifestation.creators,
        materialType: data.manifestation.materialTypes[0].specific,
        creationYear: data.manifestation.recordCreationDate.substring(0, 4),
        dueDateString: data.dueDate,
        id: data.loanId,
        workId: "work-of:" + data.manifestation.pid,
      };
    }
    case "ORDER": {
      if (!data.manifestation) {
        // Under process?
      }
      return {
        type: "ORDER",
        image: data.manifestation.cover.thumbnail,
        title: data.manifestation.titles.main[0],
        creator: extractCreatorPrioritiseCorporation(
          data.manifestation.creators
        )?.[0]?.display,
        creators: data.manifestation.creators,
        materialType: data.manifestation.materialTypes[0].specific,
        creationYear: data.manifestation.recordCreationDate.substring(0, 4),
        library: data.pickUpBranch.agencyName,
        holdQueuePosition: data.holdQueuePosition,
        pickUpExpiryDate: data.pickUpExpiryDate,
        id: data.orderId,
        workId: "work-of:" + data.manifestation.pid,
      };
    }
  }
};

const sortLoans = (loans) => {
  if (!loans) {
    return loans;
  }

  loans.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return dateA - dateB;
  });

  return loans;
};

const sortOrders = (orders) => {
  if (!orders) {
    return orders;
  }

  orders.sort((a, b) => {
    if (a.pickUpExpiryDate === null && b.pickUpExpiryDate === null) {
      // If both items have null pickUpExpiryDate, sort based on holdQueuePosition
      return Number(a.holdQueuePosition) - Number(b.holdQueuePosition);
    } else if (a.pickUpExpiryDate === null) {
      // If only item a has null pickUpExpiryDate, put it after item b
      return 1;
    } else if (b.pickUpExpiryDate === null) {
      // If only item b has null pickUpExpiryDate, put it after item a
      return -1;
    } else {
      // Both items have pickUpExpiryDate set, sort based on the date
      const dateA = new Date(a.pickUpExpiryDate);
      const dateB = new Date(b.pickUpExpiryDate);
      return dateA - dateB;
    }
  });

  return orders;
};

const LoansAndReservations = () => {
  const breakpoint = useBreakpoint();
  const isMobileSize =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";
  const { loanerInfo } = useUser();
  const { debt, agency } = loanerInfo;
  let { orders, loans } = loanerInfo;
  const libraryString =
    agency && agency.result ? agency.result[0].agencyName : "";
  orders = sortOrders(orders);
  loans = sortLoans(loans);

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

      {debt && debt.length !== 0 && (
        <section className={styles.section}>
          <div className={styles.titleRow}>
            {isMobileSize ? (
              <Title
                type="title6b"
                tag="h2"
                id={`sublink-${encodeString(
                  Translate({
                    context: "profile",
                    label: "debt",
                    requestedLang: "da",
                  })
                )}`}
              >
                {Translate({ context: "profile", label: "debt" })} (
                {debt?.length})
              </Title>
            ) : (
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
            )}
          </div>
          <MaterialHeaderRow
            column1={Translate({ context: "profile", label: "material" })}
            column2={Translate({ context: "profile", label: "price" })}
            column3={Translate({ context: "profile", label: "loaner-library" })}
          />
          {debt?.map((claim, i) => (
            <MaterialRow
              {...dataReducer("DEBT", claim)}
              key={`debt-${claim.title}-#${i}`}
              library={libraryString}
              id={`debt-${i}`}
            />
          ))}
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.titleRow}>
          {isMobileSize ? (
            <Title
              type="title6b"
              tag="h2"
              id={`sublink-${encodeString(
                Translate({
                  context: "profile",
                  label: "loans",
                  requestedLang: "da",
                })
              )}`}
            >
              {Translate({ context: "profile", label: "loans" })} (
              {loans?.length})
            </Title>
          ) : (
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
          )}
        </div>

        <MaterialHeaderRow
          column1={Translate({ context: "profile", label: "material" })}
          column2={Translate({ context: "profile", label: "return-deadline" })}
          column3={Translate({ context: "profile", label: "loaner-library" })}
        />
        {loans && loans.length !== 0 ? (
          loans?.map((loan, i) => (
            <MaterialRow
              {...dataReducer("LOAN", loan)}
              key={`loan-${loan.loanId}-#${i}`}
              library={libraryString}
            />
          ))
        ) : (
          <Text className={styles.emptyMessage} type="text2">
            {Translate({
              context: "profile",
              label: "no-results-loans",
            })}
          </Text>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.titleRow}>
          {isMobileSize ? (
            <Title
              type="title6b"
              tag="h2"
              id={`sublink-${encodeString(
                Translate({
                  context: "profile",
                  label: "orders",
                  requestedLang: "da",
                })
              )}`}
            >
              {Translate({ context: "profile", label: "orders" })} (
              {orders?.length})
            </Title>
          ) : (
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
          )}
        </div>

        <MaterialHeaderRow
          column1={Translate({ context: "profile", label: "material" })}
          column2={Translate({ context: "profile", label: "status" })}
          column3={Translate({ context: "profile", label: "pickup-at" })}
        />
        {orders && orders.length !== 0 ? (
          orders?.map((order, i) => (
            <MaterialRow
              {...dataReducer("ORDER", order)}
              key={`loan-${order.loanId}-#${i}`}
            />
          ))
        ) : (
          <Text className={styles.emptyMessage} type="text2">
            {Translate({
              context: "profile",
              label: "no-results-orders",
            })}
          </Text>
        )}
      </section>
    </ProfileLayout>
  );
};

export default LoansAndReservations;
