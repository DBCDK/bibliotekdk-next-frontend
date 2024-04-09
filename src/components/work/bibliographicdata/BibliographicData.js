/** @file
 * Component showing bibliographic data for a work and its manifestations
 * This component uses the section component defined in base/section
 */
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import Accordion, { Item } from "@/components/base/accordion";
import Section from "@/components/base/section";
import ManifestationFull from "./manifestationfull/ManifestationFull";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import {
  flattenMaterialType,
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";
import capitalize from "lodash/capitalize";
import { createEditionText } from "../details/utils/details.utils";

/**
 * Export function of the Component
 *
 * @param {Object} manifestation
 * @param {string} workId
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
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
          // very 1. priority
          let volume = manifestation?.titles?.identifyingAddition
            ? manifestation?.titles?.identifyingAddition
            : "";
          volume +=
            volume && manifestation?.volume ? ", " + manifestation.volume : "";

          const formattedMaterialTypes = formatMaterialTypesToPresentation(
            flattenMaterialType(manifestation)
          );

          // Pass an array of additional text (s) for the folded accordion
          // show the materialtype
          const shortMaterialType = [formattedMaterialTypes].join("");

          // show additional info - prioritized
          // 1. volume
          // 2. contributor (dkind) - indlæser
          // 3. illustrator
          // 4. titles.identifyingAddition - text describing contribution
          // 5. creator
          // 6. .. nothing

          // priority 1
          const personsReading = manifestation?.contributors?.filter((con) => {
            return !isEmpty(
              con?.roles?.find((rol) => rol.functionCode === "dkind")
            );
          });
          // priority 2
          const personIllustrating = manifestation?.contributors?.filter(
            (con) => {
              return !isEmpty(
                con?.roles?.find((rol) => rol.functionCode === "ill")
              );
            }
          );
          const shortAddit =
            (volume && volume) ||
            (personsReading.length > 0 &&
              personsReading
                ?.map(
                  (person, index) =>
                    `${
                      index < 1
                        ? person.roles?.[0]?.function?.singular + ":"
                        : ""
                    } ${person.display}`
                )
                .join(", ")) ||
            (personIllustrating.length > 0 &&
              personIllustrating
                ?.map(
                  (person, index) =>
                    `${
                      index < 1
                        ? personIllustrating.length > 1
                          ? capitalize(person.roles?.[0]?.function?.plural) +
                            ":"
                          : capitalize(person.roles?.[0]?.function?.singular) +
                            ":"
                        : ""
                    } ${person.display}`
                )
                .join(", ")) ||
            // priority 3
            manifestation?.titles?.identifyingAddition ||
            // priority 4
            manifestation?.creators?.[0]?.display ||
            // priority 5
            "";

          // show some publishing info
          const shortPublishing = createEditionText(manifestation);

          // the list to pass to accordion
          const additinalText = [
            shortMaterialType,
            shortAddit,
            shortPublishing,
          ];

          return (
            <Item
              title={manifestation?.edition?.publicationYear?.year || "-"}
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
 * @returns {React.JSX.Element}
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
