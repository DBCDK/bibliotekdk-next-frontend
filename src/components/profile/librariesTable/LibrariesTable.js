import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import IconButton from "@/components/base/iconButton/IconButton";
import styles from "./LibrariesTable.module.css";
import Title from "@/components/base/title";

/**
 * Tablerow to be used in LibrariesTable component.
 * @param {obj} props
 * @returns {component}
 */
function TableItem({ name, agencyName, type }) {
  const isHomeLibrary = false; // Cannot be implemented yet
  const lastUsed = false; // Cannot be implemented yet
  type = type || "Folkebibliotek"; //mock

  return (
    <div className={styles.tableItem}>
      <div>
        <Title type="title5"> {name || "-"}</Title>
        {isHomeLibrary && (
          <Text type="text3" className={styles.textLabel}>
            {Translate({
              context: "profile",
              label: "municipalityOfResidence",
            })}
          </Text>
        )}
      </div>

      {false && (
        <div>
          <Title type="title5"> {agencyName || "-"}</Title>
          {lastUsed && (
            <Text type="text3" className={styles.textLabel}>
              {Translate({ context: "profile", label: "lastUsed" })}
            </Text>
          )}
        </div>
      )}

      <Text type="text2">{type || "-"}</Text>
      {/**todo: find Forskningsbibliotek in a different way */}
      {type == "Forskningsbibliotek" && (
        <IconButton
          className={styles.closeButton}
          icon="close"
          alt={Translate({ context: "profile", label: "remove" })}
        >
          {Translate({ context: "profile", label: "remove" })}
        </IconButton>
      )}
    </div>
  );
}

/**
 * Returns a table of users libraries
 * @param {obj} props
 * @returns {component}
 */
export default function LibrariesTable({ data }) {
  return (
    <>
      <div className={styles.headerRow}>
        <Text className={styles.headerItem}>Biblioteker</Text>
        <Text className={styles.headerItem}>Bibliotekstype</Text>
      </div>
      <div className={styles.tableContainer}>
        {data?.map((item) => (
          <TableItem
            key={item.agencyName}
            agencyName={item.agencyName}
            name={item.name}
            type={getLibraryType(item.agencyId)}
          />
        ))}
      </div>
    </>
  );
}

/**
 *
 * @param {*} agencyID
 * @returns type of library based on agencyID.
 */
const getLibraryType = (agencyID) => {
  const faroIslandLibraries = ["900455", "911116", "911130"];
  if (agencyID?.charAt(0) === "7" || faroIslandLibraries.includes(agencyID)) {
    return "Folkebibliotek";
  } else {
    return "Forskningsbibliotek";
  }
};
