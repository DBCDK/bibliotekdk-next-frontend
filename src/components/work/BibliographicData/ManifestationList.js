/**
 * @file Template for showing a manifestation in list form
 */
import Title from "../../base/title";
import { Col } from "react-bootstrap";
import Icon from "../../base/icon/Icon";
import React from "react";
import styles from "./BibliographicData.module.css";

function ExpandIcon({ open }) {
  return (
    <Icon
      size={3}
      bgColor="var(--blue)"
      className={`${styles.expandicon} ${open ? styles.opened : styles.closed}`}
    >
      {/* Lines to be animated */}
      <span />
      <span />
    </Icon>
  );
}
export function ManifestationList({ manifestation = null }) {
  return (
    <Col key={manifestation.materialType} xs={12} md className={styles.right}>
      <Title type="title5">{manifestation.materialType}</Title>
      <ExpandIcon open={manifestation.open} />
    </Col>
  );
}
