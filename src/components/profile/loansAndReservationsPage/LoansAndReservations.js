import useUser from "@/components/hooks/useUser";
import MaterialRow from "../materialRow/MaterialRow";
import Title from "@/components/base/title";
import Button from "@/components/base/button/Button";
import styles from "./LoansAndReservations.module.css";
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
            Mellemværende
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
            Lån
          </Title>
          <Button
            type="secondary"
            size="small"
            onClick={() =>
              setIsCheckbox({ ...isCheckbox, loans: !isCheckbox.loans })
            }
          >
            Forny flere
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
            buttonText="Forny"
            hasCheckbox={isCheckbox.loans}
            id={loan.loanId}
          />
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.titleRow}>
          <Title type="title5" tag="h3">
            Reserveringer
          </Title>
          <Button
            type="secondary"
            size="small"
            onClick={() =>
              setIsCheckbox({ ...isCheckbox, orders: !isCheckbox.orders })
            }
          >
            Slet flere
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
            buttonText="Slet"
          />
        ))}
      </section>
    </>
  );
};
