/** @file
 * Component showing bibliographic data for a work and its manifestations
 * This component uses the section component defined in base/section
 */
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import Accordion, { Item } from "@/components/base/accordion";
import Section from "@/components/base/section";
import ManifestationFull from "./ManifestationFull";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import {
  flattenMaterialType,
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import styles from "./BibliographicData.module.css";

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
  const { flattenedGroupedSortedManifestations } = useMemo(() => {
    return manifestationMaterialTypeFactory(manifestations);
  }, [manifestations]);

  // TODO: Fix this temporary fix: temporary fix for large manifestation lists
  const sliced = flattenedGroupedSortedManifestations.slice(0, 150);

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

          // Pass an array of additional text (s) for the folded accordion
          // show the materialtype
          const shortMaterialType = [formattedMaterialTypes, volume].join("");
          // show a person involved
          const shortPerson =
            manifestation.titles.identifyingAddition ||
            manifestation?.creators?.[0]?.display;
          // show some publishing info
          const shortPublishing =
            manifestation?.hostPublication?.title ||
            manifestation?.publisher +
              (manifestation?.edition?.edition
                ? `, ${manifestation?.edition?.edition}`
                : "");

          // the list to pass to accordion
          const additinalText = [
            shortMaterialType,
            shortPerson,
            shortPublishing,
          ];

          return (
            <Item
              title={manifestation?.edition?.publicationYear?.display}
              additionalTxt={additinalText}
              key={`${manifestation?.titles?.main?.[0]}_${index}`}
              eventKey={index.toString()}
              id={manifestation?.pid}
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
      manifestations={data?.work?.manifestations?.mostRelevant}
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
