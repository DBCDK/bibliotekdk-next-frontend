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
import Translate from "../../base/translate";

/**
 * Init parserobject; return two columns with details for the work
 * @param manifestation
 * @returns {*[]}
 */
function dummyData(manifestation) {
  let parser = new ManifestationParserObject(manifestation);
  return parser.parseManifestationInTwoColumns();
}

/**
 * Column one of full view. Some links and a button.
 * @param manifestation
 * @returns {JSX.Element}
 * @constructor
 */
function ColumnOne({ manifestation }) {
  let number_of_libraries = "63";
  return (
    <Col
      key={"col1" + manifestation.pid}
      xs={6}
      md
      data-cy="bibliographic-column1"
    >
      <Cover src={manifestation.cover.detail} size={["100px", "relative"]} />
      <Link
        children={Translate({
          context: "bibliographic-data",
          label: "editionlink",
        })}
        href={{ pathname: "http://google.dk", query: {} }}
      />
      <br />
      <Link
        children={Translate({
          context: "bibliographic-data",
          label: "bookmark",
        })}
        href={{ pathname: "http://google.dk", query: {} }}
      />
      <br />
      <Link
        children={Translate({
          context: "bibliographic-data",
          label: "library-locations",
          vars: [number_of_libraries],
        })}
        href={{ pathname: "http://google.dk", query: {} }}
      />
      <br />
      <br />
      <Button
        type={"secondary"}
        size={"small"}
        children={Translate({
          context: "overview",
          label: "addToCart",
        })}
      />
    </Col>
  );
}

/**
 * Get the label(key):value of given field
 * @param field
 *  array eg. ["pid" => [333.4432]]
 * @returns {JSX.Element}
 * @constructor
 */
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

/**
 * Get the values of given value-array
 * @param value
 *  Array of values eg. [2,3,4,5]
 * @returns {*}
 * @constructor
 */
function TextValue(value) {
  return value.value.map((value, index) => (
    <Text type="text3" lines={2} key={index}>
      {value}
    </Text>
  ));
}

/**
 * Output a column from given col
 * @param col
 *  Array eg. [[contributor=>["fisk], [pid=>[11234]], [notes=>["hest", "fisk"]]]
 * @param idattribute
 * @returns {JSX.Element}
 * @constructor
 */
function AnotherColumn({ col = [], cyattribute = "" }) {
  return (
    <Col xs={18} md data-cy={cyattribute}>
      {col.map((field) => (
        <TextLabelValue field={field} />
      ))}
    </Col>
  );
}

/**
 * Get the data to parse; parse it into 3 columns
 * @param manifestation
 * @returns {JSX.Element}
 * @constructor
 */
export function ManifestationFull({ manifestation }) {
  let data = dummyData(manifestation);
  return (
    <React.Fragment>
      <ColumnOne manifestation={manifestation} />
      <AnotherColumn col={data["col1"]} cyattribute="bibliographic-column2" />
      <AnotherColumn col={data["col2"]} cyattribute="bibliographic-column3" />
    </React.Fragment>
  );
}
