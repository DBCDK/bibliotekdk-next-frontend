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

/**Used in Slider */
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

/**Used in Header */
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

/**Used in relatedWorks*/
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

/**Used in LocalizationBase */
export function templateForLocalizations(
  material,
  singleManifestation = false
) {
  const fullTitle =
    singleManifestation === true
      ? material?.titles?.full?.join(": ")
      : material?.ownerWork?.titles?.full?.join(": ");
  const creators =
    singleManifestation === true
      ? material?.creators
      : material?.ownerWork?.creators;
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

/**
 *
 * @param {Object} props
 * @param {Object} props.material
 * @param {boolean} props.singleManifestation
 * @param {React.JSX.Element} props.children
 * @returns {React.JSX.Element}
 */
export function templateNew(
  { material, singleManifestation, children, isPeriodicaLike, isDigitalArticle } //Leveres som digital kopi til din mail eller "Første tilgængelige eksemplar"
) {
  const fullTitle =
    singleManifestation === true
      ? material?.titles?.full?.join(": ")
      : material?.ownerWork?.titles?.full?.join(": ");
  const creators =
    singleManifestation === true
      ? material?.creators
      : material?.ownerWork?.creators;

  const creatorsString = extractCreatorsPrioritiseCorporation(creators)
    ?.flatMap((c) => c?.display)
    .filter((pre) => !isEmpty(pre))
    ?.join(", ");
  const formattedMaterialTypes = formatMaterialTypesToPresentation(
    material?.materialTypesArray
  );

  console.log("MATERRIAL ", material);
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
    large: true,
    children: (
      <div>
        <Text {...propFunc("text1", 2)} title={fullTitle}>
          {fullTitle}
        </Text>
        {creatorsString && (
          <Text {...propFunc("text2", 2)} title={creatorsString}>
            {creatorsString}
          </Text>
        )}
        <Text
          {...propFunc("text4", 1)}
          title={formattedMaterialTypes}
          className={styles.type_standard_version}
        >
          {formattedMaterialTypes}
        </Text>
        {!isPeriodicaLike && !isDigitalArticle && (
          <Text {...propFunc("text3", 1)} title={formattedMaterialTypes}>
            {!singleManifestation &&
              Translate({
                context: "materialcard",
                label: "first-available-copy",
              })}
            {singleManifestation && edition}
          </Text>
        )}
        {/*MAYBE Optional button component OR entire row here
         skal kunne rumme --> Vælg eksemplar eller artikel (tidskrifter - alt for damerne)
        kan ikke bestilles til dit bibliotek / fjern-knap --> huskeliste

        */}
        {children}
      </div>
    ),
    // Styling
    elementContainerClassName: cx(
      styles.col_flex,
      styles.col_flex__localizations_version
    ),
    relatedElementClassName: cx(
      styles.related_element,
      styles.related_element__new_version
    ),
    textClassName: cx(styles.text_standard_version),
    coverImageClassName: cx(styles.cover, styles.cover__standard_version),
  };
}
