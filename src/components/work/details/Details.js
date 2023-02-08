import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useData } from "@/lib/api/api";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

import * as workFragments from "@/lib/api/work.fragments";
import styles from "./Details.module.css";
import { useMemo } from "react";
import { ParsedCreatorsOrContributors } from "@/lib/manifestationParser";
import { isEqual } from "lodash";
import { flattenMaterialType } from "@/lib/manifestationFactoryUtils";

function CreatorContributorTextHelper({ children }) {
  return (
    <span
      data-cy={"creator-contributor-text-helper"}
      className={styles.creatorContributorTextHelper}
    >
      {children}
    </span>
  );
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
function Details({
  className = "",
  manifestation = {},
  skeleton = false,
  genreAndForm = null,
}) {
  // Translate Context
  const context = { context: "details" };

  // bidrag - contributors + creators - useMemo for performance
  const creatorsAndContributors = useMemo(() => {
    return [
      ...(manifestation?.creators || []),
      ...(manifestation?.contributors || []),
    ];
  }, [manifestation]);

  // languages - main + subtitles + spoken - useMemo for performance;
  const languages = useMemo(() => {
    const main =
      manifestation?.languages?.main?.map((mlang) => mlang.display) || [];
    const spoken =
      manifestation?.languages?.spoken?.map((spok) => spok.display) || [];
    const subtitles =
      manifestation?.languages?.subtitles.map((sub) => sub.display) || [];
    const mixed = [...main, ...spoken, ...subtitles];
    // filter out duplicates
    return [...new Set(mixed)];
  }, [manifestation]);

  const materialType = manifestation?.materialTypes?.[0]?.specific;
  const subtitle = Translate({
    ...context,
    label: "subtitle",
    vars: [materialType],
  });
  return (
    <Section
      title={Translate({ ...context, label: "title" })}
      space={{ top: "var(--pt8)", bottom: "var(--pt4)" }}
      className={`${className}`}
      subtitle={subtitle}
    >
      <Row className={`${styles.details}`}>
        {manifestation.languages && (
          <Col xs={6} md={{ span: 3 }}>
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={2}
            >
              {Translate({ ...context, label: "language" })}
            </Text>
            <Text type="text4" skeleton={skeleton} lines={0}>
              {languages && languages.join(", ")}
            </Text>
          </Col>
        )}
        {manifestation.physicalDescriptions && (
          <Col xs={6} md={{ span: 3 }}>
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={2}
            >
              {Translate({ ...context, label: "physicalDescription" })}
            </Text>
            {manifestation.physicalDescriptions.map((description, i) => {
              return (
                <Text
                  type="text4"
                  skeleton={skeleton}
                  lines={0}
                  key={`${description.summary}-${i}`}
                >
                  {description.summary}
                </Text>
              );
            })}
          </Col>
        )}

        {manifestation.edition?.publicationYear?.display && (
          <Col xs={6} md={{ span: 3 }}>
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={2}
            >
              {Translate({ ...context, label: "released" })}
            </Text>
            <Text type="text4" skeleton={skeleton} lines={0}>
              {manifestation.edition.publicationYear.display}
            </Text>
          </Col>
        )}
        <Col xs={6} md={{ span: 3 }}>
          <Text
            type="text3"
            className={styles.title}
            skeleton={skeleton}
            lines={3}
          >
            {Translate({ ...context, label: "contribution" })}
          </Text>
          {creatorsAndContributors?.length > 0 && (
            <ParsedCreatorsOrContributors
              creatorsOrContributors={creatorsAndContributors}
              Tag={CreatorContributorTextHelper}
            />
          )}
        </Col>

        {genreAndForm && genreAndForm.length > 0 && (
          <Col
            xs={{ span: 6, offset: 0 }}
            md={{ span: 3, offset: 0 }}
            data-cy="genre-form-container"
          >
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={2}
              dataCy="genre-form-title"
            >
              {Translate({ ...context, label: "genre/form" })}
            </Text>
            <Text
              type="text4"
              skeleton={skeleton}
              lines={0}
              dataCy="text-genre-form"
            >
              {genreAndForm.join(", ")}
            </Text>
          </Col>
        )}
      </Row>
    </Section>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function DetailsSkeleton(props) {
  const mock = {
    language: ["..."],
    physicalDescription: "...",
    datePublished: "...",
    creators: [{ type: "...", name: "..." }],
  };

  return (
    <Details
      {...props}
      manifestation={mock}
      className={`${props.className} ${styles.skeleton}`}
      skeleton={true}
    />
  );
}

/**
 * Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Wrap(props) {
  const { workId, type } = props;

  const { data, isLoading, error } = useData(
    workFragments.fbiOverviewDetail({ workId })
  );

  if (error) {
    return null;
  }

  if (isLoading) {
    return <DetailsSkeleton {...props} />;
  }

  const manifestations = data?.work?.manifestations?.all;

  // find the selected materialType (manifestation), use first manifestation as fallback
  const manifestationByMaterialType =
    manifestations?.find((manifestation) => {
      return isEqual(flattenMaterialType(manifestation), type);
    }) || manifestations?.[0];

  const genreAndForm = data?.work?.genreAndForm || [];

  return (
    <Details
      {...props}
      manifestation={manifestationByMaterialType}
      genreAndForm={genreAndForm}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.arrayOf(PropTypes.string),
  skeleton: PropTypes.bool,
};
