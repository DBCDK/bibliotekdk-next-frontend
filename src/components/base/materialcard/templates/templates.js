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
import { BackgroundColorEnum } from "../materialCard.utils";

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

/**Used in Series page */
export function templateForBigWorkCard({ material, includeCreators }) {
  const fullTitle = material?.titles?.full?.join(": ");
  const creators = material?.creators;
  const abstract = material?.abstract;

  const coverSrc = getCoverImage(material.manifestations.mostRelevant);

  const readThisFirst = material?.series?.[0]?.readThisFirst;
  const numberInSeries = material?.series?.[0]?.numberInSeries?.display;

  return {
    link_href: getWorkUrl(fullTitle, creators, material?.workId),
    fullTitle: fullTitle,
    image_src: coverSrc?.detail,
    workId: material?.workId,
    children: (
      <>
        {(numberInSeries || readThisFirst) && (
          <div className={styles.begin_with_this_and_number_in_series}>
            {numberInSeries && (
              <Text tag="span" type="text4">
                {Translate({
                  context: "series_page",
                  label: "number_in_series",
                  vars: [numberInSeries],
                })}
              </Text>
            )}
            {readThisFirst && (
              <Text tag="span" type="text6" className={styles.begin_with_this}>
                {Translate({
                  context: "series_page",
                  label: "begin_with_this",
                })}
              </Text>
            )}
          </div>
        )}
        {fullTitle && (
          <Text {...propFunc("title4", 2)} title={fullTitle}>
            {fullTitle}
          </Text>
        )}
        {includeCreators && creators && (
          <Text {...propFunc("text2", 8)} title={abstract}>
            {Translate({ context: "general", label: "by" })}{" "}
            {creators.map((creator) => creator.display).join(", ")}
          </Text>
        )}
        {abstract && (
          <Text {...propFunc("text2", 8)} title={abstract}>
            {abstract}
          </Text>
        )}
      </>
    ),
    border: { top: { keepVisible: true }, bottom: { keepVisible: true } },
    // Styling
    elementContainerClassName: cx(
      styles.col_flex,
      styles.col_flex__big_work_version
    ),
    relatedElementClassName: cx(
      styles.related_element,
      styles.related_element__big_work_version
    ),
    textClassName: cx(styles.text__big_work_version),
    coverImageClassName: cx(styles.cover, styles.cover__big_work_version),
    linkClassName: cx(styles.link__big_work_version),
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
 * @param {boolean} props.isPeriodicaLike
 * @param {boolean} props.isDigitalArticle
 * @param {boolean} [props.isDeliveredByDigitalArticleService] - used to differentiate between "Første tilgængelige eksemplar" and "Leveres som digital kopi til din mail"
 * @param {BackgroundColorEnum} [props.backgroundColor] - indicates warnings or errors in the material card - used in multiorder
 * @param {string} [props.elementContainerClassName] - used in reviewHeader
 * @param {string} [props.coverImageStyle] - used in reviewHeader
 *@returns {React.JSX.Element}
 */
export function templateImageToLeft({
  material,
  singleManifestation,
  children,
  isPeriodicaLike,
  isDigitalArticle,
  isDeliveredByDigitalArticleService = false,
  backgroundColor = BackgroundColorEnum.NEUTRAL,
  hideEditionText = false,
  elementContainerClassName,
  imageContainerStyle,
  linkToWork = false,
}) {
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

  const formattedMaterialTypes = Boolean(
    singleManifestation && material?.materialType
  ) //@TODO we get that from bookmarks if specific edition is marked --> would be better to retrieve manifestations directly inside of multiorder --> material
    ? material?.materialType
    : formatMaterialTypesToPresentation(material?.materialTypesArray);

  const edition = [
    material?.edition?.publicationYear?.display,
    material?.publisher,
    material?.edition?.edition,
  ]
    ?.flat()
    .filter((pre) => !isEmpty(pre))
    ?.join(", ");

  return {
    link_href: linkToWork
      ? getWorkUrl(fullTitle, creators, material?.ownerWork?.workId)
      : null,
    fullTitle: fullTitle,
    image_src: material?.cover?.detail,
    workId: material?.workId,
    imageLeft: true,
    imageContainerStyle: imageContainerStyle,
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
          className={styles.type__image_to_left_version}
        >
          {formattedMaterialTypes}
        </Text>
        {!isPeriodicaLike && !isDigitalArticle && !hideEditionText && (
          <Text {...propFunc("text3", 1)} title={formattedMaterialTypes}>
            {singleManifestation
              ? edition
              : Translate({
                  context: "materialcard",
                  label: isDeliveredByDigitalArticleService
                    ? "digital-copy"
                    : "first-available-copy",
                })}
          </Text>
        )}
        {children}
      </div>
    ),
    // Styling
    elementContainerClassName: cx(
      styles.col_flex,
      styles.col_flex__image_to_left_version,
      {
        [styles.warning_yellow]: backgroundColor === BackgroundColorEnum.YELLOW,
        [styles.error_red]: backgroundColor === BackgroundColorEnum.RED,
        [styles.uniRed]: backgroundColor === BackgroundColorEnum.UNI_RED,
        [elementContainerClassName]: elementContainerClassName,
      }
    ),
    relatedElementClassName: cx(
      styles.related_element,
      styles.related_element__image_to_left_version,
      {
        [styles.uniRed]: backgroundColor === BackgroundColorEnum.UNI_RED,
      }
    ),
    textClassName: cx(styles.text__image_to_left_version, {
      [styles.white_overlay]:
        backgroundColor === BackgroundColorEnum.YELLOW ||
        backgroundColor === BackgroundColorEnum.RED,
      [styles.uniRed]: backgroundColor === BackgroundColorEnum.UNI_RED,
    }),
    coverImageClassName: cx(styles.cover, styles.cover__image_to_left_version),
  };
}
