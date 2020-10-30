/**
 * @file Template for showing a manifestation in list form
 */
import Title from "../../base/title";
import { Col } from "react-bootstrap";
import Icon from "../../base/icon/Icon";
import React from "react";
import styles from "./BibliographicData.module.css";
import { Divider } from "../../base/divider";

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
  let icon = manifestation.open ? "iconminuswhite.svg" : "iconpluswhite.svg";
  let style = manifestation.open ? { display: "none" } : { display: "block" };
  return (
    <React.Fragment>
      <Col key={manifestation.materialType} xs={12} md className={styles.right}>
        <Title type="title4">{manifestation.materialType}</Title>
        <Icon size={3} bgColor="var(--blue)" src={icon} />
      </Col>
    </React.Fragment>
  );
}
