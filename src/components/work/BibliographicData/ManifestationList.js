/**
 * @file Template for showing a manifestation in list form
 */
import Text from "../../base/text";
import { Col } from "react-bootstrap";
import Icon from "../../base/icon/Icon";
import React from "react";

export function ManifestationList({ manifestation = null }) {
  return (
    <Col key={manifestation.materialType} xs={12} md>
      <Text type="text3" lines={4}>
        {manifestation.materialType}
        <Icon size={2} bgColor="var(--blue)" src={"iconclosed.svg"} />
      </Text>

      <br />
    </Col>
  );
}
