/**
 * @file Template for showing a full manifestation
 */
import { Col, Row } from "react-bootstrap";
import React from "react";

import Text from "../../base/text";
import Cover from "../../base/cover";
import Link from "../../base/link";
import Button from "../../base/button";

import ManifestationParserObject from "./ManifestationParserObject";

function dummyData(manifestation) {
  let parser = new ManifestationParserObject(manifestation);
  return parser.parseManifestation();
}

const columnOne = ({ manifestation }) => (
  <Col key={"col1" + manifestation.pid} xs={6} md>
    <Cover src={manifestation.cover.detail} size={["100px", "relative"]} />
    <Link children="Link til bog" href="http://google.dk" />
    <br />
    <Link children="Huskeliste" href="http://google.dk" />
    <br />
    <Link children="Findes på 63 biblioteker" href="http://google.dk" />
    <br />
    <br />
    <Button type={"secondary"} size={"small"} />
  </Col>
);

function TextLabelValue({ field }) {
  let printAbleArray = [];
  Object.values(field).forEach((val) => {
    Object.values(val).forEach((single) => {
      printAbleArray.push(single);
    });
  });

  return (
    <React.Fragment>
      <Text type="text4" lines={1}>
        {Object.keys(field)}
      </Text>
      <TextValue value={printAbleArray} />
      <br />
    </React.Fragment>
  );
}

function TextValue(value) {
  return value.value.map((value, index) => (
    <Text type="text3" lines={2} key={index}>
      {value}
    </Text>
  ));
}

function anotherColumn(col) {
  return (
    <Col xs={18} md>
      {col.map((field) => (
        <TextLabelValue field={field} />
      ))}
    </Col>
  );
}

export function ManifestationFull(manifestation) {
  let data = dummyData(manifestation);
  const returnArray = [
    columnOne(manifestation),
    anotherColumn(data["col1"]),
    anotherColumn(data["col2"]),
  ];

  return returnArray;
}
