import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import IconButton from "@/components/base/iconButton/IconButton";
import styles from "./LibrariesTable.module.css";
import Title from "@/components/base/title";
import useBreakpoint from "@/components/hooks/useBreakpoint";

/**
 * Tablerow to be used in LibrariesTable component.
 * @param {Object} props
 * @returns {component}
 */
function TableItem({ agencyName, agencyId, municipalityAgencyId }) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs";
  const isHomeLibrary = municipalityAgencyId === agencyId;
  //const lastUsed = false; // Cannot be implemented yet
  const isPublic = isPublicLibrary(agencyId);

  const type = Translate({
    context: "profile",
    label: isPublic ? "publicLibrary" : "academicLibrary",
  });

  if (isMobile) {
    return (
      <div className={styles.tableItem}>
        <div className={styles.libraryInfo}>
          <div>
            <Title type="title6">{agencyName || "-"}</Title>
            <Text type="text2">{type}</Text>

            {isHomeLibrary && (
              <Text type="text3" className={styles.municipalityOfResidence}>
                {Translate({
                  context: "profile",
                  label: "municipalityOfResidence",
                })}
              </Text>
            )}
          </div>

          {/*TODO: use when lastUsed is implemented
        <div>
          <Title type="title5"> {agencyName || "-"}</Title>
          {lastUsed && (
            <Text type="text3" className={styles.textLabel}>
              {Translate({ context: "profile", label: "lastUsed" })}
            </Text>
          )}
        </div>
      */}
        </div>

        {!isPublic && (
          <IconButton
            icon="close"
            alt={Translate({ context: "profile", label: "remove" })}
          >
            {Translate({ context: "profile", label: "remove" })}
          </IconButton>
        )}
      </div>
    );
  }
  return (
    <tr className={styles.tableItem}>
      <div className={styles.libraryInfo}>
        <td>
          <Title type="title5">{agencyName || "-"}</Title>
          {isHomeLibrary && (
            <Text type="text3">
              {Translate({
                context: "profile",
                label: "municipalityOfResidence",
              })}
            </Text>
          )}
        </td>
        <td>
          <Text type="text2">{type}</Text>
        </td>
      </div>
      {!isPublic && (
        <td>
          <IconButton
            icon="close"
            alt={Translate({ context: "profile", label: "remove" })}
          >
            {Translate({ context: "profile", label: "remove" })}
          </IconButton>
        </td>
      )}
    </tr>
  );
}

/**
 * Returns a table of users libraries
 * @param {Object} props
 * @returns {component}
 */
export default function LibrariesTable({ data, municipalityAgencyId }) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs";

  if (isMobile) {
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
        <div>
          {data?.map((item) => (
            <TableItem
              key={item.agencyName}
              municipalityAgencyId={municipalityAgencyId}
              {...item}
            />
          ))}
        </div>
      </>
    );
  }
  return (
    <table className={styles.librariesTable}>
      <thead>
        <tr className={styles.headerRow}>
          <th className={styles.headerItem}>
            <Text>{Translate({ context: "profile", label: "libraries" })}</Text>
          </th>
          <th className={styles.headerItem}>
            <Text>
              {Translate({ context: "profile", label: "libraryType" })}
            </Text>
          </th>
        </tr>
      </thead>
      <tbody>
        {data?.map((item) => (
          <TableItem
            key={item.agencyName}
            municipalityAgencyId={municipalityAgencyId}
            {...item}
          />
        ))}
      </tbody>
    </table>
  );
}

/**
 *
 * @param {*} agencyID
 * @returns returns true if public library (Folkebibliotek)
 */
const isPublicLibrary = (agencyID) => {
  const faroeIslandsLibraries = ["900455", "911116", "911130"];
  const parsedID = agencyID + "";
  return (
    parsedID?.charAt(0) === "7" || faroeIslandsLibraries.includes(parsedID)
  );
};
