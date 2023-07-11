import useUser from "@/components/hooks/useUser";
import MaterialRow, { MaterialHeaderRow } from "../materialRow/MaterialRow";
import Title from "@/components/base/title";
import styles from "./LoansAndReservations.module.css";
import Translate from "@/components/base/translate";
import ProfileLayout from "../profileLayout";
import Text from "@/components/base/text";
import {
  encodeString,
  extractCreatorsPrioritiseCorporation,
} from "@/lib/utils";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { arangeLoanerInfo } from "@/lib/userdataFactoryUtils";
import Link from "@/components/base/link";
import { useState } from "react";

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
      if (!data.manifestation) {
        // No manifestation - we show what we can
        return {
          type: "LOAN",
          image: null,
          title: null,
          creator: null,
          materialType: null,
          creationYear: null,
          dueDateString: data.dueDate,
          id: data.loanId,
          workId: "work-of:" + null,
        };
      }
      return {
        type: "LOAN",
        image: data.manifestation.cover.thumbnail,
        title: data.manifestation.titles.main[0],
        creator: extractCreatorsPrioritiseCorporation(
          data.manifestation.creators
        )?.[0]?.display,
        materialType: data.manifestation.materialTypes[0].specific,
        creationYear: data.manifestation.recordCreationDate.substring(0, 4),
        dueDateString: data.dueDate,
        id: data.loanId,
        workId: "work-of:" + data.manifestation.pid,
      };
    }
    case "ORDER": {
      if (!data.manifestation) {
        // No manifestation - we show what we can
        return {
          type: "ORDER",
          image: null,
          title: data.title,
          creator: data.creator,
          creators: null,
          materialType: null,
          creationYear: null,
          library: data.pickUpBranch.agencyName,
          holdQueuePosition: data.holdQueuePosition,
          pickUpExpiryDate: data.pickUpExpiryDate,
          id: data.orderId,
          workId: "work-of:" + null,
        };
      }
      return {
        type: "ORDER",
        image: data.manifestation.cover.thumbnail,
        title: data.manifestation.titles.main[0],
        creator: extractCreatorsPrioritiseCorporation(
          data.manifestation.creators
        )?.[0]?.display,
        materialType: data.manifestation.materialTypes[0].specific,
        creationYear: data.manifestation.recordCreationDate.substring(0, 4),
        library: data.pickUpBranch.agencyName,
        agencyId: data.libraryId,
        holdQueuePosition: data.holdQueuePosition,
        pickUpExpiryDate: data.pickUpExpiryDate,
        id: data.orderId,
        workId: "work-of:" + data.manifestation.pid,
        orderMutation: data.orderMutation,
      };
    }
  }
};

const LoansAndReservations = () => {
  const breakpoint = useBreakpoint();
  const isMobileSize =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";
  const { loanerInfo } = useUser();
  const { debt, agency, orders, loans } = arangeLoanerInfo(loanerInfo);
  const [removedOrderId, setRemovedOrderId] = useState("");
  const libraryString =
    agency && agency.result ? agency.result[0].agencyName : "";
  const libraryId = agency?.result?.[0]?.agencyId;

  return (
    <ProfileLayout
      title={Translate({ context: "profile", label: "loansAndReservations" })}
    >
      <Text type="text3" className={styles.subHeading}>
        {Translate({ context: "profile", label: "loans-subtext" })}{" "}
        <Link
          className={styles.yourLibraries}
          href="/profil/mine-biblioteker"
          border={{
            top: false,
            bottom: {
              keepVisible: true,
            },
          }}
        >
          {Translate({ context: "profile", label: "your-libraries" })}
        </Link>
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
              dataCy={`debt-${i}`}
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
              agencyId={libraryId}
              dataCy={`loan-${i}`}
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
              {...dataReducer("ORDER", {
                ...order,
                libraryId,
              })}
              removedOrderId={removedOrderId}
              setRemovedOrderId={setRemovedOrderId}
              key={`loan-${order.loanId}-#${i}`}
              dataCy={`order-${i}`}
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
