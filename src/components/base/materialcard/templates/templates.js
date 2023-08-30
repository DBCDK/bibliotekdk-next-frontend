import {
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";
import {
  extractCreatorsPrioritiseCorporation,
  getFirstMatch,
  getWorkUrl,
  upperCaseFirstChar,
} from "@/lib/utils";
import Text from "@/components/base/text";
import styles from "./templates.module.css";
import { getCoverImage } from "@/components/utils/getCoverImage";
import cx from "classnames";
import Translate from "@/components/base/translate";
import { AvailabilityEnum } from "@/components/hooks/useAgencyAccessFactory";
import { AvailabilityLight } from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/LocalizationItemBase";

function propFunc(textType, lines) {
  return {
    clamp: true,
    type: textType,
    lines: lines,
  };
}

export function templateForVerticalWorkCard(material) {
  const fullTitle = material?.titles?.full?.join(": ");
  const creators = material?.creators;
  const firstCreator =
    extractCreatorsPrioritiseCorporation(creators)?.[0]?.display;

  const coverSrc = getCoverImage(material.manifestations.mostRelevant);

  return {
    link_href: getWorkUrl(fullTitle, creators, material?.workId),
    fullTitle: fullTitle,
    image_src: coverSrc?.detail,
    workId: material?.workId,
    children: (
      <>
        {fullTitle && (
          <Text {...propFunc("text1", 2)} title={fullTitle}>
            {fullTitle}
          </Text>
        )}
        {firstCreator && (
          <Text {...propFunc("text2", 2)} title={firstCreator}>
            {firstCreator}
          </Text>
        )}
      </>
    ),
    // Styling
    elementContainerClassName: cx(
      styles.col_flex,
      styles.col_flex__vertical_version
    ),
    relatedElementClassName: cx(
      styles.related_element,
      styles.related_element__vertical_version
    ),
    coverImageClassName: cx(styles.cover, styles.cover__vertical_version),
  };
}

export function templateForHeaderWorkCard(material) {
  const fullTitle = material?.titles?.full?.join(": ");
  const creators = material?.creators;
  const firstCreator =
    extractCreatorsPrioritiseCorporation(creators)?.[0]?.display;
  const { flatMaterialTypes } = manifestationMaterialTypeFactory([material]);
  const formattedMaterialTypes =
    formatMaterialTypesToPresentation(flatMaterialTypes);

  const edition = [
    material?.edition?.edition,
    material?.edition?.publicationYear?.display,
  ]
    .filter((el) => !isEmpty(el))
    .join(", ");

  return {
    link_href: getWorkUrl(fullTitle, creators, material?.ownerWork?.workId),
    fullTitle: fullTitle,
    image_src: material?.cover?.detail,
    workId: material?.ownerWork?.workId,
    children: (
      <>
        <Text {...propFunc("text4", 2)} title={fullTitle}>
          {fullTitle}
        </Text>
        <Text {...propFunc("text3", 2)} title={firstCreator}>
          {firstCreator}
        </Text>
        <Text {...propFunc("text3", 1)} title={formattedMaterialTypes}>
          {formattedMaterialTypes}
        </Text>
        <Text {...propFunc("text3", 1)} title={edition}>
          {edition}
        </Text>
      </>
    ),
    // Styling
    elementContainerClassName: cx(styles.col_flex),
    relatedElementClassName: cx(styles.related_element),
    coverImageClassName: cx(styles.cover),
  };
}

export function templateForRelatedWorks(material) {
  const fullTitle = material?.titles?.full?.join(": ");
  const creators = material?.creators;
  const firstCreator =
    extractCreatorsPrioritiseCorporation(creators)?.[0]?.display;
  const formattedMaterialTypes = formatMaterialTypesToPresentation(
    material?.materialTypesArray
  );

  return {
    link_href: getWorkUrl(fullTitle, creators, material?.workId),
    fullTitle: fullTitle,
    image_src: material?.cover?.detail,
    workId: material?.workId,
    children: (
      <>
        <Text {...propFunc("text4", 2)} title={fullTitle}>
          {fullTitle}
        </Text>
        {firstCreator && (
          <Text {...propFunc("text3", 2)} title={firstCreator}>
            {firstCreator}
          </Text>
        )}
        <Text {...propFunc("text3", 1)} title={formattedMaterialTypes}>
          {formattedMaterialTypes}
        </Text>
      </>
    ),
    // Styling
    elementContainerClassName: cx(styles.col_flex),
    relatedElementClassName: cx(styles.related_element),
    coverImageClassName: cx(styles.cover),
  };
}

export function templateForLocalizations(material) {
  const fullTitle = material?.titles?.full?.join(": ");
  const creators = material?.creators;
  const firstCreator =
    extractCreatorsPrioritiseCorporation(creators)?.[0]?.display;
  const formattedMaterialTypes = formatMaterialTypesToPresentation(
    material?.materialTypesArray
  );

  return {
    link_href: getWorkUrl(fullTitle, creators, material?.workId),
    fullTitle: fullTitle,
    image_src: material?.cover?.detail,
    workId: material?.workId,
    children: (
      <>
        <Text {...propFunc("text4", 2)} title={fullTitle}>
          {fullTitle}
        </Text>
        {firstCreator && (
          <Text {...propFunc("text3", 2)} title={firstCreator}>
            {firstCreator}
          </Text>
        )}
        <Text {...propFunc("text3", 1)} title={formattedMaterialTypes}>
          {formattedMaterialTypes},{" "}
          {Translate({ context: "overview", label: "all-editions" })}
        </Text>
      </>
    ),
    // Styling
    elementContainerClassName: cx(
      styles.col_flex,
      styles.col_flex__localizations_version
    ),
    relatedElementClassName: cx(
      styles.related_element,
      styles.related_element__localization_version
    ),
    coverImageClassName: cx(styles.cover, styles.cover__localizations_version),
  };
}

/**
 * For BranchDetails template to show all, we must enrich material (here a manifestation) with the locationInBranch of the branch's specific holdingsItem (of the manifestation)
 * @param material
 * @returns {{fullTitle: *, children: JSX.Element, link_href: {query: {title_author: string, workId}, pathname: string}, elementContainerClassName: string, relatedElementClassName: string, coverImageClassName: string, image_src: *, workId: *}}
 */
export function templateForBranchDetails(material) {
  const fullTitle = material?.titles?.full?.join(": ");
  const creators = material?.creators;
  // const firstCreator =
  //   extractCreatorsPrioritiseCorporation(creators)?.[0]?.display;
  // const titleAndFirstCreator =
  //   fullTitle +
  //   (firstCreator && typeof firstCreator === "string"
  //     ? ` (${Translate({
  //         context: "localizations",
  //         label: "by_ved",
  //       })} ${firstCreator})`
  //     : "");
  const formattedEdition = [
    material?.edition?.publicationYear?.display,
    material?.publisher,
    material?.edition?.edition,
  ]
    .filter((e) => !!e)
    .join(", ");

  const availability = material?.availabilityById;
  const availabilityCount = getFirstMatch(
    true,
    Translate({ context: "localizations", label: "on_shelf" }),
    [
      [
        availability?.[AvailabilityEnum.NOW] > 0,
        Translate({
          context: "localizations",
          label: `branchDetails_${AvailabilityEnum.NOW}`,
          vars: [availability?.[AvailabilityEnum.NOW]],
        }),
      ],
      [
        availability?.[AvailabilityEnum.LATER] > 0,
        Translate({
          context: "localizations",
          label: `branchDetails_${AvailabilityEnum.LATER}`,
          vars: [availability?.[AvailabilityEnum.LATER]],
        }),
      ],
      [
        availability?.[AvailabilityEnum.UNKNOWN] > 0,
        Translate({
          context: "localizations",
          label: `branchDetails_${AvailabilityEnum.UNKNOWN}`,
          vars: [availability?.[AvailabilityEnum.UNKNOWN]],
        }),
      ],
    ]
  );
  const accumulatedAvailability = getFirstMatch(true, "???", [
    [availability?.[AvailabilityEnum.NOW] > 0, AvailabilityEnum.NOW],
    [availability?.[AvailabilityEnum.LATER] > 0, AvailabilityEnum.LATER],
    [availability?.[AvailabilityEnum.UNKNOWN] > 0, AvailabilityEnum.UNKNOWN],
  ]);

  console.log("material: ", material);

  return {
    link_href: getWorkUrl(fullTitle, creators, material?.workId),
    fullTitle: fullTitle,
    image_src: material?.cover?.detail,
    workId: material?.workId,
    children: (
      <>
        <Text {...propFunc("text4", 2)} title={fullTitle}>
          {fullTitle}
        </Text>
        {formattedEdition && (
          <Text {...propFunc("text3", 2)} title={formattedEdition}>
            {formattedEdition}
          </Text>
        )}
        <Text {...propFunc("text3", 2)} title={material?.locationInBranch}>
          {material.locationInBranch}
        </Text>
        <div className={cx(styles.branch_status)}>
          <AvailabilityLight
            accumulatedAvailability={accumulatedAvailability}
          />
          <Text
            {...propFunc("text3", 2)}
            title={JSON.stringify(material?.availabilityById)}
          >
            {upperCaseFirstChar(
              [availabilityCount].filter((e) => !!e).join(" ")
            )}
          </Text>
        </div>
      </>
    ),
    // Styling
    elementContainerClassName: cx(
      styles.col_flex,
      styles.col_flex__localizations_version
    ),
    relatedElementClassName: cx(
      styles.related_element,
      styles.related_element__localization_version
    ),
    coverImageClassName: cx(styles.cover, styles.cover__localizations_version),
  };
}
