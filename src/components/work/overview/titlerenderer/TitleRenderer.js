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
import { useData } from "@/lib/api/api";
import { overviewWork } from "@/lib/api/work.fragments";
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
  parsedLanguages,
  isLiterature,
  length,
  tag = "div",
  type = "title5",
}) {
  return (
    <>
      {parsedLanguages && isLiterature && (
        <Title
          tag={tag}
          className={`${length === 1 && styles.display_inline}`}
          type={type}
        >
          {parsedLanguages}
        </Title>
      )}
    </>
  );
}
RenderLanguageAddition.propTypes = {
  parsedLanguages: PropTypes.any,
  literature: PropTypes.bool,
  length: PropTypes.number,
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

export function TitleRenderer({
  skeleton,
  titles,
  isLiterature = false,
  parsedLanguages = null,
  dataCy = "title-overview",
  titleType = "title3",
}) {
  return (
    <>
      <Title type={titleType} skeleton={skeleton} data-cy={dataCy}>
        <RenderTitlesWithoutLanguage titles={titles} />
        <RenderLanguageAddition
          parsedLanguages={parsedLanguages}
          isLiterature={isLiterature}
          length={titles?.length}
        />
      </Title>
    </>
  );
}
TitleRenderer.propTypes = {
  skeleton: PropTypes.any,
  titles: PropTypes.any,
  prop2: PropTypes.func,
};

export default function Wrap({ workId }) {
  const work_response = useData(workId && overviewWork({ workId: workId }));

  const work = work_response?.data?.work;
  const titles = work?.titles?.full;
  const mainLanguages = work?.mainLanguages;

  const nonDanishLanguages = getNonDanishLanguages(mainLanguages);
  const parsedLanguages = parseLanguage(mainLanguages, nonDanishLanguages);

  const isLiterature = work?.workTypes?.includes("LITERATURE");

  if (work_response?.isLoading) {
    return <TitleRenderer skeleton={true} />;
  }

  return (
    <TitleRenderer
      titles={titles}
      parsedLanguages={parsedLanguages}
      isLiterature={isLiterature}
    />
  );
}
