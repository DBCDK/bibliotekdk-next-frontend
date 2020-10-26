/**
 * @file Template for showing a manifestation in list form
 */
import Text from "../../base/text";
import Title from "../../base/title";
import { Col } from "react-bootstrap";
import Icon from "../../base/icon/Icon";
import React from "react";
import styles from "./BibliographicData.module.css";

export function ManifestationList({ manifestation = null }) {
  let icon = manifestation.open ? "iconminuswhite.svg" : "iconpluswhite.svg";
  return (
    <Col key={manifestation.materialType} xs={12} md className={styles.right}>
      <Title type="title4" className={styles.fontligth}>
        {manifestation.materialType}
      </Title>
      <Icon size={3} bgColor="var(--blue)" src={icon} />
    </Col>
  );
}
