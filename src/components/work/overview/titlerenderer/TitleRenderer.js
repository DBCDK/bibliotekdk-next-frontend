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

export function RenderTitlesWithoutLanguage({ titles }) {
  return titles?.map((title, index, titlesArray) => (
    <Fragment key={`${title}-${index}`}>
      {title} {index < titlesArray.length - 1 && <br />}
    </Fragment>
  ));
}
RenderTitlesWithoutLanguage.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string),
};
