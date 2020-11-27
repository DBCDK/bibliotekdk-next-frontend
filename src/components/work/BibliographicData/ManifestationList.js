/**
 * @file Template for showing a manifestation in list form
 */
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import { Col } from "react-bootstrap";
import Icon from "@/components/base/icon/Icon";
import React from "react";
import styles from "./BibliographicData.module.css";

function ExpandIcon({ open }) {
  return (
    <Icon
      size={{ w: 3, h: 3 }}
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
    <React.Fragment>
      <Col key={manifestation.materialType} xs={12} md className={styles.right}>
        <div>
          <Title type="title4">{manifestation.materialType}</Title>
          <Text type="text2">{manifestation.datePublished}</Text>
        </div>
        <ExpandIcon open={manifestation.open} />
      </Col>
    </React.Fragment>
  );
}
