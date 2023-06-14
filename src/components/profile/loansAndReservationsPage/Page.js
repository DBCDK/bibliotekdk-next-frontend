import useUser from "@/components/hooks/useUser";
import MaterialRow, { MaterialHeaderRow } from "../materialRow/MaterialRow";
import Title from "@/components/base/title";
import styles from "./LoansAndReservations.module.css";
import Translate from "@/components/base/translate";
import ProfileLayout from "../profileLayout";
import Text from "@/components/base/text";
import { encodeString } from "@/lib/utils";
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
        creator: data.manifestation.creators[0].display,
        materialType: data.manifestation.materialTypes[0].specific,
        creationYear: data.manifestation.recordCreationDate.substring(0, 4),
        dueDateString: data.dueDate,
        id: data.loanId,
        workId: "work-of:" + data.manifestation.pid,
      };
    }
    case "ORDER": {
      return {
        type: "ORDER",
        image: data.manifestation.cover.thumbnail,
        title: data.manifestation.titles.main[0],
        creator: data.manifestation.creators[0].display,
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

const LoansAndReservations = () => {
  const breakpoint = useBreakpoint();
  const isMobileSize =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";
  const { loanerInfo } = useUser();
  const { loans, orders, debt, agency } = loanerInfo;
  const libraryString =
    agency && agency.result ? agency.result[0].agencyName : "";

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
              {Translate({ context: "profile", label: "debt" })} ({debt?.length}
              )
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
        {debt && debt.length !== 0 ? (
          debt?.map((claim, i) => (
            <MaterialRow
              {...dataReducer("DEBT", claim)}
              key={`debt-${claim.title}-#${i}`}
              library={libraryString}
              id={`debt-${i}`}
            />
          ))
        ) : (
          <Text className={styles.emptyMessage} type="text2">
            {Translate({
              context: "profile",
              label: "no-results-debts",
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
