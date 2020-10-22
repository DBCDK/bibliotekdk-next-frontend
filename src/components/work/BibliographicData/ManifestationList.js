/**
 * @file Template for showing a manifestation in list form
 */
import Text from "../../base/text";
import { Col } from "react-bootstrap";
import Icon from "../../base/icon/Icon";
import React from "react";
import styles from "./BibliographicData.module.css";

export function ManifestationList({ manifestation = null }) {
  let icon = manifestation.open ? "iconminuswhite.svg" : "iconpluswhite.svg";
  let importedStyles = { float: "right" };

  return (
    <Col key={manifestation.materialType} xs={12} md className={styles.right}>
      <Text type="text3" lines={4}>
        {manifestation.materialType}
      </Text>
      <Icon size={2} bgColor="var(--blue)" src={icon} />
    </Col>
  );
}
