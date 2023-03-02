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

export function TitleRenderer({
  skeleton,
  titles,
  isLiterature = false,
  renderLanguages = null,
}) {
  return (
    <>
      <Title type="title3" skeleton={skeleton} data-cy={"title-overview"}>
        {titles?.map((title, index, array) => (
          <Fragment key={title}>
            {title} {index < array.length - 1 && <br />}
          </Fragment>
        ))}
        {renderLanguages && isLiterature && (
          <Title
            tag={"div"}
            className={`${titles.length === 1 && styles.display_inline}`}
            type={"title5"}
          >
            {renderLanguages}
          </Title>
        )}
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

  const nonDanishLanguages = mainLanguages?.filter(
    (language) => language?.isoCode !== "dan"
  );

  const renderLanguages =
    mainLanguages?.length > 1
      ? "(flere sprog)"
      : nonDanishLanguages?.length > 0 // If nonDanishLanguage.length > 1, then previous condition strikes through
      ? `(${nonDanishLanguages?.[0]?.display})`
      : null;

  const isLiterature = work?.workTypes?.includes("LITERATURE");

  if (work_response?.isLoading) {
    return <TitleRenderer skeleton={true} />;
  }

  return (
    <TitleRenderer
      titles={titles}
      renderLanguages={renderLanguages}
      isLiterature={isLiterature}
    />
  );
}
