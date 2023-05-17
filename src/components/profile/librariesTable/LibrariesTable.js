import Row from "react-bootstrap/Row";
import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";

import IconButton from "@/components/base/iconButton/IconButton";
import styles from "./LibrariesTable.module.css";

function TableItem({ agency, libraryName, type }) {
  const isHomeLibrary = "Herlev bibliotek" == libraryName; //Mock. Use real data
  const lastUsed = "Biblioteket Danasvej" == agency; //Mock. Use real data

  return (
    <div className={styles.tableItem}>
      <div>
        <Text type="text1"> {libraryName || "-"}</Text>
        {isHomeLibrary && (
          <Text type="text3" className={styles.textLabel}>
            {Translate({
              context: "profile",
              label: "municipalityOfResidence",
            })}
          </Text>
        )}
      </div>

      <div>
        <Text type="text2"> {agency || "-"}</Text>
        {lastUsed && (
          <Text type="text3" className={styles.textLabel}>
            {Translate({ context: "profile", label: "lastUsed" })}
          </Text>
        )}
      </div>

      <Text type="text2">{type || "-"}</Text>
      <IconButton
        className={styles.closeButton}
        icon="close"
        alt={Translate({ context: "profile", label: "remove" })}
      >
        {Translate({ context: "profile", label: "remove" })}
      </IconButton>
    </div>
  );
}

/**
 * Layout to use in /profil subpages
 * Renders a side menu on left side and children on right side
 *
 * @returns {JSX.Element}
 */
export default function LibrariesTable({ data }) {
  return (
    <>
      <Row className={styles.tableContainer}>
        {data?.map((item) => (
          <TableItem
            key={item.agency}
            agency={item.agency}
            libraryName={item.libraryName}
            type={item.type}
          />
        ))}
      </Row>
    </>
  );
}
