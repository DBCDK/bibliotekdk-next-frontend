import useUser from "@/components/hooks/useUser";
import MaterialRow from "../bookRow/MaterialRow";
import Title from "@/components/base/title";
import Button from "@/components/base/button/Button";
import styles from "./LoansAndReservations.module.css";

const reduceLoan = () => {};

export default ({}) => {
  const { loans } = useUser();
  console.log(loans);
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
          <Button type="secondary" size="small">
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
          />
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.titleRow}>
          <Title type="title5" tag="h3">
            Reserveringer
          </Title>
          <Button type="secondary" size="small">
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
