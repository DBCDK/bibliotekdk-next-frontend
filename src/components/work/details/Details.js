import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import { useData } from "@/lib/api/api";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

import * as workFragments from "@/lib/api/work.fragments";
import styles from "./Details.module.css";
import { useMemo } from "react";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Details({
  className = "",
  data = {},
  skeleton = false,
  genreAndForm = null,
}) {
  // Translate Context
  const context = { context: "details" };

  // bidrag - contributors + creators - useMemo for performance
  const contributors = useMemo(() => {
    const contributors_tmp =
      data?.contributors?.map((contrib) => contrib.display) || [];
    const creators = data?.creators?.map((creator) => creator.display);
    return [...creators, ...contributors_tmp];
  }, [data]);

  // languages - main + subtitles + spoken - useMemo for performance;
  const languages = useMemo(() => {
    const main = data?.languages?.main?.map((mlang) => mlang.display) || [];
    const spoken = data?.languages?.spoken?.map((spok) => spok.display) || [];
    const subtitles =
      data?.languages?.subtitles.map((sub) => sub.display) || [];
    const mixed = [...main, ...spoken, ...subtitles];
    // filter out duplicates
    return [...new Set(mixed)];
  }, [data]);

  return (
    <Section
      title={Translate({ ...context, label: "title" })}
      space={{ top: "var(--pt8)", bottom: "var(--pt4)" }}
      className={`${className}`}
    >
      <Row className={`${styles.details}`}>
        {data.languages && (
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
        {data.physicalDescriptions && (
          <Col xs={6} md={{ span: 3 }}>
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={2}
            >
              {Translate({ ...context, label: "physicalDescription" })}
            </Text>
            {data.physicalDescriptions.map((description, i) => {
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

        {data.edition?.publicationYear?.display && (
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
              {data.edition.publicationYear.display}
            </Text>
          </Col>
        )}
        {contributors && contributors.length > 0 && (
          <Col xs={6} md={{ span: 3 }}>
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={3}
            >
              {Translate({ ...context, label: "contribution" })}
            </Text>
            {contributors.map((display, i) => {
              // Array length
              const l = contributors.length;
              // Trailing comma
              const t = i + 1 === l ? "" : ", ";
              return (
                <Text
                  type="text4"
                  key={`${display}-${i}`}
                  skeleton={skeleton}
                  lines={0}
                >
                  {display + t}
                </Text>
              );
            })}
          </Col>
        )}

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
              {genreAndForm.map((subject, index) => {
                // Trailing comma
                const t = index + 1 === genreAndForm.length ? "" : ", ";
                return subject + t;
              })}
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
      data={mock}
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
 * @returns {component}
 */
export default function Wrap(props) {
  const { workId, type } = props;

  const { data, isLoading, error } = useData(
    workFragments.overViewDetails({ workId })
  );

  if (error) {
    return null;
  }

  if (isLoading) {
    return <DetailsSkeleton {...props} />;
  }

  // find the selected materialType (manifestation), use first manifestation as fallback
  const manifestationByMaterialType =
    data?.work?.manifestations?.all.find((element) =>
      element.materialTypes.find((matType) => {
        return matType.specific.toLowerCase() === type?.toLowerCase();
      })
    ) || data?.work?.manifestations?.all[0];

  const genreAndForm = data?.work?.genreAndForm || [];

  return (
    <Details
      {...props}
      data={manifestationByMaterialType}
      genreAndForm={genreAndForm}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
