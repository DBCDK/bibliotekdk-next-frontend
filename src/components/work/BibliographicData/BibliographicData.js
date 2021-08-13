/** @file
 * Component showing bibliographic data for a work and its manifestations
 * This component uses the section component defined in base/section
 */
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import Accordion, { Item } from "@/components/base/accordion";
import Section from "@/components/base/section";
import { ManifestationFull } from "./ManifestationFull";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";

import * as workFragments from "@/lib/api/work.fragments";

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
      contentDivider={null}
      topSpace={true}
    >
      <Accordion>
        <WorkTypesRow materialTypes={props.data} />
      </Accordion>
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

  return manifestations.map((manifestation, index) => {
    return (
      <Item
        title={manifestation.materialType}
        subTitle={manifestation.datePublished}
        key={`${manifestation.title}_${index}`}
        eventKey={index.toString()}
      >
        <ManifestationFull manifestation={manifestation} index={index} />
      </Item>
    );
  });
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
