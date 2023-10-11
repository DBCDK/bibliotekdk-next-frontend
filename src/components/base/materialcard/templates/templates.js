import {
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";
import { extractCreatorsPrioritiseCorporation, getWorkUrl } from "@/lib/utils";
import Text from "@/components/base/text";
import styles from "./templates.module.css";
import { getCoverImage } from "@/components/utils/getCoverImage";
import cx from "classnames";
import Translate from "@/components/base/translate";

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
    textClassName: cx(styles.text),
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
    textClassName: cx(styles.text),
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
    textClassName: cx(styles.text),
    coverImageClassName: cx(styles.cover),
  };
}

export function templateForLocalizations(
  material,
  singleManifestation = false
) {
  const fullTitle = material?.titles?.full?.join(": ");
  const creators = material?.creators;
  const firstCreator =
    extractCreatorsPrioritiseCorporation(creators)?.[0]?.display;
  const formattedMaterialTypes = formatMaterialTypesToPresentation(
    material?.materialTypesArray
  );

  const edition = [
    material?.edition?.publicationYear?.display,
    material?.publisher,
    material?.edition?.edition,
  ]
    ?.flat()
    .filter((pre) => !isEmpty(pre))
    ?.join(", ");

  return {
    link_href: null,
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
          {!singleManifestation &&
            Translate({ context: "overview", label: "all-editions" })}
          {singleManifestation && edition}
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
      styles.related_element__localizations_version
    ),
    textClassName: cx(styles.text__localizations_version),
    coverImageClassName: cx(styles.cover, styles.cover__localizations_version),
  };
}
