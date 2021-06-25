/**
 * @file Template for showing a manifestation in list form
 */
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import { Col } from "react-bootstrap";
import ExpandIcon from "@/components/base/animation/expand";
import React from "react";
import styles from "./BibliographicData.module.css";

export function ManifestationList({ manifestation = null }) {
  return (
    <>
      <Col key={manifestation.materialType} xs={12} md className={styles.right}>
        <div>
          <Title type="title4">{manifestation.materialType}</Title>
          <Text type="text2">{manifestation.datePublished}</Text>
        </div>
        <ExpandIcon open={manifestation.open} />
      </Col>
    </>
  );
}
