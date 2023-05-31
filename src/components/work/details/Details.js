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
import TjoolTjip from "@/components/base/tjooltjip";

function DefaultDetailValues({ values }) {
  return (
    <Text type="text4" lines={2}>
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
function Details({ className = "", manifestation = {}, work = {} }) {
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
        <Col xs={12}>
          <div className={styles.container}>
            {fieldsToShow &&
              fieldsToShow.map((field, index) => {
                const fieldName = Object.keys(field)[0];

                return (
                  !isEmpty(field[fieldName].value) && (
                    /** this is the label **/
                    <div className={styles.item} key={index}>
                      <Text
                        type="text3"
                        className={`${styles.title} ${
                          field[fieldName]?.tooltip ? styles.txtInline : ""
                        }`}
                        lines={2}
                        tag="span"
                      >
                        {field[fieldName].label}
                      </Text>
                      {/** some labels has a tooltip attached .. **/}
                      {field[fieldName]?.tooltip && (
                        <TjoolTjip
                          labelToTranslate={field[fieldName].tooltip}
                          customClass={styles.tooltipinline}
                        ></TjoolTjip>
                      )}
                      {/** some fields has a custom jsx parser .. **/}
                      {field[fieldName].jsxParser ? (
                        field[fieldName].jsxParser({
                          values: field[fieldName].value,
                        })
                      ) : (
                        <DefaultDetailValues values={field[fieldName].value} />
                      )}
                    </div>
                  )
                );
              })}
          </div>
        </Col>
      </Row>
    </Section>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @returns {JSX.Element}
 */
export function DetailsSkeleton() {
  const texts = [1, 2, 3, 4, 5, 6];
  return (
    <Section
      title={Translate({ context: "details", label: "title" })}
      space={{ top: "var(--pt8)", bottom: "var(--pt4)" }}
      subtitle=" ... "
    >
      <Row className={`${styles.details}`}>
        {texts.map((txt) => (
          <Col xs={6} md={3} key={`skeleton-${txt}`}>
            <Text
              type="text3"
              className={styles.title}
              lines={2}
              skeleton={true}
            >
              ...
            </Text>
          </Col>
        ))}
      </Row>
    </Section>
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
    return <DetailsSkeleton />;
  }
  const manifestations = data?.work?.manifestations?.mostRelevant;

  // find the selected materialType (manifestation), use first manifestation as fallback
  const manifestationByMaterialType =
    manifestations?.find((manifestation) => {
      return isEqual(flattenMaterialType(manifestation), type);
    }) || manifestations?.[0];

  // attach relations for manifestation to display
  if (manifestationByMaterialType)
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
