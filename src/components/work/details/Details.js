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

function parseLanguages(manifestation) {
  // languages - main + subtitles + spoken - useMemo for performance;
  const main =
    manifestation?.languages?.main?.map((mlang) => mlang.display) || [];
  const spoken =
    manifestation?.languages?.spoken?.map((spok) => spok.display) || [];
  const subtitles =
    manifestation?.languages?.subtitles.map((sub) => sub.display) || [];
  const mixed = [...main, ...spoken, ...subtitles];
  // filter out duplicates
  return [...new Set(mixed)].join(", ");
}

function parseGenreAndForm(work) {
  const genreForm = work?.genreAndForm || [];
  return genreForm.join(", ");
}

function parsePhysicalDescriptions(manifestation) {
  return manifestation?.physicalDescriptions
    ?.map((description) => description.summary)
    .join(" ");
}

function parseContributors(manifestation) {
  const contributors = [
    ...(manifestation?.creators || []),
    ...(manifestation?.contributors || []),
  ];

  return (
    contributors?.length > 0 && (
      <ParsedCreatorsOrContributors
        creatorsOrContributors={contributors}
        Tag={CreatorContributorTextHelper}
      />
    )
  );
}

function parseMovieContributors(manifestation) {
  const actors = manifestation?.contributors?.filter((cont) =>
    cont?.roles?.find((rol) => rol.functionCode === "act")
  );

  const others =
    manifestation?.contributors?.manifestation?.contributors?.filter((cont) =>
      cont?.roles?.find((rol) => rol.functionCode !== "act")
    );
  const actorslabel =
    actors?.length > 1
      ? actors?.[0]?.roles?.[0]?.function.plural
      : actors?.[0]?.roles?.[0]?.function.singular;

  const returnObject = {};
  returnObject[actorslabel] = actors?.length > 0 ? actors : null;
  returnObject["ophav"] = others?.length > 0 ? others : null;

  return returnObject;
}

function parseMovieCreators(manifestation) {
  return manifestation?.creators || null;
}

function parsePersonAndFunction(person) {
  const display = person?.display;
  const roles = person?.roles?.map((role) => role?.function?.singular || "");
  return display + (roles.length > 0 ? " (" + roles.join(", ") + ")" : "");
}

/**
 * jsxParser for movie creators
 * @param values
 * @param skeleton
 * @returns {unknown[]}
 * @constructor
 */
function MovieCreatorValues({ values, skeleton }) {
  return (
    values &&
    values.map((person, index) => {
      return (
        <Text type="text4" skeleton={skeleton} lines={0} key={index}>
          {parsePersonAndFunction(person)}
        </Text>
      );
    })
  );
}

function fieldsForRows(manifestation, work, context) {
  const materialType = work?.workTypes?.[0] || null;

  const fieldsMap = {
    DEFAULT: [
      {
        languages: {
          label: Translate({ ...context, label: "language" }),
          value: parseLanguages(manifestation),
        },
      },
      {
        physicalDescriptions: {
          label: Translate({ ...context, label: "physicalDescription" }),
          value: parsePhysicalDescriptions(manifestation),
        },
      },
      {
        publicationYear: {
          label: Translate({ ...context, label: "released" }),
          value: manifestation?.edition?.publicationYear?.display || "",
        },
      },
      {
        contributors: {
          label: Translate({ ...context, label: "contribution" }),
          value: parseContributors(manifestation),
        },
      },
      {
        genre: {
          label: Translate({ ...context, label: "genre/form" }),
          value: parseGenreAndForm(work),
        },
      },
      {
        hundeprut: {
          label: "hundeprut",
          value: "",
        },
      },
    ],
    MUSIK: [
      {
        genre: {
          label: Translate({ ...context, label: "genre/form" }),
          value: "hest",
        },
      },
    ],
    MOVIE: [
      {
        contributors: {
          label: "",
          value: parseMovieContributors(manifestation),
          jsxParser: MovieContributorValues,
        },
      },
      {
        creators: {
          label: Translate({ ...context, label: "creators" }),
          value: parseMovieCreators(manifestation),
          jsxParser: MovieCreatorValues,
        },
      },
    ],
  };

  const merged = [
    ...fieldsMap["DEFAULT"].filter((def) => {
      const fisk =
        fieldsMap[materialType] &&
        fieldsMap[materialType].find((mat) => mat[Object.keys(def)[0]]);
      return !fisk;
    }),
    ...(fieldsMap[materialType] || []),
  ];

  return merged;
}

/**
 * jsxParser for movies - contributors. Parse given values for html output - @see parseMovieContributors for given values
 * @param values {object}
 *  eg. {skuespillere:["jens", "hans", ..], ophav:["kurt", ...]}
 * @param skeleton
 * @returns {any[]}
 * @constructor
 */
function MovieContributorValues({ values, skeleton }) {
  return Object.keys(values).map(
    (val) =>
      values[val] && (
        <>
          <Text
            type="text3"
            className={styles.title}
            skeleton={skeleton}
            lines={2}
          >
            {val}
          </Text>
          {values[val].map((person, index) => {
            return (
              <Text type="text4" skeleton={skeleton} lines={0} key={index}>
                {person?.display}
              </Text>
            );
          })}
        </>
      )
  );
}

function DefaultDetailValues({ values, skeleton }) {
  return (
    <Text type="text4" skeleton={skeleton} lines={0}>
      {values}
    </Text>
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
  work = {},
  skeleton = false,
}) {
  // Translate Context
  const context = { context: "details" };

  // this materialtype is for displaying subtitle in section (seneste udgave)
  const materialType = manifestation?.materialTypes?.[0]?.specific;
  const subtitle = Translate({
    ...context,
    label: "subtitle",
    vars: [materialType],
  });

  const fieldsToShow = useMemo(() => {
    return fieldsForRows(manifestation, work, context);
  }, [manifestation, materialType]);

  return (
    <Section
      title={Translate({ ...context, label: "title" })}
      space={{ top: "var(--pt8)", bottom: "var(--pt4)" }}
      className={`${className}`}
      subtitle={subtitle}
    >
      <Row className={`${styles.details}`}>
        {fieldsToShow &&
          fieldsToShow.map((field) => {
            const fieldName = Object.keys(field)[0];
            return (
              field[fieldName].value && (
                <Col xs={6} md={{ span: 3 }}>
                  <Text
                    type="text3"
                    className={styles.title}
                    skeleton={skeleton}
                    lines={2}
                  >
                    {field[fieldName].label}
                  </Text>
                  {/** some fields has a custom jsx parser ..
                   @TODO .. empty values should not be shown **/}
                  {field[fieldName].jsxParser ? (
                    field[fieldName].jsxParser({
                      values: field[fieldName].value,
                      skeleton: skeleton,
                    })
                  ) : (
                    <DefaultDetailValues
                      skeleton={skeleton}
                      values={field[fieldName].value}
                    />
                  )}
                </Col>
              )
            );
          })}
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
      work={data?.work}
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
