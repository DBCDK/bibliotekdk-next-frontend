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
function TableItem({ name, agencyId }) {
  const isHomeLibrary = false; // Cannot be implemented yet
  //const lastUsed = false; // Cannot be implemented yet
  const isPublic = isPublicLibrary(agencyId);
  const type = isPublic
    ? Translate({ context: "profile", label: "publicLibrary" })
    : Translate({ context: "profile", label: "academicLibrary" });
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

      {/*TODO: use when bopælskommune is implemented
        <div>
          <Title type="title5"> {agencyName || "-"}</Title>
          {lastUsed && (
            <Text type="text3" className={styles.textLabel}>
              {Translate({ context: "profile", label: "lastUsed" })}
            </Text>
          )}
        </div>
      */}

      <Text type="text2">{type}</Text>
      {!isPublic && (
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
        <Text className={styles.headerItem}>
          {Translate({ context: "profile", label: "libraries" })}
        </Text>
        <Text className={styles.headerItem}>
          {Translate({ context: "profile", label: "libraryType" })}
        </Text>
      </div>
      <div className={styles.tableContainer}>
        {data?.map((item) => (
          <TableItem key={item.agencyName} {...item} />
        ))}
      </div>
    </>
  );
}

/**
 *
 * @param {*} agencyID
 * @returns returns true if public library (Folkebibliotek)
 */
const isPublicLibrary = (agencyID) => {
  const faroIslandsLibraries = ["900455", "911116", "911130"];
  return agencyID?.charAt(0) === "7" || faroIslandsLibraries.includes(agencyID);
};
