/** @file
 * Component showing bibliographic data for a work and its manifestations
 * This component uses the section component defined in base/section
 */
import { Row, Col, Collapse } from "react-bootstrap";
import React, { useState, useEffect } from "react";

import Section from "../../base/section";
import { Divider } from "../../base/divider";
import { ManifestationList } from "./ManifestationList";
import { ManifestationFull } from "./ManifestationFull";
import dummy_workDataApi from "../dummy.workDataApi";
import styles from "./BibliographicData.module.css";
import Translate from "../../base/translate";

/**
 * Export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function BibliographicData(props) {
  // get dummydata
  // @TODO get real - data Call API
  let workData = getWorkData(props);
  return (
    <Section
      title={Translate({
        context: "bibliographic-data",
        label: "storytitle",
      })}
    >
      <WorkTypesRow materialTypes={workData.work.materialTypes} />
    </Section>
  );
}

/**
 * First manifestation in list should be open - this is a 'static' variable ..
 * @param props
 * @returns {{}|*}
 */
function getWorkData(props) {
  if (typeof getWorkData.data == "undefined") {
    // first time we load the data

    // @TODO datacheck like:
    // if (workData.work.materialTypes) {
    // console.log(workData.work.materialTypes);
    //}

    getWorkData.data = dummy_workDataApi(props);
    // this is the first load - set first manifestation to open
    // getWorkData.data.work.materialTypes[0].open = true;
  }
  return getWorkData.data;
}

/**
 * Run through manifestations (WorkTypes) - do a row for each
 * This is also where we handle state for each manifestation (open/closed)
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
    let ManifestationStates = [...manifestations];
    // close all manifestations except the one clicked
    ManifestationStates.forEach((manifestation, idx) => {
      if (idx !== index) {
        manifestation.open = false;
      }
    });
    // toggle state of clicked manifestation
    ManifestationStates[index].open = !ManifestationStates[index].open;
    // set new state(s)
    setManifestations(ManifestationStates);
  };

  return manifestations.map((manifestation, index) => (
    <React.Fragment>
      <div className={styles.pointer}>
        <Row
          tabIndex="0"
          as={"li"}
          key={index.toString() + manifestation.pid}
          onClick={() => {
            onClick ? onClick() : rowClicked(index);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              rowClicked(index);
            }
          }}
          className={styles.pointer}
        >
          <ManifestationList manifestation={manifestation} />
        </Row>
      </div>
      <ManifestationRowFull manifestation={manifestation} index={index} />
      <Divider />
    </React.Fragment>
  ));
}

/**
 * Show manifestation full if open or null if manifestion closed.
 * @param manifestation
 *  A simpole manifestation from workdata - manifestation holds minimal information (cocver & pid baically)
 *  Use the pid to retrieve full manifestation from api if manifestation is open
 * @returns {*}
 *  Component
 * @constructor
 */
function ManifestationRowFull({ manifestation = null, index = 0 }) {
  let show = manifestation.open;
  return (
    <Collapse in={show}>
      <Row key={index.toString()}>
        <ManifestationFull manifestation={manifestation} show={show} />
      </Row>
    </Collapse>
  );
}
