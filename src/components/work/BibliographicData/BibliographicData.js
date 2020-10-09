/** @file
 * Component showing bibliographic data for a work and its manifestations
 * This component uses the section component defined in base/section
 */
import { Row, Col } from "react-bootstrap";

import Section from "../../base/section";
import Text from "../../base/text";
import dummy_workDataApi from "../dummy.workDataApi";
import React, { useState } from "react";

/**
 * Export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function GetBibData(props) {
  // get dummydata
  // @TODO get real - data Call API
  const workData = dummy_workDataApi(props);
  // @TODO datacheck like:
  // if (workData.work.materialTypes) {
  // console.log(workData.work.materialTypes);
  //}
  return (
    <Section title="Informationer og udgaver">
      <WorkTypesRow materialTypes={workData.work.materialTypes} />
    </Section>
  );
}

/**
 * Run through manifestations (WorkTypes) - do a row for each
 * @param materialTypes
 *   array of Manifestations from api
 * @param onClick
 *   callback for onclick
 * @returns {*}
 *   component
 * @constructor
 */
function WorkTypesRow({ materialTypes = null, onClick = null }) {
  // state for the onclick event
  const [manifestations, setManifestations] = useState(materialTypes);
  // onclick handler. set state of clicked manifestion (open/!open)
  const rowClicked = (index) => {
    // copy the manifestations array
    let ManiestationStates = [...manifestations];
    // toggle state of clicked manifestation
    ManiestationStates[index].open = !ManiestationStates[index].open;
    // set new state(s)
    setManifestations(ManiestationStates);
  };

  // row template
  return manifestations.map((manifestation, index) => (
    <Row key={index} onClick={() => (onClick ? onClick() : rowClicked(index))}>
      <ManifestationColumn manifestation={manifestation} />
    </Row>
  ));
}

// horizontal ruler - while developing
const Rule = ({ color }) => (
  <hr
    style={{
      color: color,
      borderColor: color,
      backgroundColor: color,
      height: 5,
    }}
  />
);

/**
 * Show manifestation simple/full.
 * @param manifestation
 *  A simpole manifestation from workdata - manifestation holds minimal information (cocver & pid baically)
 *  Use the pid to retrieve full manifestation from api if manifestation is open
 * @returns {*}
 *  Component
 * @constructor
 */
function ManifestationColumn({ manifestation = null }) {
  // is manifestation open ?
  if (!manifestation.open) {
    return (
      <Col key={manifestation.materialType} xs={12} md>
        <Text type="text3" lines={2}>
          {manifestation.materialType}
        </Text>
        <Rule color="orange" />
      </Col>
    );
  } else {
    // yes it is
    return (
      <Col key={manifestation.materialType.pid} xs={12} md>
        <Text type="text3" lines={2}>
          This is a manifestation : {manifestation.pid} : in progress @TODO
          manifestation template
        </Text>
        <Rule color="orange" />
      </Col>
    );
  }
}
