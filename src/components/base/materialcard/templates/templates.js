import {
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";
import {
  extractCreatorsPrioritiseCorporation,
  getSeriesUrl,
  getUniverseUrl,
  getWorkUrl,
} from "@/lib/utils";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import styles from "./templates.module.css";
import { getCoverImage } from "@/components/utils/getCoverImage";
import cx from "classnames";
import Translate from "@/components/base/translate";
import { BackgroundColorEnum } from "../materialCard.utils";
import { useState } from "react";

function ReadThisFirst({ className }) {
  return (
    <Text
      tag="span"
      type="text6"
      className={cx(styles.begin_with_this, className)}
    >
      {Translate({
        context: "series_page",
        label: "begin_with_this",
      })}
    </Text>
  );
}

export function MaterialCardImages({ covers, fullTitle, className }) {
  const [loaded, setLoaded] = useState(
    Array.from({ length: covers.length }).fill(false)
  );

  const length = covers?.length;
  const fullWidth = 100;
  const offset = 16;

  if (length === 0) {
    return null;
  }

  return (
    <div className={cx(className, styles.stacked_cover_group)}>
      {covers?.map((image_src, index) => {
        return (
          <div
            key={index}
            style={{
              marginLeft: `${offset * index}px`,
              marginRight: `-${offset * index}px`,
              marginBottom: `${offset * index}px`,
              zIndex: `-${index}`,
            }}
            className={styles.stacked_cover_container}
          >
            <img
              style={{
                width: `calc(${fullWidth}% - ${(length - 1) * offset}px)`,
                maxHeight: `var(--cover_height_material_card)`,
              }}
              className={cx(styles.stacked_cover, {
                [styles.cover_image_skeleton]: !loaded,
              })}
              src={image_src}
              onLoad={() =>
                setLoaded((prev) => {
                  prev[index] = true;
                  return prev;
                })
              }
              alt={fullTitle}
            />
          </div>
        );
      })}
    </div>
  );
}

function propFunc(textType, lines) {
  return {
    clamp: true,
    type: textType,
    lines: lines,
  };
}

/**Used in Slider */
export function templateForVerticalWorkCard({ material }) {
  const fullTitle = material?.titles?.full?.join(": ");
  const creators = material?.creators;
  const firstCreator =
    extractCreatorsPrioritiseCorporation(creators)?.[0]?.display;

  const coverSrc = getCoverImage(material?.manifestations?.mostRelevant);

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

export function templateForUniverseInfoCard({ material }) {
  const coverImageClassName = cx(
    styles.cover,
    styles.cover__universe_info_card
  );

  const href = getUniverseUrl(material?.title, material?.workId);

  return {
    link_href: href,
    ImageElement: material?.title
      ? () => (
          <div className={coverImageClassName}>
            <Text tag="span" type="text2">
              <Link border={{ bottom: { keepVisible: true } }} href={href}>
                {Translate({
                  context: "universe",
                  label: "everything_in_universe",
                  vars: [material?.title],
                })}
              </Link>
            </Text>
          </div>
        )
      : null,
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

export function templateForUniverseSliderWork({ material }) {
  const classNameAddition = {
    elementContainerClassName: cx(styles.col_flex__vertical_version),
    relatedElementClassName: cx(
      styles.related_element__universe_page_work_version
    ),
    coverImageClassName: cx(styles.cover__universe_page_work_version),
  };

  return templateForUniverseWorkBase({ material, classNameAddition });
}

export function templateForUniversePageWork({ material }) {
  const classNameAddition = {
    elementContainerClassName: cx(styles.col_flex__universe_page_work_version),
    relatedElementClassName: cx(
      styles.related_element__universe_page_work_version
    ),
    coverImageClassName: cx(styles.cover__universe_page_work_version),
  };

  return templateForUniverseWorkBase({ material, classNameAddition });
}

/**Used in Universe Page for Works */
export function templateForUniverseWorkBase({ material, classNameAddition }) {
  const fullTitle = material?.titles?.full?.join(": ");
  const creators = material?.creators;
  const firstCreator =
    extractCreatorsPrioritiseCorporation(creators)?.[0]?.display;

  const coverSrc = getCoverImage(material?.manifestations?.mostRelevant);

  return {
    link_href: getWorkUrl(fullTitle, creators, material?.workId),
    fullTitle: fullTitle,
    image_src: coverSrc?.detail,
    workId: material?.workId,
    children: (
      <>
        {fullTitle && (
          <Text {...propFunc("text1", 3)} title={fullTitle}>
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
      classNameAddition?.elementContainerClassName
    ),
    relatedElementClassName: cx(
      styles.related_element,
      classNameAddition?.relatedElementClassName
    ),
    textClassName: cx(styles.text, classNameAddition?.textClassName),
    coverImageClassName: cx(
      styles.cover,
      classNameAddition?.coverImageClassName
    ),
  };
}

export function templateForUniverseSliderSeries({ material }) {
  const classNameAddition = {
    elementContainerClassName: cx(styles.col_flex__vertical_version),
    relatedElementClassName: cx(
      styles.related_element__universe_page_work_version
    ),
    coverImageClassName: cx(styles.cover__universe_page_series_version),
  };

  return templateForUniverseSeriesBase({ material, classNameAddition });
}

export function templateForUniversePageSeries({ material }) {
  const classNameAddition = {
    elementContainerClassName: cx(styles.col_flex__universe_page_work_version),
    relatedElementClassName: cx(
      styles.related_element__universe_page_work_version
    ),
    coverImageClassName: cx(styles.cover__universe_page_series_version),
  };

  return templateForUniverseSeriesBase({ material, classNameAddition });
}

/**Used in Universe Page for Series */
export function templateForUniverseSeriesBase({ material, classNameAddition }) {
  const fullTitle = material?.title;
  const firstWork = material?.members?.[0]?.work;
  const creators = firstWork?.creators;
  const firstCreator =
    extractCreatorsPrioritiseCorporation(creators)?.[0]?.display;

  const coversBeforeSlice = material?.members?.map((member) =>
    getCoverImage(member?.work?.manifestations?.mostRelevant)
  );

  const coversWithMoreinfo = coversBeforeSlice?.filter(
    (cover) => cover?.origin === "moreinfo"
  );

  const covers = (
    coversWithMoreinfo?.length > 0 ? coversWithMoreinfo : coversBeforeSlice
  )
    ?.map((cover) => cover?.detail)
    .slice(0, 3);

  const coverSrc = getCoverImage(firstWork?.manifestations?.mostRelevant);

  // TODO: We need to change this if we get ids on Series. A SeriesId if you will
  const urlToFirstWork = getSeriesUrl(fullTitle, firstWork?.workId);

  const coverImageClassName = cx(
    styles.cover,
    classNameAddition?.coverImageClassName
  );

  return {
    link_href: urlToFirstWork,
    fullTitle: fullTitle,
    image_src: covers.length === 1 ? covers?.[0] : coverSrc?.detail,
    ImageElement:
      covers.length > 1
        ? () => (
            <MaterialCardImages
              covers={covers}
              fullTitle={fullTitle}
              className={coverImageClassName}
            />
          )
        : null,
    workId: material?.workId,
    children: (
      <>
        {fullTitle && (
          <Text {...propFunc("text1", 3)} title={fullTitle}>
            {fullTitle}
            {Translate({ context: "universe_page", label: "series" })}
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
      classNameAddition?.elementContainerClassName
    ),
    relatedElementClassName: cx(
      styles.related_element,
      classNameAddition?.relatedElementClassName
    ),
    textClassName: cx(styles.text, classNameAddition?.textClassName),
    coverImageClassName: coverImageClassName,
  };
}

/**Used in Slider */
export function templateForSeriesSlider({ material, series }) {
  const fullTitle = material?.titles?.full?.join(": ");
  const creators = material?.creators;
  const firstCreator =
    extractCreatorsPrioritiseCorporation(creators)?.[0]?.display;

  const coverSrc = getCoverImage(material?.manifestations?.mostRelevant);

  const beginWithThis = series?.readThisFirst;
  const numberInSeries = series?.numberInSeries;

  return {
    link_href: getWorkUrl(fullTitle, creators, material?.workId),
    fullTitle: fullTitle,
    image_src: coverSrc?.detail,
    ImageOverlay: beginWithThis
      ? () => <ReadThisFirst className={styles.begin_with_this_top_of_image} />
      : () => <></>,
    workId: material?.workId,
    children: (
      <>
        {fullTitle && (
          <Text {...propFunc("text1", 2)} title={fullTitle}>
            {numberInSeries ? `${numberInSeries} - ` : ""}
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
      styles.related_element__series_slider_version
    ),
    textClassName: cx(styles.text__series_slider_version),
    coverImageClassName: cx(styles.cover, styles.cover__series_slider_version),
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
            {readThisFirst && <ReadThisFirst />}
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
