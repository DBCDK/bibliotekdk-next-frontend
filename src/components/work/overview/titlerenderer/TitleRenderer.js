/**
  @ file
  this file renders the title
  The rendering includes
  - multiple titles,
  - languages where not danish
**/
import Title from "@/components/base/title";
import { Fragment } from "react";
import PropTypes from "prop-types";
import styles from "./TitleRenderer.module.css";
import Translate from "@/components/base/translate";
import upperFirst from "lodash/upperFirst";

export function parseLanguage(mainLanguages, nonDanishLanguages) {
  return mainLanguages?.length > 1
    ? `(${Translate({ context: "general", label: "multipleLanguages" })})`
    : nonDanishLanguages?.length > 0 // If nonDanishLanguage.length > 1, then previous condition strikes through
    ? `(${nonDanishLanguages?.[0]?.display})`
    : null;
}

export function getNonDanishLanguages(mainLanguages) {
  return mainLanguages?.filter((language) => language?.isoCode !== "dan");
}

export function RenderLanguageAddition({
  work,
  tag = "span",
  type = "title7",
}) {
  const titles = work?.titles?.full;
  const mainLanguages = work?.mainLanguages;

  const nonDanishLanguages = getNonDanishLanguages(mainLanguages);
  const parsedLanguages = parseLanguage(mainLanguages, nonDanishLanguages);

  const isLiterature = work?.workTypes?.includes("LITERATURE");
  const length = titles?.length;

  return (
    parsedLanguages &&
    isLiterature && (
      <Title
        tag={tag}
        className={`${length === 1 && styles.display_inline}`}
        type={type}
      >
        {parsedLanguages}
      </Title>
    )
  );
}
RenderLanguageAddition.propTypes = {
  parsedLanguages: PropTypes.any,
  literature: PropTypes.bool,
  length: PropTypes.number,
  tag: PropTypes.string,
  type: PropTypes.string,
};

export function getTitlesAndType({ work }) {
  const isTvSerie = work?.titles?.tvSeries?.title;

  const titles = isTvSerie
    ? [
        work?.titles?.tvSeries?.title ||
          work?.titles?.tvSeries?.danishLaunchTitle,
      ]
    : [
        ...(Array.isArray(work?.titles?.full) ? work?.titles?.full : []),
        ...(Array.isArray(work?.titles?.parallel)
          ? work?.titles?.parallel
          : []),
      ];

  return { titles: titles, type: isTvSerie ? "tvSerie" : "other" };
}

export function RenderTitlesWithoutLanguage({ work, subtitleType, className }) {
  const { titles, type } = getTitlesAndType({ work: work });
  return titles?.map((title, index, titlesArray) => (
    <Fragment key={`${title}-${index}`}>
      {title} {index < titlesArray.length - 1 && <br />}
      {type === "tvSerie" && (
        <div className={className} key={`${title}-${type}-${index}`}>
          <RenderTvSeries work={work} type={subtitleType} />
        </div>
      )}
    </Fragment>
  ));
}
RenderTitlesWithoutLanguage.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string),
};

export function getTvSeriesEpisodesTitle(tvSeries) {
  /** season, disc, episode, episodeTitles .... if present **/
  /** we have decided NOT to use the display field .. there are too many oddities ..**/
  /** we prefix instead : "episode”, “disc”, “volume”, “sæson" **/

  // ..hmm sometimes we have numbers in seasen, disc, episode, volume
  // if so - use the number BEFORE the display - there are too many errors in the display field
  const season = tvSeries?.season?.numbers
    ? `sæson ${tvSeries?.season?.numbers[0]}`
    : tvSeries?.season?.display || null;
  const disc = tvSeries?.disc?.numbers
    ? `disc ${tvSeries?.disc?.numbers[0]}`
    : tvSeries?.disc?.display || null;
  const volume = tvSeries?.volume?.numbers
    ? `volume ${tvSeries?.volume?.numbers[0]}`
    : tvSeries?.volume?.display || null;

  const pretitles =
    [
      ...(season ? [season] : []),
      ...(disc ? [disc] : []),
      ...(volume ? [volume] : []),
      ...(tvSeries?.episode?.display ? [tvSeries?.episode?.display] : []),
    ].join(", ") || null;

  // and now the episode titles :)
  const epsisodetitles =
    tvSeries?.episodeTitles?.map((dis) => dis).join(", ") || null;

  const subTitles =
    pretitles && epsisodetitles
      ? pretitles + ": " + epsisodetitles
      : pretitles || epsisodetitles || null;
  return subTitles;
}
export function RenderTvSeries({
  work,
  type = "title7",
  className,
  clamp = false,
  lines = 4,
}) {
  const subTitles = getTvSeriesEpisodesTitle(work?.titles?.tvSeries);

  if (!subTitles) {
    return null;
  }
  return (
    <Title
      type={type}
      tag="h2"
      clamp={clamp}
      lines={lines}
      title={subTitles}
      dataCy={"ResultRow-subtitles"}
      className={className || ""}
    >
      {upperFirst(subTitles)}
    </Title>
  );
}
