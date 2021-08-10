import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import { useData } from "@/lib/api/api";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

import * as workFragments from "@/lib/api/work.fragments";

import styles from "./Details.module.css";
import { cyKey } from "@/utils/trim";
import Link from "@/components/base/link";
import Title from "@/components/base/title/Title";
import { array } from "@storybook/addon-knobs";

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
  subjects = null,
}) {
  // Translate Context
  const context = { context: "details" };
  const contributors =
    data.creators &&
    data.creators.filter((creator) => creator.type && creator.type !== "aut");

  // filter out duplicate languages
  const languages =
    data.language &&
    data.language.filter((lang, index, self) => {
      return self.indexOf(lang) === index;
    });

  return (
    <Section
      title={Translate({ ...context, label: "title" })}
      topSpace={true}
      className={`${className}`}
    >
      <Row className={`${styles.details}`}>
        {data.language && (
          <Col xs={6} md>
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
        {data.physicalDescription && (
          <Col xs={6} md>
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={2}
            >
              {Translate({ ...context, label: "physicalDescription" })}
            </Text>
            <Text type="text4" skeleton={skeleton} lines={0}>
              {data.physicalDescription}
            </Text>
          </Col>
        )}
        {data.datePublished && (
          <Col xs={6} md>
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={2}
            >
              {Translate({ ...context, label: "released" })}
            </Text>
            <Text type="text4" skeleton={skeleton} lines={0}>
              {data.datePublished}
            </Text>
          </Col>
        )}
        {contributors && contributors.length > 0 && (
          <Col xs={6} md>
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={3}
            >
              {Translate({ ...context, label: "contribution" })}
            </Text>
            {contributors.map((c, i) => {
              // Array length
              const l = contributors.length;
              // Trailing comma
              const t = i + 1 === l ? "" : ", ";
              return (
                <Text
                  type="text4"
                  key={`${c}-${i}`}
                  skeleton={skeleton}
                  lines={0}
                >
                  {c.name +
                    (c.functionSingular && ` (${c.functionSingular})`) +
                    t}
                </Text>
              );
            })}
          </Col>
        )}
      </Row>

      {subjects && subjects.length > 0 && (
        <Row className={styles.details}>
          <Col xs={{ span: 6, offset: 0 }} md={{ span: 3, offset: 0 }}>
            <Text
              type="text3"
              className={styles.title}
              skeleton={skeleton}
              lines={2}
            >
              {Translate({ ...context, label: "genre/form" })}
            </Text>
            <Text type="text4" skeleton={skeleton} lines={0}>
              {subjects.map((subject, index) => {
                // Trailing comma
                const t = index + 1 === subjects.length ? "" : ", ";
                return subject.value + t;
              })}
            </Text>
          </Col>
        </Row>
      )}
    </Section>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
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
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  const { workId, type } = props;

  const { data, isLoading, error } = useData(workFragments.details({ workId }));

  if (error) {
    return null;
  }

  if (isLoading) {
    return <DetailsSkeleton {...props} />;
  }

  // find the selected matieralType, use first element as fallback
  const materialType =
    data.work.materialTypes.find((element) => element.materialType === type) ||
    data.work.materialTypes[0];

  // pass subjects also - to show genre and form
  const allsubjects = data?.work?.subjects;
  // Include wanted subject types
  const include = ["DBCO", "genre", null];
  // filter out other subjects
  const subjects = allsubjects.filter((s) => include.includes(s.type));
  // filter out duplicates
  const uniquesubjects = subjects.filter(
    (subject, index, self) =>
      index === self.findIndex((unique) => unique.value === subject.value)
  );

  return (
    <Details
      {...props}
      data={materialType?.manifestations?.[0]}
      subjects={uniquesubjects}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
