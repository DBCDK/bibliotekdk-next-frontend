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

import isEqual from "lodash/isEqual";
import { flattenMaterialType } from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";

import { fieldsForRows } from "@/components/work/details/details.utils";
import { workRelationsWorkTypeFactory } from "@/lib/workRelationsWorkTypeFactoryUtils";

function DefaultDetailValues({ values, skeleton }) {
  return (
    <Text type="text4" lines={0} skeleton={skeleton}>
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
function Details({ className = "", manifestation = {}, work = {}, skeleton }) {
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
  }, [manifestation, materialType, work, context]);

  //const fieldsToShow = fieldsForRows(manifestation, work, context);
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
              !isEmpty(field[fieldName].value) && (
                /** this is the label **/
                <Col xs={6} md={{ span: 3 }}>
                  <Text type="text3" className={styles.title} lines={2}>
                    {field[fieldName].label}
                  </Text>
                  {/** some fields has a custom jsx parser .. **/}
                  {field[fieldName].jsxParser ? (
                    field[fieldName].jsxParser({
                      values: field[fieldName].value,
                    })
                  ) : (
                    <DefaultDetailValues
                      values={field[fieldName].value}
                      skeleton={skeleton}
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

  const {
    data,
    isLoading: overViewIsLoading,
    error,
  } = useData(workFragments.fbiOverviewDetail({ workId }));

  const {
    data: relationData,
    isLoading: relationsIsLoading,
    error: relationsError,
  } = useData(workFragments.workForWorkRelationsWorkTypeFactory({ workId }));

  const { groupedRelations } = workRelationsWorkTypeFactory(relationData?.work);

  if (error || relationsError) {
    return null;
  }

  if (overViewIsLoading || relationsIsLoading) {
    return <DetailsSkeleton {...props} />;
  }
  const manifestations = data?.work?.manifestations?.mostRelevant;

  // find the selected materialType (manifestation), use first manifestation as fallback
  const manifestationByMaterialType =
    manifestations?.find((manifestation) => {
      return isEqual(flattenMaterialType(manifestation), type);
    }) || manifestations?.[0];

  // attach relations for manifestation to display
  manifestationByMaterialType.relations = groupedRelations;

  return (
    <Details
      {...props}
      manifestation={manifestationByMaterialType}
      work={data?.work}
      skeleton={overViewIsLoading || relationsIsLoading}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.arrayOf(PropTypes.string),
  skeleton: PropTypes.bool,
};
