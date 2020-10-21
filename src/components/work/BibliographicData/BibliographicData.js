/** @file
 * Component showing bibliographic data for a work and its manifestations
 * This component uses the section component defined in base/section
 */
import { Row, Col } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import React, { useState } from "react";

import Section from "../../base/section";
import { Divider } from "../../base/divider";
import { ManifestationList } from "./ManifestationList";
import { ManifestationFull } from "./ManifestationFull";
import dummy_workDataApi from "../dummy.workDataApi";
import Icon from "../../base/icon/Icon";

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
    <Section title="Informationer og udgaver" key={"fnis"}>
      <WorkTypesRow materialTypes={workData.work.materialTypes} key={"is"} />
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

  return manifestations.map((manifestation, index) => (
    <React.Fragment>
      <Row
        key={index.toString() + "list"}
        onClick={() => (onClick ? onClick() : rowClicked(index))}
      >
        <ManifestationList manifestation={manifestation} />
      </Row>
      <Divider></Divider>
      <ManifestationRowFull manifestation={manifestation} index={index} />
    </React.Fragment>
  ));
}

/**
 * Show manifestation full or null of manifestion is closed.
 * @param manifestation
 *  A simpole manifestation from workdata - manifestation holds minimal information (cocver & pid baically)
 *  Use the pid to retrieve full manifestation from api if manifestation is open
 * @returns {*}
 *  Component
 * @constructor
 */
function ManifestationRowFull({ manifestation = null, index = 0 }) {
  // is manifestation open ?
  if (manifestation.open) {
    return (
      <React.Fragment>
        <Row key={index.toString() + "full"}>
          <ManifestationFull manifestation={manifestation} />,
        </Row>
        <Divider />
      </React.Fragment>
    );
  } else {
    return null;
  }
}
