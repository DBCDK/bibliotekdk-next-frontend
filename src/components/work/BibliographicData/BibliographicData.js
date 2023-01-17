/** @file
 * Component showing bibliographic data for a work and its manifestations
 * This component uses the section component defined in base/section
 */
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import Accordion, { Item } from "@/components/base/accordion";
import Section from "@/components/base/section";
import ManifestationFull from "./ManifestationFull";
import { sortManifestations } from "./utils";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import {
  flattenMaterialType,
  formatMaterialTypesToPresentation,
} from "@/lib/manifestationFactoryUtils";

/**
 * Export function of the Component
 *
 * @param {obj} manifestation
 * @param {string} workId
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function BibliographicData({ manifestations, workId }) {
  const sortedMaterialTypes = useMemo(
    () => sortManifestations(manifestations),
    [manifestations]
  );

  // TODO: Fix this temporary fix: temporary fix for large manifestation lists
  const sliced = sortedMaterialTypes.slice(0, 150);

  return (
    <Section
      title={Translate({
        context: "bibliographic-data",
        label: "storytitle",
      })}
      divider={{ content: false }}
    >
      <Accordion>
        {sliced.map((manifestation, index) => {
          const volume = manifestation.volume
            ? " (" + manifestation.volume + ")"
            : "";

          const formattedMaterialTypes = formatMaterialTypesToPresentation(
            flattenMaterialType(manifestation)
          );

          return (
            <Item
              title={[formattedMaterialTypes, volume].join("")}
              subTitle={manifestation?.edition?.publicationYear?.display}
              key={`${manifestation?.titles?.main?.[0]}_${index}`}
              eventKey={index.toString()}
            >
              {(hasBeenSeen) => (
                <ManifestationFull
                  pid={manifestation?.pid}
                  workId={workId}
                  hasBeenSeen={hasBeenSeen}
                />
              )}
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
 * @param {string} workId
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Wrap({ workId }) {
  const { data, isLoading, error } = useData(
    workId && workFragments.listOfAllManifestations({ workId: workId })
  );

  if (error || !data) {
    return null;
  }
  if (isLoading) {
    return null;
  }

  return (
    <BibliographicData
      manifestations={data?.work?.manifestations?.all}
      workId={workId}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
