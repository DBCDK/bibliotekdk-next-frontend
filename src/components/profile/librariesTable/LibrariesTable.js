import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import IconButton from "@/components/base/iconButton/IconButton";
import styles from "./LibrariesTable.module.css";
import Title from "@/components/base/title";
import useBreakpoint from "@/components/hooks/useBreakpoint";

import { useModal } from "@/components/_modal";

function RemoveLibraryButton({ agencyId, agencyName }) {
  const modal = useModal();

  return (
    <IconButton
      icon="close"
      onClick={() => modal.push("removeLibrary", { agencyId, agencyName })}
      alt={Translate({ context: "profile", label: "remove" })}
    >
      {Translate({ context: "profile", label: "remove" })}
    </IconButton>
  );
}

/**
 * Tablerow to be used in LibrariesTable component.
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
function TableItem({ agencyName, agencyId, agencyType, municipalityAgencyId }) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs";
  const isHomeLibrary = municipalityAgencyId === agencyId;
  //const lastUsed = false; // Cannot be implemented yet
  const isFFUAgency = agencyType === "FORSKNINGSBIBLIOTEK";

  const type = Translate({
    context: "profile",
    label: isFFUAgency ? "academicLibrary" : "publicLibrary",
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

        {isFFUAgency && (
          <RemoveLibraryButton agencyId={agencyId} agencyName={agencyName} />
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
      {isFFUAgency && (
        <td>
          <RemoveLibraryButton agencyId={agencyId} agencyName={agencyName} />
        </td>
      )}
    </tr>
  );
}

/**
 * Returns a table of users libraries
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
export default function LibrariesTable({ data, municipalityAgencyId }) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs";

  if (isMobile) {
    return (
      <>
        <div className={styles.headerRow}>
          <Text className={styles.headerItem}>
            {Translate({ context: "profile", label: "library" })}
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
            <Text>{Translate({ context: "profile", label: "library" })}</Text>
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
