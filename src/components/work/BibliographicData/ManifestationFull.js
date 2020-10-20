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
import PropTypes from "prop-types";

function dummyData(manifestation) {
  let parser = new ManifestationParserObject(manifestation);
  return parser.parseManifestation();
}

function ColumnOne({ manifestation }) {
  return (
    <Col key={"col1" + manifestation.pid} xs={6} md>
      <Cover src={manifestation.cover.detail} size={["100px", "relative"]} />
      <Link
        children="Im a hyperlink now!"
        href={{ pathname: "http://google.dk", query: {} }}
      />
      <br />
      <Link
        children="Huskeliste"
        href={{ pathname: "http://google.dk", query: {} }}
      />
      <br />
      <Link
        children="Findes på 63 biblioteker"
        href={{ pathname: "http://google.dk", query: {} }}
      />
      <br />
      <br />
      <Button type={"secondary"} size={"small"} />
    </Col>
  );
}

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

function AnotherColumn({ col }) {
  return (
    <Col xs={18} md>
      {col.map((field) => (
        <TextLabelValue field={field} />
      ))}
    </Col>
  );
}

export function ManifestationFull({ manifestation }) {
  let data = dummyData(manifestation);
  return (
    <React.Fragment>
      <ColumnOne manifestation={manifestation}></ColumnOne>
      <AnotherColumn col={data["col1"]}></AnotherColumn>
      <AnotherColumn col={data["col2"]}></AnotherColumn>
    </React.Fragment>
  );
}
