import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Title } from "@/components/base/title/Title";
import Translate from "@/components/base/translate/Translate";
import Button from "@/components/base/button";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon/Icon";
import animations from "@/components/base/animation/animations.module.css";
import ClearSvg from "@/public/icons/close.svg";
import {Close} from "@/components/_modal/pages/base/top";

import styles from "./LibrariesTable.module.css";

function TableItem({ agency, libraryName, type }) {
  const showRemoveButton = type === "Uddannelsesbibliotek1";
  return (
    <div className={styles.tableItem}>
      <Text type="text1"> {libraryName || "-"}</Text>
      <Text type="text2">{agency || "-"}</Text>
      <Text type="text2">{type || "-"}</Text>
      <Close />
      {showRemoveButton && (
        <div className={styles.removeButton}>
          <Text>Fjern</Text>
          {/**TODO: Use Icon instead?  */}
          <ClearSvg className={styles.removeButtonIcon} />
        </div>
      )}
    </div>
  );
}

/**
 * Layout to use in /profil subpages
 * Renders a side menu on left side and children on right side
 *
 * @returns {JSX.Element}
 */
export default function LibrariesTable({ mockData }) {
  return (
    <Row className={styles.tableContainer}>
      {/**replace with side menu: */}
      {mockData.map((item) => (
        <TableItem
          agency={item.agency}
          libraryName={item.libraryName}
          type={item.type}
        />
      ))}
    </Row>
  );
}
