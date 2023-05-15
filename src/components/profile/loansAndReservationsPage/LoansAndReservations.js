import useUser from "@/components/hooks/useUser";
import MaterialRow from "../materialRow/MaterialRow";
import Title from "@/components/base/title";
import Button from "@/components/base/button/Button";
import styles from "./LoansAndReservations.module.css";
import Translate from "@/components/base/translate";
import { useState } from "react";

export default ({}) => {
  const { loans } = useUser();
  const [isCheckbox, setIsCheckbox] = useState({
    depts: false,
    loans: false,
    orders: false,
  });

  return (
    <>
      <section className={styles.section}>
        <div className={styles.titleRow}>
          <Title type="title5" tag="h3">
            {Translate({ context: "profile", label: "dept" })}
          </Title>
        </div>

        {loans.map((loan) => (
          <MaterialRow
            key={loan.loanId}
            image={loan.manifestation.cover.thumbnail}
            title={loan.manifestation.titles.main[0]}
            creator={loan.manifestation.creators[0].display}
            materialType={loan.manifestation.materialTypes[0].specific}
            creationYear={loan.manifestation.recordCreationDate.substring(0, 3)}
            library={"Herlev bibliotek"}
          />
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.titleRow}>
          <Title type="title5" tag="h3">
            {Translate({ context: "profile", label: "loans" })}
          </Title>
          <Button
            type="secondary"
            size="small"
            onClick={() =>
              setIsCheckbox({ ...isCheckbox, loans: !isCheckbox.loans })
            }
          >
            {Translate({ context: "profile", label: "renew-more" })}
          </Button>
        </div>

        {loans.map((loan) => (
          <MaterialRow
            key={loan.loanId}
            image={loan.manifestation.cover.thumbnail}
            title={loan.manifestation.titles.main[0]}
            creator={loan.manifestation.creators[0].display}
            materialType={loan.manifestation.materialTypes[0].specific}
            creationYear={loan.manifestation.recordCreationDate.substring(0, 3)}
            library={"Herlev bibliotek"}
            buttonText={Translate({ context: "profile", label: "renew" })}
            hasCheckbox={isCheckbox.loans}
            id={loan.loanId}
          />
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.titleRow}>
          <Title type="title5" tag="h3">
            {Translate({ context: "profile", label: "orders" })}
          </Title>
          <Button
            type="secondary"
            size="small"
            onClick={() =>
              setIsCheckbox({ ...isCheckbox, orders: !isCheckbox.orders })
            }
          >
            {Translate({ context: "profile", label: "delete-more" })}
          </Button>
        </div>

        {loans.map((loan) => (
          <MaterialRow
            key={loan.loanId}
            image={loan.manifestation.cover.thumbnail}
            title={loan.manifestation.titles.main[0]}
            creator={loan.manifestation.creators[0].display}
            materialType={loan.manifestation.materialTypes[0].specific}
            creationYear={loan.manifestation.recordCreationDate.substring(0, 3)}
            library={"Herlev bibliotek"}
            buttonText={Translate({ context: "profile", label: "delete" })}
          />
        ))}
      </section>
    </>
  );
};
