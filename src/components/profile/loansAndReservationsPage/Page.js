import useUser from "@/components/hooks/useUser";
import MaterialRow, { MaterialRowButton } from "../materialRow/MaterialRow";
import Title from "@/components/base/title";
import Button from "@/components/base/button/Button";
import styles from "./LoansAndReservations.module.css";
import Translate from "@/components/base/translate";
import { useRef, useState } from "react";
import ProfileLayout from "../profileLayout";
import Text from "@/components/base/text";
import { encodeString } from "@/lib/utils";

/**
 * TODO
 * -----
 * Dates
 * Status
 * Dept data ✓
 * Better mock data (different books)
 * checkbox focus style ✓
 * checkbox hover style ✓
 * action placeholders ✓
 * data reducer (material row)
 * Material row standalone mock
 * Last border on link
 * Image height
 */

const getCheckedElements = (parentRef) => {
  const elements = [].slice.call(parentRef.current.children);
  const checkedElements = elements
    .filter((element) => element.ariaChecked === "true")
    .map((element) => element.getAttribute("data-id"));
  return checkedElements;
};

const LoansAndReservations = ({}) => {
  const { loanerInfo } = useUser();
  const { loans, orders } = loanerInfo;
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
          <Title
            type="title5"
            tag="h3"
            id={encodeString(
              Translate({
                context: "profile",
                label: "debt",
                requestedLang: "da",
              })
            )}
          >
            {Translate({ context: "profile", label: "debt" })}
          </Title>
        </div>

        {loans?.map((loan) => (
          <MaterialRow
            key={loan.loanId}
            image={loan.manifestation.cover.thumbnail}
            title={loan.manifestation.titles.main[0]}
            creator={loan.manifestation.creators[0].display}
            materialType={loan.manifestation.materialTypes[0].specific}
            creationYear={loan.manifestation.recordCreationDate.substring(0, 4)}
            library={"Herlev bibliotek"}
          />
        ))}
      </section>

      <section className={styles.section} ref={loansWrapperRef}>
        <div className={styles.titleRow}>
          <Title
            type="title5"
            tag="h3"
            id={encodeString(
              Translate({
                context: "profile",
                label: "loans",
                requestedLang: "da",
              })
            )}
          >
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

        {loans?.map((loan, i) => (
          <MaterialRow
            key={`loan-${loan.loanId}-#${i}`}
            image={loan.manifestation.cover.thumbnail}
            title={loan.manifestation.titles.main[0]}
            creator={loan.manifestation.creators[0].display}
            materialType={loan.manifestation.materialTypes[0].specific}
            creationYear={loan.manifestation.recordCreationDate.substring(0, 4)}
            library={"Herlev bibliotek"}
            hasCheckbox={isCheckbox.loans}
            id={loan.loanId}
            renderButton={
              <MaterialRowButton
                buttonText={Translate({ context: "profile", label: "renew" })}
              />
            }
          />
        ))}
      </section>

      <section className={styles.section} ref={ordersWrapperRef}>
        <div className={styles.titleRow}>
          <Title
            type="title5"
            tag="h3"
            id={encodeString(
              Translate({
                context: "profile",
                label: "orders",
                requestedLang: "da",
              })
            )}
          >
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

        {orders?.map((order, i) => (
          <MaterialRow
            key={`loan-${order.loanId}-#${i}`}
            image={order.manifestation.cover.thumbnail}
            title={order.manifestation.titles.main[0]}
            creator={order.manifestation.creators[0].display}
            materialType={order.manifestation.materialTypes[0].specific}
            creationYear={order.manifestation.recordCreationDate.substring(
              0,
              4
            )}
            library={order.pickupBranch.agencyName}
            hasCheckbox={isCheckbox.orders}
            id={order.orderId}
            renderButton={
              <MaterialRowButton
                buttonText={Translate({ context: "profile", label: "delete" })}
              />
            }
          />
        ))}
      </section>
    </ProfileLayout>
  );
};

export default LoansAndReservations;
