import useUser from "@/components/hooks/useUser";
import MaterialRow, { MaterialHeaderRow } from "../materialRow/MaterialRow";
import Title from "@/components/base/title";
import styles from "./LoansAndReservations.module.css";
import Translate from "@/components/base/translate";
import ProfileLayout from "../profileLayout";
import Text from "@/components/base/text";
import { encodeString, extractCreatorPrioritiseCorporation } from "@/lib/utils";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { useMutate } from "@/lib/api/api";

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
        image: data.manifestation?.cover.thumbnail,
        title: data.manifestation?.titles.main[0],
        creator: extractCreatorPrioritiseCorporation(
          data.manifestation?.creators
        )?.[0]?.display,
        materialType: data.manifestation?.materialTypes[0].specific,
        creationYear: data.manifestation?.recordCreationDate.substring(0, 4),
        dueDateString: data.dueDate,
        id: data.loanId,
        workId: "work-of:" + data.manifestation?.pid,
      };
    }
    case "ORDER": {
      return {
        type: "ORDER",
        image: data.manifestation?.cover.thumbnail,
        title: data.manifestation?.titles.main[0],
        creator: extractCreatorPrioritiseCorporation(
          data.manifestation?.creators
        )?.[0]?.display,
        materialType: data.manifestation?.materialTypes[0].specific,
        creationYear: data.manifestation?.recordCreationDate.substring(0, 4),
        library: data.pickUpBranch.agencyName,
        agencyId: data.libraryId,
        holdQueuePosition: data.holdQueuePosition,
        pickUpExpiryDate: data.pickUpExpiryDate,
        id: data.orderId,
        workId: "work-of:" + data.manifestation?.pid,
        orderMutation: data.orderMutation,
      };
    }
  }
};

const LoansAndReservations = () => {
  const breakpoint = useBreakpoint();
  const orderMutation = useMutate();
  const isMobileSize =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";
  const { loanerInfo } = useUser();
  const orders2 = [
    {
      creator: "Bech, Glenn",
      holdQueuePosition: "327",
      manifestation: {
        cover: {
          thumbnail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lo…=870970&source_id=150082&key=dbfc9fe50c64f4b6c0dc",
        },
        creators: [
          {
            display: "Glenn Bech (f. 1991-04-08)",
            nameSort: "bech glenn f 1991 04 08",
            roles: [],
          },
        ],
        materialTypes: [
          { specific: "Bog", type: "http://data.deichman.no/mediaType#Book" },
        ],
        ownerWork: { workId: "work-of:870970-basis:62937106" },
        pid: "870970-basis:62937106",
        recordCreationDate: "20220901",
        titles: { main: ["Jeg anerkender ikke længere jeres autoritet"] },
      },
      orderDate: "2023-05-24T12:17:51.000Z",
      orderId: "78190430",
      orderType: "normal",
      pickUpBranch: { agencyName: "Københavns Biblioteker" },
      pickUpExpiryDate: null,
      status: "ACTIVE",
      titles: {
        main: ["Jeg anerkender ikke længere jeres autoritet: manifest 1"],
      },
    },
    {
      creator: "Bech, Glenn",
      holdQueuePosition: "327",
      manifestation: {
        cover: {
          thumbnail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lo…=870970&source_id=150082&key=dbfc9fe50c64f4b6c0dc",
        },
        creators: [
          {
            display: "Glenn Bech (f. 1991-04-08)",
            nameSort: "bech glenn f 1991 04 08",
            roles: [],
          },
        ],
        materialTypes: [
          { specific: "Bog", type: "http://data.deichman.no/mediaType#Book" },
        ],
        ownerWork: { workId: "work-of:870970-basis:62937106" },
        pid: "870970-basis:62937106",
        recordCreationDate: "20220901",
        titles: { main: ["Jeg anerkender ikke længere jeres autoritet"] },
      },
      orderDate: "2023-05-24T12:17:51.000Z",
      orderId: "78190430",
      orderType: "normal",
      pickUpBranch: { agencyName: "Københavns Biblioteker" },
      pickUpExpiryDate: null,
      status: "ACTIVE",
      titles: {
        main: ["Buch 2"],
      },
    },
    {
      creator: "Bech, Glenn",
      holdQueuePosition: "327",
      manifestation: {
        cover: {
          thumbnail:
            "https://moreinfo.addi.dk/2.11/more_info_get.php?lo…=870970&source_id=150082&key=dbfc9fe50c64f4b6c0dc",
        },
        creators: [
          {
            display: "Glenn Bech (f. 1991-04-08)",
            nameSort: "bech glenn f 1991 04 08",
            roles: [],
          },
        ],
        materialTypes: [
          { specific: "Bog", type: "http://data.deichman.no/mediaType#Book" },
        ],
        ownerWork: { workId: "work-of:870970-basis:62937106" },
        pid: "870970-basis:62937106",
        recordCreationDate: "20220901",
        titles: { main: ["Jeg anerkender ikke længere jeres autoritet"] },
      },
      orderDate: "2023-05-24T12:17:51.000Z",
      orderId: "78190430",
      orderType: "normal",
      pickUpBranch: { agencyName: "Københavns Biblioteker" },
      pickUpExpiryDate: null,
      status: "ACTIVE",
      titles: {
        main: ["Buch 3"],
      },
    },
  ];

  const { loans, orders, debt, agency } = loanerInfo;
  const libraryString =
    agency && agency.result ? agency.result[0].agencyName : "";
  const libraryId = agency?.result?.[0]?.agencyId;

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
              {orders2?.length})
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
        {orders2 && orders2.length !== 0 ? (
          orders2?.map((order, i) => (
            <MaterialRow
              {...dataReducer("ORDER", { ...order, libraryId, orderMutation })}
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
