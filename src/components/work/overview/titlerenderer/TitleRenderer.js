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
    ? [work?.titles?.tvSeries?.title]
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
    <>
      <Fragment key={`${title}-${index}`}>
        {title} {index < titlesArray.length - 1 && <br />}
      </Fragment>
      {type === "tvSerie" && (
        <div className={className}>
          <RenderTvSeries work={work} type={subtitleType} />
        </div>
      )}
    </>
  ));
}
RenderTitlesWithoutLanguage.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string),
};

export function RenderTvSeries({ work, type = "title6", className }) {
  /** season, disc, episode, episodeTitles .... if present **/
  // @TODO if there are episodeTitles .. episode should have a ':' in the end :)
  const tvtitles = work?.titles?.tvSeries;
  const subtitles = [
    ...(tvtitles?.season?.display ? [tvtitles?.season?.display] : []),
    ...(tvtitles?.disc?.display ? [tvtitles?.disc?.display] : []),
    ...(tvtitles?.episode?.display ? [tvtitles?.episode?.display] : []),
    ...(tvtitles?.episodeTitles?.length > 0
      ? [tvtitles?.episodeTitles?.map((dis) => dis.display)?.join(" ,")]
      : []),
  ];

  return (
    <Title
      type={type}
      tag="h2"
      lines={4}
      clamp={true}
      title={subtitles.join(", ")}
      dataCy={"ResultRow-subtitles"}
      className={className || ""}
    >
      {upperFirst(subtitles.join(", "))}
    </Title>
  );
}
