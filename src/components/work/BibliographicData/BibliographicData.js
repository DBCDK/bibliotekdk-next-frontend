/** @file
 * Component showing bibliographic data for a work and its manifestations
 * This component uses the section component defined in base/section
 */
import { Row, Collapse } from "react-bootstrap";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import Section from "@/components/base/section";
import Divider from "@/components/base/divider";
import { ManifestationList } from "./ManifestationList";
import { ManifestationFull } from "./ManifestationFull";
import styles from "./BibliographicData.module.css";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";

import * as workFragments from "@/lib/api/work.fragments";
import { cyKey } from "@/utils/trim";

/**
 * Export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function BibliographicData(props) {
  return (
    <Section
      title={Translate({
        context: "bibliographic-data",
        label: "storytitle",
      })}
      topSpace={true}
    >
      <WorkTypesRow materialTypes={props.data} />
    </Section>
  );
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

  useEffect(() => {
    setManifestations(materialTypes);
  }, [materialTypes]);

  // onclick handler. set state of clicked manifestion (open/!open)
  const rowClicked = (index) => {
    // copy the manifestations array
    let ManifestationStates = manifestations.map((manifestation) => ({
      ...manifestation,
    }));
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
    <React.Fragment key={manifestation.pid}>
      <ul
        className={styles.pointer}
        data-cy={cyKey({ name: `${index}`, prefix: "bib-edition" })}
      >
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
      </ul>
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
        <ManifestationFull manifestation={manifestation} />
      </Row>
    </Collapse>
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap({ workId }) {
  const { data, isLoading, error } = useData(
    workFragments.detailsAllManifestations({ workId })
  );

  if (error) {
    return null;
  }
  if (isLoading) {
    return null;
  }

  return <BibliographicData data={data.work.manifestations} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
