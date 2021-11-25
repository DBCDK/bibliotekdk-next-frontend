/** @file
 * Component showing bibliographic data for a work and its manifestations
 * This component uses the section component defined in base/section
 */
import PropTypes from "prop-types";
import React, { useEffect, useState, useMemo } from "react";

import Accordion, { Item } from "@/components/base/accordion";
import Section from "@/components/base/section";
import { ManifestationFull } from "./ManifestationFull";
import { sortManifestations } from "./utils";
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
export function BibliographicData({ work, workId }) {
  const sortedMaterialTypes = useMemo(
    () => sortManifestations(work.manifestations),
    [work]
  );

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
        {sortedMaterialTypes.map((manifestation, index) => {
          const volume = manifestation.volume
            ? " (" + manifestation.volume + ")"
            : "";
          return (
            <Item
              title={`${manifestation.materialType + volume}`}
              subTitle={manifestation.datePublished}
              key={`${manifestation.title}_${index}`}
              eventKey={index.toString()}
            >
              <ManifestationFull
                manifestation={manifestation}
                work={work}
                workId={workId}
              />
            </Item>
          );
        })}
      </Accordion>
    </Section>
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

  if (error || !data) {
    return null;
  }
  if (isLoading) {
    return null;
  }

  return <BibliographicData work={data.work} workId={workId} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
