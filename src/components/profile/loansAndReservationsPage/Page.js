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
import {
  arangeLoanerInfo,
  sortLoans,
  sortOrders,
} from "@/lib/userdataFactoryUtils";
import Link from "@/components/base/link";
import { useEffect, useState } from "react";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import {
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";

const SKELETON_ROW_AMOUNT = 2;

export const dataReducer = (dataType, data) => {
  const { flatMaterialTypes: flatMaterialTypesArray } =
    manifestationMaterialTypeFactory([data?.manifestation]);

  const flatMaterialTypes = flatMaterialTypesArray?.[0];

  const materialTypesPresentation =
    formatMaterialTypesToPresentation(flatMaterialTypes);

  switch (dataType) {
    case "DEBT": {
      return {
        type: "DEBT",
        amount: data?.amount,
        title: data?.title,
        titles: data?.manifestation?.titles,
        currency: data?.currency,
      };
    }
    case "LOAN": {
      //fjernlån loans dont have manifestation
      return {
        type: "LOAN",
        image: data?.manifestation?.cover?.thumbnail,
        title: data?.manifestation?.titles?.main?.[0] || data?.title,
        titles: data?.manifestation?.titles,
        creator:
          extractCreatorsPrioritiseCorporation(
            data?.manifestation?.creators
          )?.[0]?.display || data?.creator,
        creators: data?.manifestation?.creators,
        materialType: materialTypesPresentation,
        flatMaterialTypes: flatMaterialTypes,
        creationYear: data?.manifestation?.recordCreationDate?.substring(0, 4),
        dueDateString: data?.dueDate,
        id: data?.loanId,
        pid: data?.manifestation?.pid,
        workId: data?.manifestation?.ownerWork?.workId,
      };
    }
    case "ORDER": {
      //fjernlån orders dont have manifestation
      return {
        type: "ORDER",
        image: data?.manifestation?.cover?.thumbnail,
        title: data?.manifestation?.titles?.main?.[0] || data?.title,
        titles: data?.manifestation?.titles,
        creator:
          extractCreatorsPrioritiseCorporation(
            data?.manifestation?.creators
          )?.[0]?.display || data?.creator,
        creators: data?.manifestation?.creators,
        materialType: materialTypesPresentation,
        flatMaterialTypes: flatMaterialTypes,
        creationYear: data?.manifestation?.recordCreationDate?.substring(0, 4),
        library: data?.pickUpBranch?.agencyName,
        agencyId: data?.agencyId,
        holdQueuePosition: data?.holdQueuePosition,
        pickUpExpiryDate: data?.pickUpExpiryDate,
        id: data?.orderId,
        workId: data?.manifestation?.ownerWork?.workId,
        orderMutation: data?.orderMutation,
      };
    }
  }
};

const LoansAndReservations = () => {
  const breakpoint = useBreakpoint();
  const isMobileSize =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";
  const { loanerInfo, isLoading: basicUserIsLoading } = useLoanerInfo();

  const loansIsLoading = basicUserIsLoading || loanerInfo?.loans?.isLoading;
  const debtsIsLoading = basicUserIsLoading || loanerInfo?.debts?.isLoading;
  const ordersIsLoading = basicUserIsLoading || loanerInfo?.orders?.isLoading;

  const isLoading = loansIsLoading || debtsIsLoading || ordersIsLoading;

  const { debt, agencies, loans } = arangeLoanerInfo(loanerInfo);

  // handle orders for themselves
  const orders = loanerInfo?.orders?.orders;
  const [removedOrderId, setRemovedOrderId] = useState("");
  const [orderList, setOrderList] = useState([]);

  const onRemoveOrderId = (orderid) => {
    setRemovedOrderId(orderid);
    // we remove the order from the ui instantly
    const updatedOrderList = orderList.filter(
      (order) => order.orderId !== orderid
    );
    setOrderList(sortOrders(updatedOrderList));
  };

  useEffect(() => {
    //after deletion we fetch the orders and override the local state.
    if (Array.isArray(orders)) {
      setOrderList(orders);
    }
  }, [orders]);

  function getAgencyString(agencyId) {
    if (!agencies) return "";
    return agencies.map((agency) => {
      if (agency.result[0].agencyId === agencyId)
        return agency.result[0].agencyName;
    });
  }

  return (
    <ProfileLayout
      title={Translate({ context: "profile", label: "loansAndReservations" })}
    >
      <Text type="text3" className={styles.subHeading}>
        {Translate({ context: "profile", label: "loans-subtext" })}{" "}
        <Link
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
      {debt && debt?.debt?.length !== 0 && (
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
                {debt?.debt?.length})
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
            className={styles.debtHeader}
            column1={Translate({ context: "profile", label: "price" })}
            column2={Translate({ context: "profile", label: "loaner-library" })}
            column3={Translate({ context: "profile", label: "material" })}
          />

          {debtsIsLoading
            ? [...Array(SKELETON_ROW_AMOUNT).keys()].map((_, i) => (
                <MaterialRow
                  skeleton
                  key={`loan-#${i}`}
                  id={`loan-#${i}`}
                  title=""
                  library=""
                />
              ))
            : debt?.debt?.map((claim, i) => (
                <MaterialRow
                  {...dataReducer("DEBT", claim)}
                  key={`debt-${claim.title}-#${i}`}
                  library={getAgencyString(claim.agencyId)}
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
              {loans?.loans?.length})
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
        {loansIsLoading ? (
          [...Array(SKELETON_ROW_AMOUNT).keys()].map((_, i) => (
            <MaterialRow
              skeleton
              key={`loan-#${i}`}
              id={`loan-#${i}`}
              title=""
              library=""
            />
          ))
        ) : loans?.loans && loans?.loans?.length !== 0 ? (
          sortLoans(loans.loans).map((loan, i) => (
            <MaterialRow
              {...dataReducer("LOAN", loan)}
              key={`loan-${loan.loanId}-#${i}`}
              library={getAgencyString(loan.agencyId)}
              agencyId={loan.agencyId}
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
              {orderList?.length})
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
        {ordersIsLoading ? (
          [...Array(SKELETON_ROW_AMOUNT).keys()].map((_, i) => (
            <MaterialRow
              skeleton
              key={`loan-#${i}`}
              id={`loan-#${i}`}
              title=""
              library=""
            />
          ))
        ) : orderList && orderList.length !== 0 ? (
          orderList.map((order, i) => {
            // Log the agencyId before passing it to the MaterialRow component
            return (
              <MaterialRow
                {...dataReducer("ORDER", {
                  ...order,
                  agencyId: order.pickUpBranch.agencyId,
                })}
                removedOrderId={removedOrderId}
                setRemovedOrderId={onRemoveOrderId}
                key={`loan-${order.loanId}-#${i}`}
                dataCy={`order-${i}`}
              />
            );
          })
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
